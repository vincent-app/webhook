import express, { type Request, type Response } from "express";

const router = express.Router();

/**
 * @route /
 * @method GET
 * @description Simple route to test the API
 */
router.get("/", async (req: Request, res: Response) => {
  res.json({
    message: "✅ Webhook Service is running",
  });
});

export default router;
