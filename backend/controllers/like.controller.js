const db = require('../db');

// Toggle like/unlike
exports.likePost = (req, res) => {
  const postId = req.params.postId;
  const user = req.body.user; // likes टेबलमध्ये user column आहे

  if (!user) return res.status(400).json({ message: 'user required' });

  // Check post exists
  db.query('SELECT * FROM posts WHERE id = ?', [postId], (err, posts) => {
    if (err) return res.status(500).json(err);
    if (!posts.length) return res.status(404).json({ message: 'Post not found' });

    const post = posts[0];
    const postOwner = post.user_id; // owner of post

    // Check if like exists
    db.query('SELECT * FROM likes WHERE PostId = ? AND user = ?', [postId, user], (err2, likes) => {
      if (err2) return res.status(500).json(err2);

      if (likes.length) {
        // Unlike
        db.query('DELETE FROM likes WHERE id = ?', [likes[0].id], (err3) => {
          if (err3) return res.status(500).json(err3);

          // delete notification
          db.query(
            'DELETE FROM notifications WHERE post_id = ? AND sender_id = ? AND type = ?',
            [postId, user, 'like'],
            () => res.json({ liked: false })
          );
        });
      } else {
        // Like
        db.query(
          'INSERT INTO likes (user, PostId, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
          [user, postId],
          (err4) => {
            if (err4) return res.status(500).json(err4);

            // Add notification (avoid self notify)
            if (postOwner && postOwner !== user) {
              db.query(
                'INSERT INTO notifications (user_id, sender_id, type, post_id, is_read, created_at) VALUES (?, ?, ?, ?, 0, NOW())',
                [postOwner, user, 'like', postId],
                () => res.json({ liked: true })
              );
            } else {
              res.json({ liked: true });
            }
          }
        );
      }
    });
  });
};
