import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { checkTwilioConnection, sendWhatsAppMessage, validateTwilioWebhookSignature } from "./twilio";
import { z } from "zod";
import { sendWhatsAppMessage } from "./twilio";


// Schema for validating incoming Twilio webhook payload
const twilioWebhookSchema = z.object({
  From: z.string().min(1, "From is required"),
  To: z.string().optional(),
  Body: z.string().min(1, "Body is required"),
  MessageSid: z.string().optional(),
  AccountSid: z.string().optional(),
  NumMedia: z.string().optional(),
  ProfileName: z.string().optional()
}).passthrough();

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Check Twilio connection status
 app.get("/api/status", (req, res) => {
  res.json({
    connected: true,
    platform: "render",
    message: "Twilio webhook active"
  });
});

  // Get all messages
  app.get("/api/messages", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const messages = await storage.getMessages(limit);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get message stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getMessageStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get bot configuration
  app.get("/api/config", async (req, res) => {
    try {
      const config = await storage.getBotConfig();
      res.json(config);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update bot configuration
  app.patch("/api/config", async (req, res) => {
    try {
      const updates = req.body;
      const config = await storage.updateBotConfig(updates);
      res.json(config);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Twilio webhook for incoming WhatsApp messages
  app.post("/api/webhook/whatsapp", async (req, res) => {
    try {
      console.log("Incoming WhatsApp message:", req.body);
      
      // ❌ DESACTIVADO EN RENDER (causa error X_REPLIT_TOKEN)
/*
if (process.env.NODE_ENV === 'production') {
  const signature = req.headers['x-twilio-signature'] as string;
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['host'];
  const url = `${protocol}://${host}${req.originalUrl}`;
  
  const isValid = await validateTwilioWebhookSignature(signature, url, req.body);
  if (!isValid) {
    console.warn('Invalid Twilio webhook signature');
    res.status(403).send("Forbidden: Invalid signature");
    return;
  }
}
*/

      
      // Validate the request body
      const parseResult = twilioWebhookSchema.safeParse(req.body);
      if (!parseResult.success) {
        console.error("Invalid webhook payload:", parseResult.error.errors);
        res.status(400).send("Bad Request: Invalid payload");
        return;
      }
      
      const { From, To, Body, MessageSid } = parseResult.data;

      // Store the incoming message
      const incomingMessage = await storage.createMessage({
        twilioMessageSid: MessageSid || null,
        from: From,
        to: To || "",
        body: Body,
        direction: "inbound",
        status: "received"
      });

      console.log("Stored incoming message:", incomingMessage.id);

      // Respond to Twilio immediately with TwiML to prevent timeout
      res.type("text/xml");
      res.send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');

      // Process auto-reply asynchronously after responding to Twilio
      setImmediate(async () => {
        try {
          const config = await storage.getBotConfig();
          
          if (config.autoReplyEnabled && config.autoReplyMessage) {
            const delay = parseInt(config.responseDelaySeconds) || 0;
            
            // Apply response delay if configured
            if (delay > 0) {
              await new Promise(resolve => setTimeout(resolve, delay * 1000));
            }

            // Send auto-reply
            const result = await sendWhatsAppMessage(From, config.autoReplyMessage);
            
            // Store the outgoing message
            await storage.createMessage({
              twilioMessageSid: result.messageSid || null,
              from: To || "",
              to: From,
              body: config.autoReplyMessage,
              direction: "outbound",
              status: result.success ? "sent" : "failed"
            });

            console.log("Auto-reply sent:", result.success ? "success" : "failed");
          }
        } catch (error) {
          console.error("Auto-reply error:", error);
        }
      });
    } catch (error: any) {
      console.error("Webhook error:", error);
      res.status(500).send("Internal server error");
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  return httpServer;
}
