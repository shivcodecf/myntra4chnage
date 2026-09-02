import mongoose from "mongoose";

const grantReportSchema = new mongoose.Schema(
  {
    grantId: {
      type: String,
      required: true,
      index: true,
    },

    donor: {
      type: String,
      required: true,
      trim: true,
    },

    grantName: {
      type: String,
      required: true,
      trim: true,
    },

    reportingMonth: {
      type: String,
      required: true,
      index: true,
    },

    periodEndDate: {
      type: Date,
      required: true,
    },

    reportDueDate: {
      type: Date,
      required: true,
    },

    reportStatus: {
      type: String,
      required: true,
      trim: true,
    },

    coveredDistricts: {
      type: [String],
      default: [],
    },

    sampledSchoolRecords: {
      type: Number,
      default: 0,
    },

    schoolsCompletedPbl: {
      type: Number,
      default: 0,
    },

    pblCompletionRate: {
      type: Number,
      default: 0,
    },

    schoolsWithEvidence: {
      type: Number,
      default: 0,
    },

    evidenceSubmissionRate: {
      type: Number,
      default: 0,
    },

    totalEnrollment: {
      type: Number,
      default: 0,
    },

    totalAttendance: {
      type: Number,
      default: 0,
    },

    attendanceRate: {
      type: Number,
      default: 0,
    },

    riskStatus: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },

    milestoneSummary: {
      type: String,
      default: "",
    },

    draftReportText: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

grantReportSchema.index({
  grantId: 1,
  reportingMonth: 1,
});

const GrantReport = mongoose.model(
  "GrantReport",
  grantReportSchema
);

export default GrantReport;