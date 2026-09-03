import PblRecord from "../models/PblRecord.js";
import { classifyRisk } from "./riskService.js";

/**
 * Calculate performance metrics for a group of PBL records.
 */
const calculatePerformance = (records) => {
  // All unique schools in the selected records
  const schools = new Set(
    records
      .map((record) => record.school?.code)
      .filter(Boolean),
  );

  // Schools where PBL was conducted
  const participatingSchools = new Set(
    records
      .filter((record) => record.pbl?.conducted === true)
      .map((record) => record.school?.code)
      .filter(Boolean),
  );

  // Schools that submitted evidence
  const evidenceSchools = new Set(
    records
      .filter((record) => record.pbl?.evidenceSubmitted === true)
      .map((record) => record.school?.code)
      .filter(Boolean),
  );

  // Total enrolled students
  const totalEnrollment = records.reduce(
    (sum, record) => sum + (record.enrollment?.total || 0),
    0,
  );

  // Total attendance records across PBL sessions
  const totalAttendance = records.reduce(
    (sum, record) => sum + (record.attendance?.total || 0),
    0,
  );

  const totalSchools = schools.size;

  // Participation percentage
  const participationPercentage =
    totalSchools > 0
      ? participatingSchools.size / totalSchools
      : 0;

  // Evidence submission percentage
  const evidenceSubmissionPercentage =
    participatingSchools.size > 0
      ? evidenceSchools.size / participatingSchools.size
      : 0;

  /*
   * Attendance is recorded across 2 PBL sessions.
   *
   * Example:
   * Enrollment = 201
   * Attendance = 341
   *
   * Attendance rate:
   * 341 / (201 * 2)
   * = 0.8483
   * = 84.83%
   */
  const attendancePercentage =
    totalEnrollment > 0
      ? totalAttendance / (totalEnrollment * 2)
      : 0;

  // Overall performance score
  const overallScore =
    (participationPercentage +
      evidenceSubmissionPercentage +
      attendancePercentage) /
    3;

  return {
    totalSchools,
    participatingSchools: participatingSchools.size,
    participationPercentage,

    evidenceSchools: evidenceSchools.size,
    evidenceSubmissionPercentage,

    totalEnrollment,
    totalAttendance,
    attendancePercentage,

    overallScore,

    riskStatus: classifyRisk(overallScore),
  };
};
/**
 * Get district-level performance.
 */
export const getDistrictPerformance = async (filters = {}) => {
  const query = {};

  if (filters.month) {
    query.reportingMonth = filters.month;
  }

  if (filters.district) {
    query.district = filters.district;
  }

  if (filters.block) {
    query.block = filters.block;
  }

  if (filters.subject) {
    query.subject = {
      $regex: filters.subject,
      $options: "i",
    };
  }

  if (filters.grade) {
    query.classes = {
      $regex: `\\b${filters.grade}\\b`,
      $options: "i",
    };
  }

  const records = await PblRecord.find(query).lean();

  const grouped = {};

  for (const record of records) {
    const district = record.district?.trim();

    if (!district) {
      continue;
    }

    if (!grouped[district]) {
      grouped[district] = [];
    }

    grouped[district].push(record);
  }

  const results = Object.entries(grouped).map(
    ([district, districtRecords]) => ({
      district,
      ...calculatePerformance(districtRecords),
    }),
  );

  // Highest performing districts first.
  results.sort((a, b) => b.overallScore - a.overallScore);

  return results;
};

/**
 * Get block-level performance.
 */
export const getBlockPerformance = async (filters = {}) => {
  const query = {};

  if (filters.month) {
    query.reportingMonth = filters.month;
  }

  if (filters.district) {
    query.district = filters.district;
  }

  if (filters.block) {
    query.block = filters.block;
  }

  if (filters.subject) {
    query.subject = {
      $regex: filters.subject,
      $options: "i",
    };
  }

  if (filters.grade) {
    query.classes = {
      $regex: `\\b${filters.grade}\\b`,
      $options: "i",
    };
  }

  const records = await PblRecord.find(query).lean();

  const grouped = {};

  for (const record of records) {
    const block = record.block?.trim();

    if (!block) {
      continue;
    }

    if (!grouped[block]) {
      grouped[block] = [];
    }

    grouped[block].push(record);
  }

  const results = Object.entries(grouped).map(
    ([block, blockRecords]) => ({
      block,
      district: blockRecords[0]?.district || null,
      ...calculatePerformance(blockRecords),
    }),
  );

  results.sort((a, b) => b.overallScore - a.overallScore);

  return results;
};

/**
 * Get the highest and lowest performing districts.
 */
export const getDistrictHighlights = async (filters = {}) => {
  const districts = await getDistrictPerformance(filters);

  return {
    topPerformers: districts.slice(0, 5),
    priorityDistricts: [...districts]
      .sort((a, b) => a.overallScore - b.overallScore)
      .slice(0, 5),
  };
};

/**
 * Get the highest and lowest performing blocks.
 */
export const getBlockHighlights = async (filters = {}) => {
  const blocks = await getBlockPerformance(filters);

  return {
    topPerformers: blocks.slice(0, 5),
    priorityBlocks: [...blocks]
      .sort((a, b) => a.overallScore - b.overallScore)
      .slice(0, 5),
  };
};