/**
 * UNI-T Philippines — lead webhook for Google Sheets.
 *
 * Paste into Extensions -> Apps Script on the sheet that should collect leads,
 * then Deploy -> New deployment -> Web app (Execute as: Me, Access: Anyone) and
 * put the /exec URL into the Vercel env var LEAD_WEBHOOK_URL.
 *
 * Setup notes are in docs/LEAD-DELIVERY.md.
 */

// Leave blank for no email notification, or put an address here to get one per lead.
var NOTIFY_EMAIL = '';

var HEADERS = [
  'Received', 'Name', 'Company', 'Email', 'Phone',
  'Product/model', 'Quantity', 'Message', 'From page', 'User agent'
];

function doPost(e) {
  try {
    var lead = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // First write: lay down the header row and freeze it.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // A leading apostrophe keeps Sheets from evaluating a value that starts with
    // = + - @ as a formula — a message beginning with "=" would otherwise become
    // a #NAME? error and the actual text would be lost.
    function safe(v) {
      var s = (v === null || v === undefined) ? '' : String(v);
      return /^[=+\-@]/.test(s) ? "'" + s : s;
    }

    sheet.appendRow([
      lead.submittedAt ? new Date(lead.submittedAt) : new Date(),
      safe(lead.name), safe(lead.company), safe(lead.email), safe(lead.phone),
      safe(lead.product), safe(lead.quantity), safe(lead.message),
      safe(lead.source), safe(lead.userAgent)
    ]);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: 'New UNI-T inquiry: ' + (lead.product || 'general') + ' — ' + (lead.name || ''),
        replyTo: lead.email || undefined,
        body: [
          'Name: ' + (lead.name || ''),
          'Company: ' + (lead.company || ''),
          'Email: ' + (lead.email || ''),
          'Phone: ' + (lead.phone || ''),
          'Product/model: ' + (lead.product || ''),
          'Quantity: ' + (lead.quantity || ''),
          '', 'Message:', (lead.message || ''),
          '', 'From page: ' + (lead.source || '')
        ].join('\n')
      });
    }

    return json({ ok: true });
  } catch (err) {
    // Return a 200 with ok:false rather than throwing. Apps Script renders an
    // uncaught error as an HTML error page, which the site would read as a
    // failure anyway — but this way the reason shows up in the Vercel log.
    return json({ ok: false, error: String(err) });
  }
}

// Lets you open the /exec URL in a browser to confirm the deployment is live.
function doGet() {
  return json({ ok: true, service: 'unit-ph-lead-webhook' });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
