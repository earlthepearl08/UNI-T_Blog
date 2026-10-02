#!/usr/bin/env python3
"""
Import public-safe SRP from a UNI-T pricelist HTML web app into products-catalog.json.

Usage:
  python3 scripts/import-srp-from-webapp.py /path/to/UNI-T_Pricelist_WebApp.html

Rules:
  - Writes only `srp` (int, PHP), `currency` ("PHP"), and `priceAsOf` onto matched products.
  - Never copies dealer/distributor/MOQ or images from the web app.
  - Match: exact model (case-insensitive), then compact (strip spaces/-/_/), then
    regional variants (e.g. UT12S <- UT12S-EU/ROW) when all candidate SRPs agree.
  - Does not invent prices for family SKUs (MSO7000X, LM40, etc.).
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = ROOT / "content" / "products-catalog.json"
RFQ_THRESHOLD = 100_000
REGION_SUFFIXES = ("-EU", "-ROW", "-US", "-UK", "-AU", "-CN")


def extract_db(html: str) -> dict:
    m = re.search(r"const\s+DB\s*=\s*", html)
    if not m:
        raise SystemExit("Could not find `const DB =` in HTML web app")
    start = m.end()
    if html[start] != "{":
        raise SystemExit("Expected object after `const DB =`")
    depth = 0
    i = start
    in_str = False
    esc = False
    quote = None
    while i < len(html):
        c = html[i]
        if in_str:
            if esc:
                esc = False
            elif c == "\\":
                esc = True
            elif c == quote:
                in_str = False
        else:
            if c in ('"', "'"):
                in_str = True
                quote = c
            elif c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    return json.loads(html[start : i + 1])
        i += 1
    raise SystemExit("Unterminated DB object in HTML")


def norm(model: str) -> tuple[str, str]:
    s = (model or "").upper().strip()
    s = s.replace("×", "X").replace("–", "-").replace("—", "-")
    s = re.sub(r"\s+", " ", s)
    compact = re.sub(r"[\s\-_/]+", "", s)
    return s, compact


def build_price_index(items: list[dict]) -> dict[str, int]:
    by_exact: dict[str, int] = {}
    conflicts: list[tuple[str, int, int]] = []
    for it in items:
        exact, _ = norm(it["model"])
        srp = it.get("srp")
        if srp is None:
            continue
        try:
            srp_i = int(srp)
        except (TypeError, ValueError):
            continue
        if exact in by_exact and by_exact[exact] != srp_i:
            conflicts.append((exact, by_exact[exact], srp_i))
        else:
            by_exact[exact] = srp_i
    if conflicts:
        print("WARNING: conflicting SRPs for same model:", conflicts[:10], file=sys.stderr)
    return by_exact


def match_srp(model: str, by_exact: dict[str, int]) -> tuple[int | None, str | None]:
    exact, compact = norm(model)
    if exact in by_exact:
        return by_exact[exact], "exact"

    for pm, srp in by_exact.items():
        _, pc = norm(pm)
        if pc == compact:
            return srp, "compact"

    cands: list[tuple[str, int]] = []
    for suf in REGION_SUFFIXES:
        for key in (exact + suf, exact.replace(" ", "") + suf):
            if key in by_exact:
                cands.append((key, by_exact[key]))
    if cands:
        srps = {s for _, s in cands}
        if len(srps) == 1:
            return next(iter(srps)), "regional-same-srp"
        return None, "regional-conflict"

    for suf in REGION_SUFFIXES:
        if exact.endswith(suf):
            base = exact[: -len(suf)]
            if base in by_exact:
                return by_exact[base], "strip-region"

    return None, None


def infer_price_as_of(meta: dict) -> str:
    """Best-effort YYYY-MM from web app meta.effective string."""
    effective = (meta or {}).get("effective") or ""
    # e.g. "Prices effective September 2026, subject to change without notice"
    months = {
        "january": "01",
        "february": "02",
        "march": "03",
        "april": "04",
        "may": "05",
        "june": "06",
        "july": "07",
        "august": "08",
        "september": "09",
        "october": "10",
        "november": "11",
        "december": "12",
    }
    m = re.search(
        r"(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})",
        effective,
        re.I,
    )
    if m:
        return f"{m.group(2)}-{months[m.group(1).lower()]}"
    y = re.search(r"\b(20\d{2})\b", effective)
    return y.group(1) if y else "unknown"


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("html_path", type=Path, help="Path to UNI-T_Pricelist_WebApp.html")
    ap.add_argument(
        "--dry-run",
        action="store_true",
        help="Print match stats only; do not write catalog",
    )
    ap.add_argument(
        "--report",
        type=Path,
        default=None,
        help="Optional JSON report path for match details",
    )
    args = ap.parse_args()

    html = args.html_path.read_text(encoding="utf-8", errors="replace")
    db = extract_db(html)
    items = list(db.get("meters", {}).get("items") or []) + list(
        db.get("instruments", {}).get("items") or []
    )
    by_exact = build_price_index(items)
    price_as_of = infer_price_as_of(db.get("meta") or {})
    effective_note = (db.get("meta") or {}).get("effective") or ""

    catalog = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    products = []
    for cat in catalog.get("categories") or []:
        products.extend(cat.get("products") or [])

    matched = []
    unmatched = []
    ambiguous = []
    methods = Counter()

    for p in products:
        # Clear prior public price fields so a refresh is authoritative
        p.pop("srp", None)
        p.pop("currency", None)
        p.pop("priceAsOf", None)

        srp, method = match_srp(p.get("model") or "", by_exact)
        if method == "regional-conflict":
            ambiguous.append(p.get("model"))
            continue
        if srp is None:
            unmatched.append(p.get("model"))
            continue
        p["srp"] = int(srp)
        p["currency"] = "PHP"
        p["priceAsOf"] = price_as_of
        matched.append({"model": p["model"], "srp": int(srp), "method": method})
        methods[method] += 1

    rfq_threshold = sum(1 for m in matched if m["srp"] > RFQ_THRESHOLD)
    show_srp = sum(1 for m in matched if m["srp"] <= RFQ_THRESHOLD)
    rfq_missing = len(unmatched) + len(ambiguous)

    # Public meta only — full unmatched list stays in --report, not the deployed catalog.
    catalog["pricing"] = {
        "currency": "PHP",
        "priceAsOf": price_as_of,
        "effectiveNote": effective_note,
        "source": "UNI-T pricelist HTML web app (SRP column only)",
        "rfqThresholdPhp": RFQ_THRESHOLD,
        "matched": len(matched),
        "showSrp": show_srp,
        "rfqByThreshold": rfq_threshold,
        "rfqByMissing": rfq_missing,
    }

    report = {
        "html": str(args.html_path),
        "plItems": len(items),
        "catalogProducts": len(products),
        "matched": len(matched),
        "methods": dict(methods),
        "showSrp": show_srp,
        "rfqByThreshold": rfq_threshold,
        "rfqByMissing": rfq_missing,
        "unmatched": unmatched,
        "ambiguous": ambiguous,
        "sampleMatched": matched[:12],
        "priceAsOf": price_as_of,
        "effectiveNote": effective_note,
    }

    print(json.dumps({k: v for k, v in report.items() if k != "unmatched"}, indent=2))
    print(f"unmatched ({len(unmatched)}): " + ", ".join(unmatched[:20]) + ("..." if len(unmatched) > 20 else ""))

    if args.report:
        args.report.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
        print(f"Wrote report {args.report}")

    if args.dry_run:
        print("Dry run — catalog not written")
        return 0

    CATALOG_PATH.write_text(
        json.dumps(catalog, indent=1, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"Updated {CATALOG_PATH} ({len(matched)} products with srp)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
