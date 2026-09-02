import mongoose from "mongoose";

const evidenceMediaSchema = new mongoose.Schema(
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
      trim: true,
      index: true,
    },

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

    reportingMonth: {
      type: String,
      required: true,
      index: true,
    },

    district: {
      type: String,
      default: "",
      trim: true,
    },

    title: {
      type: String,
      default: "",
      trim: true,
    },

    summaryOrCaption: {
      type: String,
      default: "",
    },

    fileName: {
      type: String,
      default: "",
      trim: true,
    },

    relativePath: {
      type: String,
      default: "",
      trim: true,
    },

    usageNote: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

evidenceMediaSchema.index({
  grantId: 1,
  reportingMonth: 1,
});

const EvidenceMedia = mongoose.model(
  "EvidenceMedia",
  evidenceMediaSchema
);

export default EvidenceMedia;