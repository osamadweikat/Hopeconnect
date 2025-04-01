const db = require('../config/db');

exports.createNotification = async (user_id, message) => {
    try {
        await db.execute(
            'INSERT INTO Notifications (user_id, message, status) VALUES (?, ?, ?)',
            [user_id, message, 'unread']
        );
    } catch (error) {
        console.error(error);
    }
};

exports.getUnreadNotifications = async (req, res) => {
    const user_id = req.user.id;

    try {
        const [notifications] = await db.execute(
            'SELECT * FROM Notifications WHERE user_id = ? AND status = ?',
            [user_id, 'unread']
        );
        res.json({ notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
};

exports.markAsRead = async (req, res) => {
    const { notification_id } = req.body;

    try {
        await db.execute(
            'UPDATE Notifications SET status = ? WHERE id = ?',
            ['read', notification_id]
        );
        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating notification status' });
    }
};
