import mongoose from "mongoose";

const grantEvidenceSchema = new mongoose.Schema(
  {
    recordId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    recordType: {
      type: String,
      required: true,
    },

    grantId: {
      type: String,
      required: true,
      index: true,
    },

    donor: {
      type: String,
      required: true,
    },

    reportingMonth: {
      type: String,
      required: true,
      index: true,
    },

    district: {
      type: String,
    },

    title: {
      type: String,
    },

    summaryOrCaption: {
      type: String,
    },

    fileName: {
      type: String,
    },

    relativePath: {
      type: String,
    },

    usageNote: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const GrantEvidence = mongoose.model(
  "GrantEvidence",
  grantEvidenceSchema
);

export default GrantEvidence;