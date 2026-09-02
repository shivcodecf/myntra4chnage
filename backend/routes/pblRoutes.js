import express from "express";

import {
  dashboard,
  metrics,
  monthly,
  movement,
  districts,
  blocks,
  districtHighlights,
  blockHighlights,
} from "../controllers/pblController.js";

const router = express.Router();

router.get("/dashboard", dashboard);

router.get("/metrics", metrics);

router.get("/monthly", monthly);

router.get("/movement", movement);

router.get("/districts", districts);

router.get("/blocks", blocks);

router.get("/district-highlights", districtHighlights);

router.get("/block-highlights", blockHighlights);

export default router;
