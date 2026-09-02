import fs from "fs";
import path from "path";
import csv from "csv-parser";
import dotenv from "dotenv";

import PblRecord from "../models/PblRecord.js";
import { connectDB } from "../config/db.js";

dotenv.config();

const DATA_DIR = path.resolve("../data/pbl");

const files = ["PBL_School_Response_Data_August_2025.csv"];

const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const toBoolean = (value) => {
  return String(value).trim().toLowerCase() === "yes";
};

const importFile = (fileName) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(DATA_DIR, fileName);

    if (!fs.existsSync(filePath)) {
      return reject(new Error(`File not found: ${filePath}`));
    }

    const records = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const reportingMonth = row["Reporting Month"]?.trim();
        const schoolCode =
          row["What is your school's synthetic school code?"]?.trim();

        if (
          !reportingMonth ||
          reportingMonth === "Reporting Month" ||
          !/^\d{4}-\d{2}$/.test(reportingMonth) ||
          !schoolCode ||
          schoolCode === "What is your school's synthetic school code?"
        ) {
          return;
        }
        const record = {
          reportingMonth,

          timestamp: row["Timestamp"] ? new Date(row["Timestamp"]) : null,

          school: {
            name: row["What is the name of your school?"]?.trim(),

            code: schoolCode,
          },

          district: row["What is the name of your district?"]?.trim(),

          block: row["Block Details"]?.trim(),

          pbl: {
            conducted: toBoolean(
              row["Was the PBL project conducted in your school this month?"],
            ),

            evidenceSubmitted: toBoolean(
              row["Was evidence submitted for the completed PBL project?"],
            ),
          },

          classes:
            row[
              "In which class/classes did you conduct the PBL project?"
            ]?.trim(),

          subject: row["Which subject do you teach?"]?.trim(),

          enrollment: {
            class6: toNumber(
              row[
                "Total number of students enrolled in Class 6, including all sections"
              ],
            ),

            class7: toNumber(
              row[
                "Total number of students enrolled in Class 7, including all sections"
              ],
            ),

            class8: toNumber(
              row[
                "Total number of students enrolled in Class 8, including all sections"
              ],
            ),

            total: toNumber(
              row["Derived: Total enrollment across Classes 6-8"],
            ),
          },

          attendance: {
            class6Science: toNumber(
              row[
                "Average student attendance during the Class 6 PBL Science session. If you did not teach Science in Class 6, enter 0."
              ],
            ),

            class6Math: toNumber(
              row[
                "Average student attendance during the Class 6 PBL Math session. If you did not teach Math in Class 6, enter 0."
              ],
            ),

            class7Science: toNumber(
              row[
                "Average student attendance during the Class 7 PBL Science session. If you did not teach Science in Class 7, enter 0."
              ],
            ),

            class7Math: toNumber(
              row[
                "Average student attendance during the Class 7PBL Math session. If you did not teach Math in Class 7, enter 0."
              ],
            ),

            class8Science: toNumber(
              row[
                "Average student attendance during the Class 8 PBL Science session. If you did not teach Science in Class 8, enter 0."
              ],
            ),

            class8Math: toNumber(
              row[
                "Average student attendance during the Class 8 PBL Math session. If you did not teach Math in Class 8, enter 0."
              ],
            ),

            total: toNumber(
              row[
                "Derived: Total attendance across PBL Science and Math sessions"
              ],
            ),

            rate: toNumber(row["Derived: Overall PBL attendance rate"]),
          },

          riskStatus: row["Derived: Risk status"]?.trim(),
        };

        records.push(record);
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

    let totalImported = 0;

    for (const fileName of files) {
      console.log(`\nReading ${fileName}...`);

      const records = await importFile(fileName);

      console.log(`Found ${records.length} records`);

      if (records.length === 0) {
        continue;
      }

      for (const record of records) {
        await PblRecord.updateOne(
          {
            reportingMonth: record.reportingMonth,
            "school.code": record.school.code,
          },
          {
            $set: record,
          },
          {
            upsert: true,
          },
        );
      }

      totalImported += records.length;

      console.log(`Imported ${records.length} records`);
    }

    console.log(
      `\n✅ PBL import completed. Processed ${totalImported} records.`,
    );

    process.exit(0);
  } catch (error) {
    console.error("\n❌ PBL import failed:");
    console.error(error);

    process.exit(1);
  }
};

importData();
