import fs from "fs";
import path from "path";
import csv from "csv-parser";
import dotenv from "dotenv";

import GrantReport from "../models/GrantReport.js";
import { connectDB } from "../config/db.js";

dotenv.config();

const DATA_DIR = path.resolve("../data/grants");

const FILE_NAME = "02_Grant_Performance.csv";

const toNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
};

const toDate = (value) => {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

const toDistrictArray = (value) => {
  if (!value) return [];

  return String(value)
    .split(";")
    .map((district) => district.trim())
    .filter(Boolean);
};

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
        const grantId = row["grant_id"]?.trim();
        const reportingMonth =
          row["reporting_month"]?.trim();

        // Ignore invalid or repeated header rows
        if (
          !grantId ||
          grantId === "grant_id" ||
          !reportingMonth ||
          reportingMonth === "reporting_month"
        ) {
          return;
        }

        records.push({
          grantId,

          donor: row["donor"]?.trim() || "",

          grantName:
            row["grant_name"]?.trim() || "",

          reportingMonth,

          periodEndDate: toDate(
            row["period_end_date"]
          ),

          reportDueDate: toDate(
            row["report_due_date"]
          ),

          reportStatus:
            row["report_status"]?.trim() || "",

          coveredDistricts: toDistrictArray(
            row["covered_districts"]
          ),

          sampledSchoolRecords: toNumber(
            row["sampled_school_records"]
          ),

          schoolsCompletedPbl: toNumber(
            row["schools_completed_pbl"]
          ),

          pblCompletionRate: toNumber(
            row["pbl_completion_rate"]
          ),

          schoolsWithEvidence: toNumber(
            row["schools_with_evidence"]
          ),

          evidenceSubmissionRate: toNumber(
            row["evidence_submission_rate"]
          ),

          totalEnrollment: toNumber(
            row["total_enrollment"]
          ),

          totalAttendance: toNumber(
            row["total_attendance"]
          ),

          attendanceRate: toNumber(
            row["attendance_rate"]
          ),

          riskStatus:
            row["risk_status"]?.trim() || "",

          milestoneSummary:
            row["milestone_summary"]?.trim() || "",

          draftReportText:
            row["draft_report_text"]?.trim() || "",
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
      await GrantReport.updateOne(
        {
          grantId: record.grantId,
          reportingMonth: record.reportingMonth,
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
      `\n✅ Grant report import completed. Processed ${records.length} records.`
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "\n❌ Grant report import failed:"
    );

    console.error(error);

    process.exit(1);
  }
};

importData();