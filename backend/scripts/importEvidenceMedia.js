import fs from "fs";
import path from "path";
import csv from "csv-parser";
import dotenv from "dotenv";

import EvidenceMedia from "../models/EvidenceMedia.js";
import { connectDB } from "../config/db.js";

dotenv.config();

const DATA_DIR = path.resolve("../data/grants");

const FILE_NAME = "03_Evidence_and_Media.csv";

const importFile = () => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(DATA_DIR, FILE_NAME);

    if (!fs.existsSync(filePath)) {
      return reject(
        new Error(`File not found: ${filePath}`)
      );
    }

    const records = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const recordId = row["record_id"]?.trim();
        const grantId = row["grant_id"]?.trim();
        const reportingMonth =
          row["reporting_month"]?.trim();

        // Ignore invalid or repeated header rows
        if (
          !recordId ||
          recordId === "record_id" ||
          !grantId ||
          grantId === "grant_id" ||
          !reportingMonth ||
          reportingMonth === "reporting_month"
        ) {
          return;
        }

        records.push({
          recordId,

          recordType:
            row["record_type"]?.trim() || "",

          grantId,

          donor:
            row["donor"]?.trim() || "",

          reportingMonth,

          district:
            row["district"]?.trim() || "",

          title:
            row["title"]?.trim() || "",

          summaryOrCaption:
            row["summary_or_caption"]?.trim() || "",

          fileName:
            row["file_name"]?.trim() || "",

          relativePath:
            row["relative_path"]?.trim() || "",

          usageNote:
            row["usage_note"]?.trim() || "",
        });
      })
      .on("end", () => {
        resolve(records);
      })
      .on("error", reject);
  });
};

const importData = async () => {
  try {
    await connectDB();

    console.log(`\nReading ${FILE_NAME}...`);

    const records = await importFile();

    console.log(`Found ${records.length} records`);

    for (const record of records) {
      await EvidenceMedia.updateOne(
        {
          recordId: record.recordId,
        },
        {
          $set: record,
        },
        {
          upsert: true,
        }
      );
    }

    console.log(
      `Imported ${records.length} records`
    );

    console.log(
      `\n✅ Evidence/media import completed. Processed ${records.length} records.`
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "\n❌ Evidence/media import failed:"
    );

    console.error(error);

    process.exit(1);
  }
};

importData();