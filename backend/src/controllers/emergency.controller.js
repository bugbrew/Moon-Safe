import EmergencyContact from "../models/EmergencyContact.js";
import { sendWhatsAppMessage } from "../utils/sendAlerts.js"; // We'll create this

// Add new emergency contact
export const addContact = async (req, res) => {
    try {
        const { name, phoneNumber, relationship } = req.body;
        const userId = req.user._id; // Assuming user is authenticated

        const contact = await EmergencyContact.create({
            name,
            phoneNumber,
            relationship,
            user: userId,
        });

        res.status(201).json({ success: true, contact });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Send emergency WhatsApp message
export const alertContacts = async (req, res) => {
    try {
        const userId = req.user._id;
        const contacts = await EmergencyContact.find({ user: userId });

        const userLocation = req.body.location; // { lat, lng }

        for (let contact of contacts) {
            await sendWhatsAppMessage(
                contact.phoneNumber,
                `Emergency! I need help. My location: https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}`,
            );
        }

        res.status(200).json({ success: true, message: "Alerts sent!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
