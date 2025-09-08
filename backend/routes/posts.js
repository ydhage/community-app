const express = require('express');
const router = express.Router();
const { Post, Like, Comment } = require('../models');
const upload = require('../middleware/upload'); // ✅ multer middleware

// ✅ GET all posts (likes + comments सहित)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [Like, Comment],
      order: [['createdAt', 'DESC']]
    });
    res.json(posts);
  } catch (e) { res.status(500).json({ message: e.message }); }
});


// ✅ CREATE post with file upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { caption, user } = req.body;
    if (!caption || !user) {
      return res.status(400).json({ message: 'caption & user required' });
    }

    // जर file आला असेल तर त्याचा path DB मध्ये ठेवा
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const post = await Post.create({ caption, imageUrl, user });
    res.json(post);
  } catch (e) { res.status(500).json({ message: e.message }); }
});


// ✅ CREATE post
// router.post('/', async (req, res) => {
//   try {
//     const { caption, imageUrl, user } = req.body;
//      if (!caption || !user) {
//       return res.status(400).json({ message: 'caption & user required' });
//     }

//   //  if (!caption || !user) return res.status(400).json({ message: 'caption & user required' });

//     const post = await Post.create({ caption, imageUrl, user });
//     res.json(post);
//   } catch (e) { res.status(500).json({ message: e.message }); }
// });


// ✅ LIKE toggle (notifications काढले आहेत)
router.post('/:postId/like', async (req, res) => {
  try {
    const { user } = req.body;
    const { postId } = req.params;

    if (!user) return res.status(400).json({ message: 'user required' });

    // आधी like केलेलं आहे का तपासा
    const existingLike = await Like.findOne({ where: { user, PostId: postId } });

    if (existingLike) {
      await existingLike.destroy();
      return res.json({ liked: false });
    } else {
      await Like.create({ user, PostId: postId });
      return res.json({ liked: true });
    }
  } catch (e) {
    console.error("❌ Like error:", e);
    res.status(500).json({ message: e.message });
  }
});


// router.post('/:postId/like', async (req, res) => {
//   try {
//     const { user } = req.body;
//     const { postId } = req.params;

//     if (!user) return res.status(400).json({ message: 'user required' });

//     const existingLike = await Like.findOne({ where: { user, PostId: postId } });

//     if (existingLike) {
//       await existingLike.destroy();
//       return res.json({ liked: false });
//     } else {
//       await Like.create({ user, PostId: postId });
//       return res.json({ liked: true });
//     }
//   } catch (e) {
//     console.error("❌ Like error:", e);
//     res.status(500).json({ message: e.message });
//   }
// });



// ✅ LIKE toggle
// router.post('/:postId/like', async (req, res) => {
//   try {
//     const { user } = req.body;
//     const { postId } = req.params;

//     if (!user) return res.status(400).json({ message: 'user required' });

//     // Check existing like
//     const existingLike = await Like.findOne({ where: { user, PostId: postId } });

//     if (existingLike) {
//       await existingLike.destroy();

//       // notification delete (optional)
//       await Notification.destroy({ where: { sender_id: user, post_id: postId, type: 'like' } });

//       return res.json({ liked: false });
//     } else {
//       await Like.create({ user, PostId: postId });

//       // notification create (optional)
//       await Notification.create({
//         user_id: req.body.ownerId, // ज्याने post केली त्याला notify करायचं
//         sender_id: user,
//         post_id: postId,
//         type: 'like',
//         is_read: false
//       });

//       return res.json({ liked: true });
//     }
//   } catch (e) { res.status(500).json({ message: e.message }); }
// });

// ✅ COMMENT on a post
router.post('/:postId/comment', async (req, res) => {
  try {
    const { user, text } = req.body;
    const { postId } = req.params;
    if (!user || !text) return res.status(400).json({ message: 'user & text required' });

    const comment = await Comment.create({ user, text, PostId: postId });

    // notification create (optional)
    await Notification.create({
      user_id: req.body.ownerId, 
      sender_id: user,
      post_id: postId,
      type: 'comment',
      is_read: false
    });

    res.json(comment);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
