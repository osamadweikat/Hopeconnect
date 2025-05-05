const Notification = require("../models/Notification");

exports.sendNotification = async (req, res) => {
    try {
        if (!["admin", "orphanage_manager"].includes(req.user.role)) {
            return res.status(403).json({ message: "Unauthorized to send notifications" });
        }

        const { user_id, message } = req.body;

        if (!user_id || !message) {
            return res.status(400).json({ message: "Missing user_id or message" });
        }

        const notification = await Notification.create({
            user_id,
            message,
            status: "unread"
        });

        res.status(201).json({ message: "Notification sent", notification });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error sending notification" });
    }
};


exports.getUnreadNotifications = async (req, res) => {
    const user_id = req.user.id;

    try {
        const notifications = await Notification.findAll({
            where: { user_id, status: "unread" },
            order: [["createdAt", "DESC"]]
        });
        res.json({ notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching notifications" });
    }
};

exports.markAsRead = async (req, res) => {
    const { notification_id } = req.body;

    try {
        const updated = await Notification.update(
            { status: "read" },
            { where: { id: notification_id } }
        );

        if (updated[0] === 0) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating notification status" });
    }
};
