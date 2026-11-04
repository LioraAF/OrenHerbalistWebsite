import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const workbookPath = "/Users/lfeldblum/Oren/Oren_Herbalist_Site/outputs/oren_outreach_contacts_2026_10_29/oren_herbalist_outreach_contacts.xlsx";
const previewDir = "/Users/lfeldblum/Oren/Oren_Herbalist_Site/outputs/oren_outreach_contacts_2026_10_29";
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(workbookPath));
const sheet = workbook.worksheets.getItem("Leads");

const values = sheet.getRange("A7:U86").values;
const records = values.map((row, index) => ({
  rowNumber: index + 7,
  priority: row[0],
  category: row[1],
  organization: row[2],
  branch: row[3],
  email: row[7],
  status: row[17],
  notes: row[20],
}));

function findRecord(organization, branch = null) {
  const matches = records.filter((record) =>
    record.organization === organization && (branch === null || record.branch === branch)
  );
  if (matches.length !== 1) {
    throw new Error(`Expected one row for ${organization}${branch ? ` / ${branch}` : ""}; found ${matches.length}`);
  }
  return matches[0];
}

function appendNote(existing, addition) {
  const clean = typeof existing === "string" ? existing.trim() : "";
  return clean ? `${clean}\n${addition}` : addition;
}

function write(row, column, value) {
  sheet.getRange(`${column}${row}`).values = [[value]];
}

const sentDate = new Date("2026-10-29T00:00:00.000Z");
const sentStatus = "Sent – no bounce observed";
const sentNextAction = "Check replies and delivery failures before follow-up";
const commonSentNote = "Sent 29 Oct 2026 from liora1018@gmail.com. Subject: הצעה לסדנת צמחי מרפא חווייתית עם אורן הרבליסט. Individually addressed; included the Google Maps and Instagram links.";

const successful = [
  { organization: "מכינת גליל עליון", email: "info@mgalil.org", audience: "Audience adaptation: enrichment activity for participants." },
  { organization: "מכינת ימין אורד", email: "nurit@derechkfar.org.il", audience: "Audience adaptation: enrichment activity for participants." },
  { organization: "מדרשת תבור", email: "Info@tavor.org.il", audience: "Audience adaptation: enrichment activity for participants." },
  { organization: "מכינת חנתון", email: "echannaton@echannaton.org", audience: "Audience adaptation: enrichment activity for participants." },
  { organization: "מכינת מיצר", email: "office@meitzar.org.il", audience: "Audience adaptation: enrichment activity for participants. First attempt to office@meizar.org.il failed because the domain was not found; resent to office@meitzar.org.il, with no failure notice observed by the last check." },
  { organization: "מכינת העמ\"ק", email: "minhal@chivruta.org", audience: "Audience adaptation: enrichment activity for participants." },
  { organization: "מכינת חביבה רייק", email: "haviva.giusim@gmail.com", audience: "Audience adaptation: enrichment activity for participants." },
  { organization: "מכינת אבנר עכו", email: "sarah@avnerakko.co.il", audience: "Audience adaptation: enrichment activity for participants." },
  { organization: "מכינת ערבה", branch: "Hatzava branch", email: "office@aravaspirit.org.il", audience: "Audience adaptation: enrichment activity for participants. Email address added from a public source." },
  { organization: "מכינת מלח הארץ", email: "Melach.Aretz@Gmail.com", audience: "Audience adaptation: enrichment activity for participants." },
  { organization: "דרך ארץ – תוכניות אופק", email: "office@derecheretz.org.il", audience: "Audience adaptation: enrichment activity for participants." },
  { organization: "עמותת איילים", email: "office@ayalim.org.il", audience: "Audience adaptation: community activity for student villages; requested forwarding to the relevant village coordinators." },
  { organization: "תוצרת הארץ", email: "office@tozeret.com", audience: "Audience adaptation: community activity for student communities; requested forwarding to the relevant coordinators." },
  { organization: "כפרי הסטודנטים של בני עקיבא", email: "student@bna.org.il", audience: "Audience adaptation: community activity for student villages; requested forwarding to the relevant village coordinators." },
  { organization: "כפר הסטודנטים בני עקיבא", branch: "Beit Shean", email: "barnitz80@gmail.com", audience: "Audience adaptation: community activity for the student village. Email address added from a public source." },
  { organization: "התאחדות הסטודנטים והסטודנטיות הארצית", email: "office@nuis.co.il", audience: "Audience adaptation: culture and group-bonding activity for students." },
  { organization: "אגודת הסטודנטים תל-חי", email: "agudaeast@gmail.com", audience: "Audience adaptation: culture and group-bonding activity for students." },
  { organization: "אס\"ט – אגודת הסטודנטים בטכניון", email: "culture@asat.technion.ac.il", audience: "Audience adaptation: culture and group-bonding activity for students." },
  { organization: "אגודת הסטודנטים אוניברסיטת חיפה", email: "StudRevaha@univ.haifa.ac.il", audience: "Audience adaptation: culture and group-bonding activity for students." },
  { organization: "אגודת הסטודנטים אורנים", email: "michal_ka@oranim.ac.il", audience: "Audience adaptation: culture and group-bonding activity for students." },
  { organization: "אגודת הסטודנטים גליל מערבי", email: "aguda@wgalil.ac.il", audience: "Audience adaptation: culture and group-bonding activity for students." },
  { organization: "אגודת הסטודנטים כנרת", email: "office.aguda@mx.kinneret.ac.il", audience: "Audience adaptation: culture and group-bonding activity for students." },
  { organization: "מרכז צעירים יקנעם", email: "gili@bthere.org.il", audience: "Audience adaptation: activity for young adults in the local area." },
  { organization: "המרכזית – מרכז צעירים קריית שמונה", email: "rakezet.k8@gmail.com", audience: "Audience adaptation: activity for young adults in the local area." },
  { organization: "אקים ישראל – אזור צפון", email: "ora.h@akim.org.il", audience: "Audience adaptation: coordinate with staff regarding participant needs, accessibility, and sensitivities to materials and scents." },
];

for (const item of successful) {
  const record = findRecord(item.organization, item.branch ?? null);
  write(record.rowNumber, "H", item.email);
  write(record.rowNumber, "R", sentStatus);
  write(record.rowNumber, "S", sentDate);
  write(record.rowNumber, "T", sentNextAction);
  write(record.rowNumber, "U", appendNote(record.notes, `${commonSentNote} ${item.audience}`));
  sheet.getRange(`A${record.rowNumber}:U${record.rowNumber}`).format.rowHeight = item.audience.length > 180 ? 100 : 80;
}

const negev = findRecord("מכינת הנגב");
write(negev.rowNumber, "R", "Delivery failed");
write(negev.rowNumber, "S", sentDate);
write(negev.rowNumber, "T", "Verify current email by phone or through the website");
write(negev.rowNumber, "U", appendNote(negev.notes, "Attempted 29 Oct 2026 from liora1018@gmail.com to info@magal-negev.org. Address not found; do not treat as delivered or read."));
sheet.getRange(`A${negev.rowNumber}:U${negev.rowNumber}`).format.rowHeight = 90;

const jezreel = findRecord("מרכז צעירים עמק יזרעאל");
write(jezreel.rowNumber, "R", "Delivery failed / recipient rejected");
write(jezreel.rowNumber, "S", sentDate);
write(jezreel.rowNumber, "T", "Call to confirm a suitable email address");
write(jezreel.rowNumber, "U", appendNote(jezreel.notes, "Two attempts on 29 Oct 2026 from liora1018@gmail.com: diklayr@eyz.org.il and alternate address lilachm@emekyizrael.org.il. Both returned Message blocked. Existing contact retained pending verification; do not treat as delivered or read."));
sheet.getRange(`A${jezreel.rowNumber}:U${jezreel.rowNumber}`).format.rowHeight = 105;

for (const branch of ["Acre branch", "Haifa branch", "Netua branch"]) {
  const record = findRecord("מכינת גל", branch);
  write(record.rowNumber, "U", appendNote(record.notes, "No direct email sent in the 29 Oct 2026 round because no identified email address was available."));
  sheet.getRange(`A${record.rowNumber}:U${record.rowNumber}`).format.rowHeight = 70;
}

const einPrat = findRecord("עין פרת");
write(einPrat.rowNumber, "U", appendNote(einPrat.notes, "No direct email sent in the 29 Oct 2026 round because no identified email address was available."));
sheet.getRange(`A${einPrat.rowNumber}:U${einPrat.rowNumber}`).format.rowHeight = 70;

for (const branch of ["Kiryat Shmona", "Karmiel", "Haspin", "Acre", "Haifa"]) {
  const record = findRecord("כפר הסטודנטים בני עקיבא", branch);
  write(record.rowNumber, "U", appendNote(record.notes, "No direct email sent to this branch in the 29 Oct 2026 round. The national office was contacted and asked to forward the proposal to the relevant village coordinator."));
  sheet.getRange(`A${record.rowNumber}:U${record.rowNumber}`).format.rowHeight = 80;
}

const kedma = findRecord("קדמה");
write(kedma.rowNumber, "U", appendNote(kedma.notes, "Explicitly excluded from the 29 Oct 2026 outreach round; no email was sent."));
sheet.getRange(`A${kedma.rowNumber}:U${kedma.rowNumber}`).format.rowHeight = 70;

sheet.getRange("R7:R86").dataValidation = {
  rule: {
    type: "list",
    values: [
      "Not contacted",
      "Email sent",
      "Called",
      "Follow-up due",
      "Meeting booked",
      "Proposal sent",
      "Won",
      "Not a fit",
      "Existing partner",
      "Sent – no bounce observed",
      "Delivery failed",
      "Delivery failed / recipient rejected",
    ],
  },
};

sheet.getRange("S7:S86").format.numberFormat = "dd-mmm-yyyy";
workbook.recalculate();

const check = await workbook.inspect({
  kind: "table",
  range: "Leads!C7:U61",
  include: "values,formulas",
  tableMaxRows: 55,
  tableMaxCols: 19,
  maxChars: 50000,
});
console.log(check.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);

const updatedValues = sheet.getRange("A7:U86").values;
const statusCounts = new Map();
for (const row of updatedValues) {
  const status = row[17] ?? "";
  statusCounts.set(status, (statusCounts.get(status) ?? 0) + 1);
}
const sentCount = statusCounts.get(sentStatus) ?? 0;
const failedCount = (statusCounts.get("Delivery failed") ?? 0) + (statusCounts.get("Delivery failed / recipient rejected") ?? 0);
if (sentCount !== 25 || failedCount !== 2) {
  throw new Error(`Unexpected status counts: sent=${sentCount}, failed=${failedCount}`);
}
if (updatedValues.some((row) => row[17] === "Delivered" || row[17] === "Read")) {
  throw new Error("A record was incorrectly marked Delivered or Read");
}

await fs.mkdir(previewDir, { recursive: true });
const previewA = await workbook.render({ sheetName: "Leads", range: "H6:U43", scale: 1.0, format: "png" });
await fs.writeFile(`${previewDir}/outreach_updates_preview_1.png`, new Uint8Array(await previewA.arrayBuffer()));
const previewB = await workbook.render({ sheetName: "Leads", range: "H43:U63", scale: 1.0, format: "png" });
await fs.writeFile(`${previewDir}/outreach_updates_preview_2.png`, new Uint8Array(await previewB.arrayBuffer()));

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(workbookPath);

console.log(JSON.stringify({ workbookPath, sentCount, failedCount, unchangedCouncil: findRecord("מועצת המכינות הקדם-צבאיות").rowNumber, kedmaRow: kedma.rowNumber }));
