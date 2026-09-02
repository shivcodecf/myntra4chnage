import fs from "fs";
import path from "path";
import csv from "csv-parser";
import dotenv from "dotenv";

import GrantEvidence from "../models/GrantEvidence.js";
import { connectDB } from "../config/db.js";

dotenv.config();

const DATA_DIR = path.resolve("../data/grants");

const FILE_NAME = "03_Evidence_and_Media.csv";

const importFile = (fileName) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(DATA_DIR, fileName);

    if (!fs.existsSync(filePath)) {
      return reject(
        new Error(`File not found: ${filePath}`)
      );
    }

    const records = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        if (
          !row.record_id ||
          row.record_id.trim() === "record_id"
        ) {
          return;
        }

        records.push({
          recordId: row.record_id?.trim(),

          recordType: row.record_type?.trim(),

          grantId: row.grant_id?.trim(),

          donor: row.donor?.trim(),

          reportingMonth:
            row.reporting_month?.trim(),

          district: row.district?.trim(),

          title: row.title?.trim(),

          summaryOrCaption:
            row.summary_or_caption?.trim(),

          fileName: row.file_name?.trim(),

          relativePath:
            row.relative_path?.trim(),

          usageNote:
            row.usage_note?.trim(),
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

    console.log(
      `\nReading ${FILE_NAME}...`
    );

    const records = await importFile(
      FILE_NAME
    );

    console.log(
      `Found ${records.length} records`
    );

    for (const record of records) {
      await GrantEvidence.updateOne(
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
      `Imported ${records.length} evidence records`
    );

    console.log(
      "\n✅ Evidence import completed."
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "\n❌ Evidence import failed:"
    );

    console.error(error);

    process.exit(1);
  }
};

importData();