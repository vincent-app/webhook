import express from "express";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/clerk-sdk-node";

import { prisma } from "../database";

const router = express.Router();

/**
 * @route /clerk
 * @method POST
 * @description Clerk webhook
 */
router.post("/clerk", async (req, res) => {
  try {
    console.log("Webhook received");
    const payload = JSON.stringify(req.body);

    // Create a new Webhook instance with your webhook secret
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SIGNING_SECRET as string);

    let evt: WebhookEvent;
    try {
      // Manually verify the required headers
      const requiredHeaders: string[] = ["svix-signature", "content-type"]; // Add any other required headers here
      for (const header of requiredHeaders) {
        if (!req.headers[header]) {
          throw new Error(`Missing required header: ${header}`);
        }
      }

      // Verify the webhook payload and headers
      evt = wh.verify(
        payload,
        req.headers as Record<string, string>
      ) as WebhookEvent;
    } catch (_) {
      // If the verification fails or required headers are missing, return a 400 error
      return res.status(400).json({});
    }

    const { id } = evt.data;

    const eventType = evt.type;
    if (eventType === "user.created") {
      if (!id)
        return res.status(400).json({
          message: "Missing user ID",
        });

      const user = await prisma.user.findUnique({
        where: {
          clerkId: id,
        },
      });

      if (user) {
        return res.status(409).json({
          message: "User already exists",
        });
      }

      await prisma.user.create({
        data: {
          clerkId: id,
        },
      });

      res.status(201).json({
        message: "User created",
      });
    }

    if (eventType === "user.deleted") {
      if (!id)
        return res.status(400).json({
          message: "Missing user ID",
        });

      const user = await prisma.user.findUnique({
        where: {
          clerkId: id,
        },
      });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      await prisma.user.delete({
        where: {
          clerkId: id,
        },
      });

      res.status(200).json({
        message: "User deleted",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export default router;
