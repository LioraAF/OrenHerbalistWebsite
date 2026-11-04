import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "/Users/lfeldblum/Oren/Oren_Herbalist_Site/outputs/oren_outreach_contacts_2026_10_29/oren_herbalist_outreach_contacts.xlsx";
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
const sheet = workbook.worksheets.getItem("Leads");

const overview = await workbook.inspect({
  kind: "workbook,sheet,table",
  maxChars: 5000,
  tableMaxRows: 4,
  tableMaxCols: 8,
});
console.log(overview.ndjson);

const values = sheet.getRange("A6:U86").values;
for (let index = 1; index < values.length; index++) {
  const row = values[index];
  console.log(JSON.stringify({
    row: index + 6,
    priority: row[0],
    category: row[1],
    organization: row[2],
    branch: row[3],
    email: row[7],
    status: row[17],
    lastContacted: row[18],
    nextAction: row[19],
    notes: row[20],
  }));
}

const preview = await workbook.render({ sheetName: "Leads", range: "A1:U18", scale: 0.9, format: "png" });
await fs.writeFile("/private/tmp/oren_leads_before.png", new Uint8Array(await preview.arrayBuffer()));
