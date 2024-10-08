import express from "express";
import {
  requestReferral,
  getReferrals,
} from "../controllers/referralController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, requestReferral);
router.get("/", authMiddleware, getReferrals);

router.get("/test", (req, res) => res.send("Referral route is working"));

export default router;
