const express = require('express')
const userModel = require('../model/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const authMiddleware = require('../middlewares/auth.middleware')
const multer = require('multer')
const postModel = require('../model/post.model')
const generateCaption = require('../service/ai.service')
const { uploadProfile, uploadFile, deleteProfileImage, deletePost } = require('../service/storage.service')
const { v4: uuidv4 } = require('uuid');
const { default: mongoose } = require('mongoose')
const upload = multer({ storage: multer.memoryStorage() })

const router = express.Router()

router.post('/register', async (req, res) => {
    const { username, password, fname, lname, email_id } = req.body;

    const isUserExist = await userModel.findOne({ username });
    if (isUserExist) {
        return res.status(409).json({
            field: "username",
            message: "Username already in use"
        });
    }

    const isEmailExist = await userModel.findOne({ email_id });
    if (isEmailExist) {
        return res.status(409).json({
            field: "email_id",
            message: "Email ID already in use"
        });
    }

    const user = await userModel.create({
        username,
        password: await bcrypt.hash(password, 10),
        fname,
        lname,
        email_id,
        profile_img: "",
        profile_img_id: ""
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    });

    res.status(201).json({
        message: 'User Created',
        user
    });
});
router.get('/user', authMiddleware, async (req, res) => {
    try {
        // User is already set on req.user by the auth middleware
        const user = req.user;

        // Get posts uploaded by the user
        const posts = await postModel.find({ user: user._id });

        res.status(200).json({
            message: "User info and posts fetched successfully",
            userData: user,
            userPosts: posts
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch user and posts" });
    }
});
router.post('/login', async (req, res) => {
    const { email_id, password } = req.body
    const User = await userModel.findOne({ email_id })
    console.log(User)

    if (!User) {
        return res.status(404).json({
            message: "Invalid user"
        })
    }
    let isCorrectPassword = await bcrypt.compare(password, User.password)

    if (!isCorrectPassword) {
        return res.status(404).json({
            message: "Incorect Password"
        })
    }
    const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET)
    res.cookie('token', token)

    res.status(200).json({
        message: "Login successfully"
    })
})
router.get('/logout', (req, res) => {
    res.clearCookie("token"); // Clears the token cookie
    res.status(200).json({ message: "Logged out successfully" });
});
router.post('/posts', authMiddleware, upload.single("Image"), async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "No image uploaded" });
        }
        const base64Image = file.buffer.toString("base64");
        console.log(base64Image);
        const caption = await generateCaption(base64Image);
        if (caption == undefined) {
           return res.status(404).json({
                message: "Caption not generated"
            })
        }
        const result = await uploadFile(file.buffer, uuidv4());
        console.log(result);

        const post = await postModel.create({
            image: result.url,
            caption: caption,
            image_id: result.fileId,
            user: req.user._id
        })
        res.status(200).json({
            post
        });
    } catch (error) {
        console.error("Error in /posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.delete("/posts/:postId", authMiddleware, async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized to delete this post" });
        }
        console.log(post);

        // ✅ Delete image from ImageKit if fil eId exists
        if (post.image_id) {
            try {
                await deletePost(post.image_id);
                console.log("Old image deleted from ImageKit");
            } catch (deleteError) {
                console.warn("Failed to delete old image from ImageKit:", deleteError.message);
                // Optional: continue even if delete fails
            }
        }

        // ✅ Delete post from database
        await postModel.findByIdAndDelete(postId);

        res.status(200).json({ message: "Post and image deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Server error while deleting post" });
    }
});
router.post('/upload-profile-pic', authMiddleware, upload.single('profileImage'), async (req, res) => {
    try {
        const user = req.user; // Assumes auth middleware sets this
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "No image uploaded" });
        }
        if (user.profile_img_id) {
            try {
                await deleteProfileImage(user.profile_img_id);
                console.log("Old image deleted from ImageKit");
            } catch (deleteError) {
                console.warn("Failed to delete old image from ImageKit:", deleteError.message);
                // Optional: continue even if delete fails
            }
        }
        const result = await uploadProfile(file.buffer, uuidv4());
        console.log(user);

        const updatedUser = await userModel.findByIdAndUpdate(
            user._id,
            {
                profile_img: result.url,
                profile_img_id: result.fileId
            },
            { new: true }
        );
        res.status(200).json({
            message: "Profile image updated successfully",
            imageUrl: result.url,
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error uploading profile image:', error);
        res.status(500).json({ error: 'Failed to upload profile image' });
    }
});
module.exports = router;