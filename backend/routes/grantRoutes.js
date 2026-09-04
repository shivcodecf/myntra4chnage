import express from "express";
import { getGrantDetails, getGrantEvidence, getGrantFinance, getGrantPerformance, getGrantReport, getGrants } from "../controllers/grantController.js";

const router = express.Router();

router.get("/", getGrants);
router.get("/:grantId/performance", getGrantPerformance);
router.get("/:grantId/finance", getGrantFinance);
router.get("/:grantId/evidence", getGrantEvidence);
router.get("/:grantId/report", getGrantReport);
router.get("/:grantId", getGrantDetails);



export default router;