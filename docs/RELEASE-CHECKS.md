# Release checks — UNI-T Philippines

Run these before every deploy. All are scripted; none need a browser except the
visual pass at the end.

## 1. Structure, links, scripts

```bash
node -e "0" # sanity
python3 - <<'PY'
from html.parser import HTMLParser
import io, glob, re, os, urllib.parse, json, subprocess
VOID={'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
class P(HTMLParser):
    def __init__(s): super().__init__(convert_charrefs=True); s.stack=[]; s.err=[]
    def handle_starttag(s,t,a):
        if t not in VOID: s.stack.append(t)
    def handle_endtag(s,t):
        if t in VOID: return
        if s.stack and s.stack[-1]==t: s.stack.pop()
        elif t in s.stack:
            i=len(s.stack)-1-s.stack[::-1].index(t); s.err.append(t); del s.stack[i:]
        else: s.err.append(t)
files=[f for f in glob.glob("**/*.html",recursive=True) if "node_modules" not in f]
struct=missing=js_bad=js_n=ld_bad=0; miss=set()
for f in files:
    s=io.open(f,encoding="utf-8").read()
    p=P(); p.feed(s)
    if p.err or [t for t in p.stack if t not in ('html','body','head')]: struct+=1; print("STRUCT",f)
    for m in re.finditer(r'(?:href|src)="([^"#$][^"]*)"', s):
        u=m.group(1)
        if u.startswith(('http','mailto:','tel:','data:','//','javascript:','viber:','whatsapp:','sms:')) or '${' in u or "' +" in u: continue
        c=u.split('#')[0].split('?')[0]
        if not c: continue
        t=c[1:] if c.startswith('/') else os.path.normpath(os.path.join(os.path.dirname(f),c))
        t=urllib.parse.unquote(t)
        if os.path.isdir(t) or os.path.exists(t) or os.path.exists(os.path.join(t,'index.html')): continue
        miss.add((f,c))
    for b in re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', s, re.S):
        try: json.loads(b)
        except Exception: ld_bad+=1; print("LD-JSON",f)
    for b in re.findall(r'<script(?![^>]*\bsrc=)(?![^>]*ld\+json)[^>]*>(.*?)</script>', s, re.S):
        if not b.strip(): continue
        js_n+=1; io.open('/tmp/c.js','w').write(b)
        if subprocess.run(['node','--check','/tmp/c.js'],capture_output=True).returncode: js_bad+=1; print("JS",f)
print(f"files={len(files)} struct={struct} brokenLinks={len(miss)} inlineJS={js_n} jsErrors={js_bad} ldJsonBad={ld_bad}")
for m in list(miss)[:10]: print("  broken:", m)
PY
node --check api/inquiry.js && node --check js/main.js
python3 -c "import json,io; json.load(io.open('content/products-catalog.json'))"
python3 -c "import xml.etree.ElementTree as ET; [ET.parse(f) for f in ['rss.xml','sitemap.xml']]"
```

Expect: `struct=0 brokenLinks=0 jsErrors=0 ldJsonBad=0`.

## 2. Catalog integrity

```bash
node -e "
const c=require('./content/products-catalog.json');
const a=c.categories.flatMap(k=>k.products);
const fs=require('fs');
console.log('products', a.length, '(expect', c.totalProducts + ')');
console.log('sum matches:', a.length===c.totalProducts);
console.log('duplicate models:', a.length-new Set(a.map(p=>p.model)).size);
console.log('broken images:', a.filter(p=>!fs.existsSync('.'+p.image)).length);
console.log('with officialUrl:', a.filter(p=>p.officialUrl).length);
console.log('distinct buy links:', new Set(a.map(p=>p.kinmoSearchUrl)).size);
"
```

Expect: sum matches, 0 duplicates, 0 broken images, distinct buy links == product count.

**After editing `content/products-catalog.json`, bump the cache key** in
`products/index.html` and `tools/compare.html`:

```bash
node -e "
const fs=require('fs'),crypto=require('crypto');
const h=crypto.createHash('sha1').update(fs.readFileSync('content/products-catalog.json')).digest('hex').slice(0,10);
for(const f of ['products/index.html','tools/compare.html'])
  fs.writeFileSync(f, fs.readFileSync(f,'utf8').replace(/const cacheBust = '[^']*';/, \"const cacheBust = '\"+h+\"';\"));
console.log('cacheBust ->', h);
"
```

## 3. Stylesheet cache key

After editing `css/styles.css`, re-stamp every page or users keep the old file:

```bash
V=$(date +%Y%m%d%H%M%S); python3 - "$V" <<'PY'
import io,re,sys,glob
v=sys.argv[1]; n=0
for f in glob.glob("**/*.html",recursive=True):
    if "node_modules" in f: continue
    s=io.open(f,encoding="utf-8").read()
    s2=re.sub(r'href="/css/styles\.css\?v=\d+"', f'href="/css/styles.css?v={v}"', s)
    if s2!=s: io.open(f,"w",encoding="utf-8").write(s2); n+=1
print(f"v={v} on {n} pages")
PY
```

## 4. Feeds

`rss.xml` and `sitemap.xml` are generated. `scripts/generate-rss.js` is **stale**
— it still carries an older page template and will overwrite the category pages
if run. Rebuild feeds only with the inline script used in the release commit, or
fix the generator's templates first (see the banner at the top of the file).

Check: sitemap URL count == HTML files on disk minus `404.html`; RSS item count
== post count; no `Meta Title:` text in either.

## 5. Disclaimers (owner requirement)

Every tool and the catalog must carry the "preliminary basis only" notice, and
it must sit in the page body — not inside `<header>`, the drawer, or `<footer>`.

```bash
python3 - <<'PY'
import io,re,glob
for f in sorted(glob.glob("tools/*.html"))+["products/index.html"]:
    s=io.open(f,encoding="utf-8").read()
    has='tool-disclaimer' in s
    bad=[]
    for tag,pat in [('HEADER',r'<header class="header">.*?</header>'),
                    ('DRAWER',r'<aside class="side-drawer".*?</aside>'),
                    ('FOOTER',r'<footer class="footer">.*?</footer>')]:
        m=re.search(pat,s,re.S)
        if m and 'tool-disclaimer' in m.group(0): bad.append(tag)
    print(('OK  ' if has and not bad else 'BAD '), f, '' if has else 'MISSING', ','.join(bad))
PY
```

Also confirm `/disclaimer.html` and `/privacy.html` exist and that every page
footer links to them (`grep -rl footer-legal --include=*.html . | wc -l`).

## 6. Responsive

No page may scroll horizontally or clip content at 360px. Serve locally and
check 360 / 414 / 768 / 1440 on the homepage, all tool pages, the catalog and a
post. The recurring cause has been a bare `1fr` grid track — it means
`minmax(auto, 1fr)` and cannot shrink below its contents. Always write
`minmax(0, 1fr)` and add `min-width: 0` to grid children.

## 7. Electrical content

Anything that changes a calculator's numbers, a CAT rating, a conductor size or
a breaker rating needs a second pair of eyes from someone qualified. Specifically
re-check after any edit:

- The CAT floor in `power-calculator.html` (`suggestClamp`) and
  `instrument-finder.html` (`SAFETY` / `FLOOR`) — no instrument may be offered
  whose measurement-category voltage is below the working voltage.
- `sizeBranchCircuit()` / `breakerFor()` — the recommended breaker must be able
  to carry the design load AND protect the conductor.
- The ampacity tables carry an explicit basis (75°C column, 30°C ambient, ≤3
  conductors) and say that derating and voltage drop are NOT applied.
