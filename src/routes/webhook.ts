import express, { type Request, type Response } from "express";
import { prisma } from "../database";

const router = express.Router();
/**
 * @route /
 * @method POST
 * @description Clerk webhook
 */
router.post("/clerk", async (req: Request, res: Response) => {
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
