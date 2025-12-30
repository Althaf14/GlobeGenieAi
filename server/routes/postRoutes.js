import express from 'express';
import { createPost, getFeed, likePost, savePost, addComment, getUserPosts } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createPost)
    .get(protect, getFeed);

router.put('/:id/like', protect, likePost);
router.put('/:id/save', protect, savePost);
router.post('/:id/comment', protect, addComment);
router.get('/user/:id', protect, getUserPosts);

export default router;
