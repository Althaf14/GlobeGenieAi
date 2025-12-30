import Post from '../models/Post.js';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
    try {
        const { caption, location, image } = req.body;

        const post = await Post.create({
            user: req.user._id,
            caption,
            location,
            image
        });

        // Populate user details immediately for the frontend
        await post.populate('user', 'name');

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server Error creating post', error: error.message });
    }
};

// @desc    Get all posts (Feed)
// @route   GET /api/posts
// @access  Private
const getFeed = async (req, res) => {
    try {
        // Sort by newest first
        const posts = await Post.find({})
            .sort({ createdAt: -1 })
            .populate('user', 'name')
            .populate('comments.user', 'name');

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching feed', error: error.message });
    }
};

// @desc    Like/Unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if post has already been liked
        if (post.likes.includes(req.user._id)) {
            // Unlike: remove user from likes array
            post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
        } else {
            // Like: add user to likes array
            post.likes.push(req.user._id);
        }

        await post.save();
        res.json(post.likes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error liking post', error: error.message });
    }
};

// @desc    Save/Unsave a post
// @route   PUT /api/posts/:id/save
// @access  Private
const savePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if post is already saved by user
        if (post.savedBy.includes(req.user._id)) {
            // Unsave
            post.savedBy = post.savedBy.filter(id => id.toString() !== req.user._id.toString());
        } else {
            // Save
            post.savedBy.push(req.user._id);
        }

        await post.save();
        res.json(post.savedBy);
    } catch (error) {
        res.status(500).json({ message: 'Server Error saving post', error: error.message });
    }
};

// @desc    Add a comment
// @route   POST /api/posts/:id/comment
// @access  Private
const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = {
            user: req.user._id,
            text
        };

        post.comments.push(newComment);
        await post.save();

        // Populate user details for the new comment to return fully populated object if needed, 
        // but often we just need to re-fetch or populate carefully.
        // For simplicity, we can fetch the post again or just populate manually.
        // Let's populate the comments' user field.
        await post.populate('comments.user', 'name');

        res.json(post.comments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error adding comment', error: error.message });
    }
};

// @desc    Get posts by a specific user
// @route   GET /api/posts/user/:id
// @access  Private
const getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.params.id })
            .sort({ createdAt: -1 })
            .populate('user', 'name')
            .populate('comments.user', 'name');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching user posts', error: error.message });
    }
};

export { createPost, getFeed, likePost, savePost, addComment, getUserPosts };
