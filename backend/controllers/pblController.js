import {
  getDashboard,
  getDashboardMetrics,
  getMonthlyMetrics,
  getMonthOverMonthMovement,
} from "../services/pblAnalyticsService.js";

import {
  getDistrictPerformance,
  getBlockPerformance,
  getDistrictHighlights,
  getBlockHighlights,
} from "../services/geographyService.js";

/**
 * GET /api/pbl/dashboard
 */
export const dashboard = async (req, res) => {
  try {
    const data = await getDashboard(req.query);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load PBL dashboard",
    });
  }
};

/**
 * GET /api/pbl/metrics
 */
export const metrics = async (req, res) => {
  try {
    const data = await getDashboardMetrics(req.query);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Metrics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to calculate PBL metrics",
    });
  }
};

/**
 * GET /api/pbl/monthly
 */
export const monthly = async (req, res) => {
  try {
    const data = await getMonthlyMetrics(req.query);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Monthly metrics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load monthly PBL data",
    });
  }
};

/**
 * GET /api/pbl/movement
 */
export const movement = async (req, res) => {
  try {
    const data = await getMonthOverMonthMovement(req.query);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Movement error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to calculate month-over-month movement",
    });
  }
};

/**
 * GET /api/pbl/districts
 */
export const districts = async (req, res) => {
  try {
    const data = await getDistrictPerformance(req.query);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("District performance error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load district performance",
    });
  }
};

/**
 * GET /api/pbl/blocks
 */
export const blocks = async (req, res) => {
  try {
    const data = await getBlockPerformance(req.query);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Block performance error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load block performance",
    });
  }
};

/**
 * GET /api/pbl/district-highlights
 */
export const districtHighlights = async (req, res) => {
  try {
    const data = await getDistrictHighlights(req.query);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("District highlights error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load district highlights",
    });
  }
};

/**
 * GET /api/pbl/block-highlights
 */
export const blockHighlights = async (req, res) => {
  try {
    const data = await getBlockHighlights(req.query);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Block highlights error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load block highlights",
    });
  }
};