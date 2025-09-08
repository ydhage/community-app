const express = require("express");
const router = express.Router();
const { Notification } = require("../models");

// ✅ Get all notifications for logged-in user
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
      limit: 10
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Error fetching notifications" });
  }
});

// ✅ Mark as read
router.put("/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ error: "Not found" });

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: "Error updating notification" });
  }
});

module.exports = router;
