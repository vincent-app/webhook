import express from "express";

const router = express.Router();

/**
 * @route /
 * @method GET
 * @description Simple route to test the API
 */
router.get("/", async (req, res) => {
  res.json({
    message: "✅ Webhook Service is running",
  });
});

export default router;
