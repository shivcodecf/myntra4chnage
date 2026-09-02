import mongoose from "mongoose";

const pblRecordSchema = new mongoose.Schema(
  {
    reportingMonth: {
      type: String,
      required: true,
      index: true,
    },

    timestamp: {
      type: Date,
    },

    school: {
      name: {
        type: String,
        required: true,
      },

      code: {
        type: String,
        required: true,
        index: true,
      },
    },

    district: {
      type: String,
      required: true,
      index: true,
    },

    block: {
      type: String,
      required: true,
      index: true,
    },

    pbl: {
      conducted: {
        type: Boolean,
        required: true,
      },

      evidenceSubmitted: {
        type: Boolean,
        required: true,
      },
    },

    classes: {
      type: String,
    },

    subject: {
      type: String,
    },

    enrollment: {
      class6: {
        type: Number,
        default: 0,
      },

      class7: {
        type: Number,
        default: 0,
      },

      class8: {
        type: Number,
        default: 0,
      },

      total: {
        type: Number,
        default: 0,
      },
    },

    attendance: {
      class6Science: {
        type: Number,
        default: 0,
      },

      class6Math: {
        type: Number,
        default: 0,
      },

      class7Science: {
        type: Number,
        default: 0,
      },

      class7Math: {
        type: Number,
        default: 0,
      },

      class8Science: {
        type: Number,
        default: 0,
      },

      class8Math: {
        type: Number,
        default: 0,
      },

      total: {
        type: Number,
        default: 0,
      },

      rate: {
        type: Number,
        default: 0,
      },
    },

    riskStatus: {
      type: String,
      enum: ["On Track", "Behind", "At Risk", "Critical"],
    },
  },
  {
    timestamps: true,
  },
);

pblRecordSchema.index(
  {
    reportingMonth: 1,
    "school.code": 1,
  },
  {
    unique: true,
  },
);

const PblRecord = mongoose.model("PblRecord", pblRecordSchema);

export default PblRecord;
