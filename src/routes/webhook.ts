import express from "express";
import { prisma } from "../database";

const router = express.Router();
/**
 * @route /
 * @method POST
 * @description Clerk webhook
 */
router.post("/clerk", async (req, res) => {
  try {
    console.log(req.body);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export default router;
