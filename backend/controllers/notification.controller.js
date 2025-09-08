const db = require('../db'); // mysql2 connection import करा

// 🔹 Get all notifications for a user
exports.getNotifications = (req, res) => {
  const userId = req.params.userId;

  db.query(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json(err);
      return res.json(results);
    }
  );
};

// 🔹 Mark notification as read
exports.markAsRead = (req, res) => {
  const notificationId = req.params.id;

  db.query(
    'UPDATE notifications SET is_read = 1 WHERE id = ?',
    [notificationId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      return res.json({ success: true });
    }
  );
};

// 🔹 Mark all as read for a user
exports.markAllAsRead = (req, res) => {
  const userId = req.params.userId;

  db.query(
    'UPDATE notifications SET is_read = 1 WHERE user_id = ?',
    [userId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      return res.json({ success: true });
    }
  );
};
