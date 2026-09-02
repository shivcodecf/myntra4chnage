import PblRecord from "../models/PblRecord.js";
import { classifyRisk } from "./riskService.js";

/**
 * Build MongoDB filters from dashboard query parameters.
 */
const buildFilter = ({ month, district, block, grade, subject }) => {
  const filter = {};

  if (month) {
    filter.reportingMonth = month;
  }

  if (district) {
    filter.district = district;
  }

  if (block) {
    filter.block = block;
  }

  if (subject) {
    filter.subject = {
      $regex: subject,
      $options: "i",
    };
  }

  // Grade filtering is handled separately because the CSV stores
  // classes as a text field such as "Classes 6, 7 and 8".
  if (grade) {
    filter.classes = {
      $regex: `\\b${grade}\\b`,
      $options: "i",
    };
  }

  return filter;
};

/**
 * Calculate dashboard metrics from PBL records.
 */
export const getDashboardMetrics = async (filters = {}) => {
  const filter = buildFilter(filters);

  const records = await PblRecord.find(filter).lean();

  const totalSchools = new Set(
    records.map((record) => record.school?.code).filter(Boolean),
  ).size;

  const participatingSchools = new Set(
    records
      .filter((record) => record.pbl?.conducted === true)
      .map((record) => record.school?.code)
      .filter(Boolean),
  ).size;

  const evidenceSchools = new Set(
    records
      .filter((record) => record.pbl?.evidenceSubmitted === true)
      .map((record) => record.school?.code)
      .filter(Boolean),
  ).size;

  const totalEnrollment = records.reduce(
    (sum, record) => sum + (record.enrollment?.total || 0),
    0,
  );

  const totalAttendance = records.reduce(
    (sum, record) => sum + (record.attendance?.total || 0),
    0,
  );

  const participationPercentage =
    totalSchools > 0 ? participatingSchools / totalSchools : 0;

  const evidenceSubmissionPercentage =
    participatingSchools > 0 ? evidenceSchools / participatingSchools : 0;

  const attendancePercentage =
    totalEnrollment > 0 ? totalAttendance / (totalEnrollment * 2) : 0;

  return {
    totalSchools,
    participatingSchools,
    participationPercentage,
    evidenceSchools,
    evidenceSubmissionPercentage,
    totalEnrollment,
    totalAttendance,
    attendancePercentage,

    risk: {
      participation: classifyRisk(participationPercentage),
      evidenceSubmission: classifyRisk(evidenceSubmissionPercentage),
      attendance: classifyRisk(attendancePercentage),
    },
  };
};

/**
 * Calculate monthly metrics.
 *
 * Used for month-over-month trend analysis.
 */
export const getMonthlyMetrics = async (filters = {}) => {
  const filter = buildFilter(filters);

  // If a specific month was supplied, remove it so we can
  // retrieve all months for the trend.
  delete filter.reportingMonth;

  const records = await PblRecord.find(filter).lean();

  const grouped = {};

  for (const record of records) {
    const month = record.reportingMonth;

    if (!month) {
      continue;
    }

    if (!grouped[month]) {
      grouped[month] = [];
    }

    grouped[month].push(record);
  }

  const months = Object.keys(grouped).sort();

  const monthlyData = months.map((month) => {
    const monthRecords = grouped[month];

    const totalSchools = new Set(
      monthRecords.map((record) => record.school?.code).filter(Boolean),
    ).size;

    const participatingSchools = new Set(
      monthRecords
        .filter((record) => record.pbl?.conducted === true)
        .map((record) => record.school?.code)
        .filter(Boolean),
    ).size;

    const evidenceSchools = new Set(
      monthRecords
        .filter((record) => record.pbl?.evidenceSubmitted === true)
        .map((record) => record.school?.code)
        .filter(Boolean),
    ).size;

    const totalEnrollment = monthRecords.reduce(
      (sum, record) => sum + (record.enrollment?.total || 0),
      0,
    );

    const totalAttendance = monthRecords.reduce(
      (sum, record) => sum + (record.attendance?.total || 0),
      0,
    );

    const participationPercentage =
      totalSchools > 0 ? participatingSchools / totalSchools : 0;

    const evidenceSubmissionPercentage =
      participatingSchools > 0 ? evidenceSchools / participatingSchools : 0;

    const attendancePercentage =
      totalEnrollment > 0 ? totalAttendance / (totalEnrollment * 2) : 0;

    return {
      month,
      totalSchools,
      participatingSchools,
      participationPercentage,
      evidenceSchools,
      evidenceSubmissionPercentage,
      totalEnrollment,
      totalAttendance,
      attendancePercentage,
    };
  });

  return monthlyData;
};

/**
 * Calculate month-over-month movement.
 */
export const getMonthOverMonthMovement = async (filters = {}) => {
  const monthlyData = await getMonthlyMetrics(filters);

  if (monthlyData.length < 2) {
    return {
      participation: null,
      attendance: null,
    };
  }

  const current = monthlyData[monthlyData.length - 1];
  const previous = monthlyData[monthlyData.length - 2];

  return {
    from: previous.month,
    to: current.month,

    participation: {
      previous: previous.participationPercentage,
      current: current.participationPercentage,
      change:
        current.participationPercentage - previous.participationPercentage,
    },

    attendance: {
      previous: previous.attendancePercentage,
      current: current.attendancePercentage,
      change: current.attendancePercentage - previous.attendancePercentage,
    },
  };
};

/**
 * Get the overall dashboard data.
 */
export const getDashboard = async (filters = {}) => {
  const metrics = await getDashboardMetrics(filters);
  const monthly = await getMonthlyMetrics(filters);
  const movement = await getMonthOverMonthMovement(filters);

  return {
    filters,
    metrics,
    monthly,
    movement,
  };
};
