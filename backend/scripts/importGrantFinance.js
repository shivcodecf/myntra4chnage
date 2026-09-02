import fs from "fs";
import path from "path";
import csv from "csv-parser";
import dotenv from "dotenv";

import GrantFinance from "../models/GrantFinance.js";
import { connectDB } from "../config/db.js";

dotenv.config();

const DATA_DIR = path.resolve("../data/grants");

const FILE_NAME = "01_Grant_Profile_and_Budget.csv";

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
        const budgetLine =
          row["budget_line"]?.trim();

        // Ignore invalid or repeated header rows
        if (
          !grantId ||
          grantId === "grant_id" ||
          !reportingMonth ||
          reportingMonth === "reporting_month" ||
          !budgetLine ||
          budgetLine === "budget_line"
        ) {
          return;
        }

        records.push({
          grantId,

          donor: row["donor"]?.trim() || "",

          grantName:
            row["grant_name"]?.trim() || "",

          periodStart: toDate(
            row["period_start"]
          ),

          periodEnd: toDate(
            row["period_end"]
          ),

          coveredDistricts: toDistrictArray(
            row["covered_districts"]
          ),

          reportingMonth,

          budgetLine,

          approvedBudgetUnits: toNumber(
            row["approved_budget_units"]
          ),

          monthlyUtilizedUnits: toNumber(
            row["monthly_utilized_units"]
          ),

          cumulativeUtilizedUnits: toNumber(
            row["cumulative_utilized_units"]
          ),

          cumulativeUtilizationRate: toNumber(
            row["cumulative_utilization_rate"]
          ),

          financeNote:
            row["finance_note"]?.trim() || "",
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
      await GrantFinance.updateOne(
        {
          grantId: record.grantId,
          reportingMonth: record.reportingMonth,
          budgetLine: record.budgetLine,
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
      `\n✅ Grant finance import completed. Processed ${records.length} records.`
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "\n❌ Grant finance import failed:"
    );

    console.error(error);

    process.exit(1);
  }
};

importData();