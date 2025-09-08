// const db = require('../models');
// const Comment = db.Comment;
// const Notification = db.Notification;

// exports.addComment = async (req, res) => {
//   try {
//     const { postId, userId, text, ownerId } = req.body;

//     const comment = await Comment.create({ postId, userId, text });

//     // notification (optional)
//     await Notification.create({
//       user_id: ownerId, // ज्याने post केली त्याला notify करायचं
//       sender_id: userId,
//       post_id: postId,
//       type: 'comment',
//       is_read: false
//     });

//     res.status(201).json(comment);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };



const db = require('../db');

// Add comment
exports.addComment = (req, res) => {
  const postId = req.params.postId;
  const { user, text } = req.body;

  if (!user || !text) return res.status(400).json({ message: 'user and text required' });

  db.query('SELECT * FROM posts WHERE id = ?', [postId], (err, posts) => {
    if (err) return res.status(500).json(err);
    if (!posts.length) return res.status(404).json({ message: 'Post not found' });

    const postOwner = posts[0].user_id;

    db.query(
      'INSERT INTO comments (user, text, PostId, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())',
      [user, text, postId],
      (err2, result) => {
        if (err2) return res.status(500).json(err2);

        // Add notification
        if (postOwner && postOwner !== user) {
          db.query(
            'INSERT INTO notifications (user_id, sender_id, type, post_id, is_read, created_at) VALUES (?, ?, ?, ?, 0, NOW())',
            [postOwner, user, 'comment', postId],
            () => res.json({ id: result.insertId, user, text })
          );
        } else {
          res.json({ id: result.insertId, user, text });
        }
      }
    );
  });
};

// Get all comments of a post
exports.getComments = (req, res) => {
  const postId = req.params.postId;

  db.query('SELECT * FROM comments WHERE PostId = ?', [postId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};



// controllers/comment.controller.js
// const db = require('../db');

// exports.addComment = (req, res) => {
//   const postId = req.params.postId;
//   const senderId = req.body.sender_id;
//   const text = req.body.text;

//   if (!senderId || !text) return res.status(400).json({ message: 'sender_id and text required' });

//   // check post exists
//   db.query('SELECT * FROM posts WHERE id = ?', [postId], (err, posts) => {
//     if (err) return res.status(500).json(err);
//     if (!posts.length) return res.status(404).json({ message: 'Post not found' });

//     const postOwnerId = posts[0].user_id;

//     // insert comment
//     db.query('INSERT INTO comments (user_id, post_id, text, created_at) VALUES (?, ?, ?, NOW())', [senderId, postId, text], (err2, result) => {
//       if (err2) return res.status(500).json(err2);

//       const insertedId = result.insertId;
//       // create notification for post owner (if not self)
//       if (postOwnerId && postOwnerId !== senderId) {
//         db.query(
//           'INSERT INTO notifications (user_id, sender_id, type, post_id, is_read, created_at) VALUES (?, ?, ?, ?, 0, NOW())',
//           [postOwnerId, senderId, 'comment', postId],
//           () => {
//             // return the new comment (fetch it)
//             db.query('SELECT * FROM comments WHERE id = ?', [insertedId], (err3, rows) => {
//               if (err3) return res.status(500).json(err3);
//               return res.json(rows[0]);
//             });
//           }
//         );
//       } else {
//         db.query('SELECT * FROM comments WHERE id = ?', [insertedId], (err4, rows) => {
//           if (err4) return res.status(500).json(err4);
//           return res.json(rows[0]);
//         });
//       }
//     });
//   });
// };
