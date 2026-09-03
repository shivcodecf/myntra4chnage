import GrantFinance from "../models/GrantFinance.js";
import GrantReport from "../models/GrantReport.js";
import GrantEvidence from "../models/GrantEvidence.js";
import EvidenceMedia from "../models/EvidenceMedia.js";

export const getGrants = async (req, res) => {
  try {
    // Get one grant record per grant
    const grants = await GrantFinance.aggregate([
      {
        $group: {
          _id: "$grantId",

          donor: {
            $first: "$donor",
          },

          grantName: {
            $first: "$grantName",
          },

          totalApprovedBudget: {
            $sum: "$approvedBudgetUnits",
          },

          totalUtilized: {
            $sum: "$monthlyUtilizedUnits",
          },
        },
      },

      {
        $lookup: {
          from: "grantreports",
          let: {
            grantId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$grantId", "$$grantId"],
                },
              },
            },
            {
              $sort: {
                reportingMonth: -1,
              },
            },
            {
              $limit: 1,
            },
          ],
          as: "latestReport",
        },
      },

      {
        $unwind: {
          path: "$latestReport",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 0,

          grantId: "$_id",

          donor: 1,

          grantName: 1,

          totalApprovedBudget: 1,

          totalUtilized: 1,

          utilizationRate: {
            $cond: [
              {
                $gt: ["$totalApprovedBudget", 0],
              },
              {
                $divide: ["$totalUtilized", "$totalApprovedBudget"],
              },
              0,
            ],
          },

          latestRiskStatus: "$latestReport.riskStatus",

          latestReportingMonth: "$latestReport.reportingMonth",
        },
      },

      {
        $sort: {
          grantId: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: grants,
    });
  } catch (error) {
    console.error("Get grants error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch grants",
    });
  }
};

export const getGrantDetails = async (req, res) => {
  try {
    const { grantId } = req.params;

    if (!grantId) {
      return res.status(400).json({
        success: false,
        message: "Grant ID is required",
      });
    }

    // Get financial records
    const finance = await GrantFinance.find({
      grantId,
    })
      .sort({ reportingMonth: 1, budgetLine: 1 })
      .lean();

    // Get performance reports
    const reports = await GrantReport.find({
      grantId,
    })
      .sort({ reportingMonth: 1 })
      .lean();

    // Grant does not exist
    if (finance.length === 0 && reports.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Grant not found",
      });
    }

    // Basic grant information
    const firstFinance = finance[0] || {};
    const firstReport = reports[0] || {};

    // Financial summary
    const totalApprovedBudget = finance.reduce(
      (sum, item) => sum + (item.approvedBudgetUnits || 0),
      0,
    );

    const totalUtilized = finance.reduce(
      (sum, item) => sum + (item.monthlyUtilizedUnits || 0),
      0,
    );

    const utilizationRate =
      totalApprovedBudget > 0 ? totalUtilized / totalApprovedBudget : 0;

    // Latest performance report
    const latestReport =
      reports.length > 0 ? reports[reports.length - 1] : null;

    return res.status(200).json({
      success: true,

      data: {
        grant: {
          grantId,
          donor: firstFinance.donor || firstReport.donor,
          grantName: firstFinance.grantName || firstReport.grantName,

          periodStart: firstFinance.periodStart,
          periodEnd: firstFinance.periodEnd,

          coveredDistricts:
            firstFinance.coveredDistricts || firstReport.coveredDistricts || [],
        },

        financialSummary: {
          totalApprovedBudget,
          totalUtilized,
          utilizationRate,
        },

        latestPerformance: latestReport
          ? {
              reportingMonth: latestReport.reportingMonth,

              reportStatus: latestReport.reportStatus,

              pblCompletionRate: latestReport.pblCompletionRate,

              evidenceSubmissionRate: latestReport.evidenceSubmissionRate,

              attendanceRate: latestReport.attendanceRate,

              riskStatus: latestReport.riskStatus,
            }
          : null,

        monthlyPerformance: reports,
        financialRecords: finance,
      },
    });
  } catch (error) {
    console.error("Get grant details error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch grant details",
    });
  }
};

export const getGrantPerformance = async (req, res) => {
  try {
    const { grantId } = req.params;

    if (!grantId) {
      return res.status(400).json({
        success: false,
        message: "Grant ID is required",
      });
    }

    const reports = await GrantReport.find({
      grantId,
    })
      .select(
        "reportingMonth periodEndDate reportDueDate reportStatus schoolsCompletedPbl pblCompletionRate schoolsWithEvidence evidenceSubmissionRate totalEnrollment totalAttendance attendanceRate riskStatus milestoneSummary",
      )
      .sort({ reportingMonth: 1 })
      .lean();

    if (reports.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No performance reports found for this grant",
      });
    }

    const performance = reports.map((report) => ({
      reportingMonth: report.reportingMonth,
      periodEndDate: report.periodEndDate,
      reportDueDate: report.reportDueDate,
      reportStatus: report.reportStatus,

      pbl: {
        schoolsCompleted: report.schoolsCompletedPbl,
        completionRate: report.pblCompletionRate,
      },

      evidence: {
        schoolsWithEvidence: report.schoolsWithEvidence,
        submissionRate: report.evidenceSubmissionRate,
      },

      attendance: {
        totalEnrollment: report.totalEnrollment,
        totalAttendance: report.totalAttendance,
        attendanceRate: report.attendanceRate,
      },

      riskStatus: report.riskStatus,

      milestoneSummary: report.milestoneSummary,
    }));

    return res.status(200).json({
      success: true,
      data: {
        grantId,
        months: performance,
      },
    });
  } catch (error) {
    console.error("Get grant performance error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch grant performance",
    });
  }
};

export const getGrantFinance = async (req, res) => {
  try {
    const { grantId } = req.params;

    if (!grantId) {
      return res.status(400).json({
        success: false,
        message: "Grant ID is required",
      });
    }

    const records = await GrantFinance.find({
      grantId,
    })
      .sort({
        reportingMonth: 1,
        budgetLine: 1,
      })
      .lean();

    if (records.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No finance records found for this grant",
      });
    }

    // Overall totals
    const totalApprovedBudget = records.reduce(
      (sum, record) => sum + (record.approvedBudgetUnits || 0),
      0,
    );

    const totalUtilized = records.reduce(
      (sum, record) => sum + (record.monthlyUtilizedUnits || 0),
      0,
    );

    const utilizationRate =
      totalApprovedBudget > 0 ? totalUtilized / totalApprovedBudget : 0;

    // Group finance records by month
    const monthMap = new Map();

    for (const record of records) {
      if (!monthMap.has(record.reportingMonth)) {
        monthMap.set(record.reportingMonth, {
          reportingMonth: record.reportingMonth,
          approvedBudget: 0,
          utilized: 0,
          utilizationRate: 0,
        });
      }

      const month = monthMap.get(record.reportingMonth);

      month.approvedBudget += record.approvedBudgetUnits || 0;

      month.utilized += record.monthlyUtilizedUnits || 0;
    }

    const months = Array.from(monthMap.values()).map((month) => ({
      ...month,

      utilizationRate:
        month.approvedBudget > 0 ? month.utilized / month.approvedBudget : 0,
    }));

    // Budget-line breakdown
    const budgetLines = records.map((record) => ({
      reportingMonth: record.reportingMonth,
      budgetLine: record.budgetLine,

      approvedBudget: record.approvedBudgetUnits,

      utilized: record.monthlyUtilizedUnits,

      cumulativeUtilized: record.cumulativeUtilizedUnits,

      cumulativeUtilizationRate: record.cumulativeUtilizationRate,

      financeNote: record.financeNote,
    }));

    return res.status(200).json({
      success: true,

      data: {
        grantId,

        summary: {
          approvedBudget: totalApprovedBudget,
          utilized: totalUtilized,
          utilizationRate,
        },

        months,

        budgetLines,
      },
    });
  } catch (error) {
    console.error("Get grant finance error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch grant finance data",
    });
  }
};

export const getGrantEvidence = async (req, res) => {
  try {
    const { grantId } = req.params;

    if (!grantId) {
      return res.status(400).json({
        success: false,
        message: "Grant ID is required",
      });
    }

    const records = await EvidenceMedia.find({
      grantId,
    })
      .select(
        "recordId recordType reportingMonth district title summaryOrCaption fileName relativePath usageNote",
      )
      .sort({
        reportingMonth: 1,
      })
      .lean();

    if (records.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No evidence found for this grant",
      });
    }

    const evidence = records.map((record) => ({
      recordId: record.recordId,
      type: record.recordType,
      reportingMonth: record.reportingMonth,
      district: record.district,
      title: record.title,
      summary: record.summaryOrCaption,
      fileName: record.fileName,
      relativePath: record.relativePath,
      usageNote: record.usageNote,
    }));

    return res.status(200).json({
      success: true,
      data: {
        grantId,
        records: evidence,
      },
    });
  } catch (error) {
    console.error("Get grant evidence error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch grant evidence",
    });
  }
};
