import PblRecord from "../models/PblRecord.js";
import { getBlockPerformance, getDistrictPerformance } from "./geographyService.js";
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

  // Calculate attendance using the attendance rate
  // stored in each PBL record.
  const attendanceRates = records
    .map((record) => record.attendance?.rate)
    .filter((rate) => typeof rate === "number" && rate > 0);

  const attendancePercentage =
    attendanceRates.length > 0
      ? attendanceRates.reduce((sum, rate) => sum + rate, 0) /
        attendanceRates.length
      : 0;

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
      participatingSchools > 0
        ? evidenceSchools / participatingSchools
        : 0;

    // Calculate attendance using the attendance rate
    // stored in each PBL record.
    const attendanceRates = monthRecords
      .map((record) => record.attendance?.rate)
      .filter((rate) => typeof rate === "number" && rate > 0);

    const attendancePercentage =
      attendanceRates.length > 0
        ? attendanceRates.reduce((sum, rate) => sum + rate, 0) /
          attendanceRates.length
        : 0;

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
 * Generate a deterministic monthly program review summary.
 *
 * This does not depend on AI.
 * All insights are calculated from the existing PBL metrics,
 * district performance and block performance.
 */
export const getMonthlyReviewSummary = async (filters = {}) => {
  const monthlyData = await getMonthlyMetrics(filters);

  if (monthlyData.length === 0) {
    return {
      month: null,
      achievements: [],
      monthOverMonthChanges: [],
      risks: [],
      priorityDistricts: [],
      priorityBlocks: [],
      discussionPoints: [],
    };
  }

  const current = monthlyData[monthlyData.length - 1];
  const previous =
    monthlyData.length > 1
      ? monthlyData[monthlyData.length - 2]
      : null;

  const districts = await getDistrictPerformance(filters);
  const blocks = await getBlockPerformance(filters);

  /*
   * -----------------------------
   * Achievements
   * -----------------------------
   */

  const achievements = [];

  if (current.participationPercentage >= 0.75) {
    achievements.push(
      `School participation is on track at ${(current.participationPercentage * 100).toFixed(1)}%.`,
    );
  }

  if (current.evidenceSubmissionPercentage >= 0.75) {
    achievements.push(
      `Evidence submission is on track at ${(current.evidenceSubmissionPercentage * 100).toFixed(1)}%.`,
    );
  }

  if (current.attendancePercentage >= 0.75) {
    achievements.push(
      `Attendance is on track at ${(current.attendancePercentage * 100).toFixed(1)}%.`,
    );
  }

  /*
   * -----------------------------
   * Month-over-month changes
   * -----------------------------
   */

  const monthOverMonthChanges = [];

  if (previous) {
    const participationChange =
      current.participationPercentage -
      previous.participationPercentage;

    const evidenceChange =
      current.evidenceSubmissionPercentage -
      previous.evidenceSubmissionPercentage;

    const attendanceChange =
      current.attendancePercentage -
      previous.attendancePercentage;

    monthOverMonthChanges.push({
      metric: "Participation",
      from: previous.month,
      to: current.month,
      previous: previous.participationPercentage,
      current: current.participationPercentage,
      change: participationChange,
      direction:
        participationChange > 0
          ? "improved"
          : participationChange < 0
            ? "declined"
            : "unchanged",
    });

    monthOverMonthChanges.push({
      metric: "Evidence Submission",
      from: previous.month,
      to: current.month,
      previous: previous.evidenceSubmissionPercentage,
      current: current.evidenceSubmissionPercentage,
      change: evidenceChange,
      direction:
        evidenceChange > 0
          ? "improved"
          : evidenceChange < 0
            ? "declined"
            : "unchanged",
    });

    monthOverMonthChanges.push({
      metric: "Attendance",
      from: previous.month,
      to: current.month,
      previous: previous.attendancePercentage,
      current: current.attendancePercentage,
      change: attendanceChange,
      direction:
        attendanceChange > 0
          ? "improved"
          : attendanceChange < 0
            ? "declined"
            : "unchanged",
    });
  }

  /*
   * -----------------------------
   * Overall risks
   * -----------------------------
   */

  const risks = [];

  if (current.participationPercentage < 0.75) {
    risks.push({
      metric: "Participation",
      percentage: current.participationPercentage,
      risk: classifyRisk(current.participationPercentage),
      message: `Participation is below the 75% on-track threshold at ${(current.participationPercentage * 100).toFixed(1)}%.`,
    });
  }

  if (current.evidenceSubmissionPercentage < 0.75) {
    risks.push({
      metric: "Evidence Submission",
      percentage: current.evidenceSubmissionPercentage,
      risk: classifyRisk(current.evidenceSubmissionPercentage),
      message: `Evidence submission is below the 75% on-track threshold at ${(current.evidenceSubmissionPercentage * 100).toFixed(1)}%.`,
    });
  }

  if (current.attendancePercentage < 0.75) {
    risks.push({
      metric: "Attendance",
      percentage: current.attendancePercentage,
      risk: classifyRisk(current.attendancePercentage),
      message: `Attendance is below the 75% on-track threshold at ${(current.attendancePercentage * 100).toFixed(1)}%.`,
    });
  }

  /*
   * -----------------------------
   * Priority districts
   * -----------------------------
   *
   * Lowest-performing districts first.
   */

  const priorityDistricts = [...districts]
    .sort((a, b) => a.overallScore - b.overallScore)
    .slice(0, 5)
    .map((district) => ({
      district: district.district,
      overallScore: district.overallScore,
      riskStatus: district.riskStatus,
      participationPercentage: district.participationPercentage,
      evidenceSubmissionPercentage:
        district.evidenceSubmissionPercentage,
      attendancePercentage: district.attendancePercentage,
    }));

  /*
   * -----------------------------
   * Priority blocks
   * -----------------------------
   */

  const priorityBlocks = [...blocks]
    .sort((a, b) => a.overallScore - b.overallScore)
    .slice(0, 5)
    .map((block) => ({
      block: block.block,
      district: block.district,
      overallScore: block.overallScore,
      riskStatus: block.riskStatus,
      participationPercentage: block.participationPercentage,
      evidenceSubmissionPercentage:
        block.evidenceSubmissionPercentage,
      attendancePercentage: block.attendancePercentage,
    }));

  /*
   * -----------------------------
   * Discussion points
   * -----------------------------
   */

  const discussionPoints = [];

  for (const risk of risks) {
    discussionPoints.push(
      `Discuss actions required to improve ${risk.metric.toLowerCase()} (${(
        risk.percentage * 100
      ).toFixed(1)}%).`,
    );
  }

  if (priorityDistricts.length > 0) {
    discussionPoints.push(
      `Review the lowest-performing districts: ${priorityDistricts
        .map((item) => item.district)
        .join(", ")}.`,
    );
  }

  if (priorityBlocks.length > 0) {
    discussionPoints.push(
      `Review the lowest-performing blocks: ${priorityBlocks
        .map((item) => item.block)
        .join(", ")}.`,
    );
  }

  if (previous) {
    const decliningMetrics = monthOverMonthChanges.filter(
      (item) => item.direction === "declined",
    );

    for (const metric of decliningMetrics) {
      discussionPoints.push(
        `${metric.metric} declined by ${Math.abs(
          metric.change * 100,
        ).toFixed(1)} percentage points from ${metric.from} to ${metric.to}.`,
      );
    }
  }

  return {
    month: current.month,

    summaryMetrics: {
      totalSchools: current.totalSchools,
      participatingSchools: current.participatingSchools,
      participationPercentage:
        current.participationPercentage,

      evidenceSchools: current.evidenceSchools,
      evidenceSubmissionPercentage:
        current.evidenceSubmissionPercentage,

      totalEnrollment: current.totalEnrollment,
      totalAttendance: current.totalAttendance,
      attendancePercentage:
        current.attendancePercentage,
    },

    achievements,

    monthOverMonthChanges,

    risks,

    priorityDistricts,

    priorityBlocks,

    discussionPoints,
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
