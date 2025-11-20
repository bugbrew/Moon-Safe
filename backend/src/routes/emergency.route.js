import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/send-alert", async (req, res) => {
  try {
    const { username, lat, lng, phone } = req.body;

    if (!username || !lat || !lng || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Make clickable live location link
    const locationLink = `https://maps.google.com/?q=${lat},${lng}`;

    // Message body
    const message = `
EMERGENCY ALERT FROM MOONSAFE APP
${username} is not safe!
Live Location: ${locationLink}
`;

    // MSG91 Payload
    const payload = {
      template_id: process.env.MSG91_TEMPLATE_ID,
      sender: process.env.MSG91_SENDER_ID,
      short_url: "1",
      recipients: [
        {
          mobiles: phone, // SEND TO ANY NUMBER (example: 9198XXXXXXXX)
          VAR1: message,
        },
      ],
    };

    // API Call
    const response = await axios.post(
      "https://api.msg91.com/api/v5/flow/",
      payload,
      {
        headers: {
          authkey: process.env.MSG91_AUTHKEY,
          "Content-Type": "application/json",
        },
      },
    );

    return res.status(200).json({
      success: true,
      message: "SMS sent successfully!",
      data: response.data,
    });
  } catch (error) {
    console.error("MSG91 Error: ", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: "Failed to send SMS",
    });
  }
});

export default router;
