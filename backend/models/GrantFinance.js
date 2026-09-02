import mongoose from "mongoose";

const grantFinanceSchema = new mongoose.Schema(
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

    periodStart: {
      type: Date,
      required: true,
    },

    periodEnd: {
      type: Date,
      required: true,
    },

    coveredDistricts: {
      type: [String],
      default: [],
    },

    reportingMonth: {
      type: String,
      required: true,
      index: true,
    },

    budgetLine: {
      type: String,
      required: true,
      trim: true,
    },

    approvedBudgetUnits: {
      type: Number,
      default: 0,
    },

    monthlyUtilizedUnits: {
      type: Number,
      default: 0,
    },

    cumulativeUtilizedUnits: {
      type: Number,
      default: 0,
    },

    cumulativeUtilizationRate: {
      type: Number,
      default: 0,
    },

    financeNote: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

grantFinanceSchema.index({
  grantId: 1,
  reportingMonth: 1,
  budgetLine: 1,
});

const GrantFinance = mongoose.model(
  "GrantFinance",
  grantFinanceSchema
);

export default GrantFinance;