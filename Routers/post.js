import express from 'express';
import { Post } from '../Models/Post.js';
import { User } from '../Models/User.js';
import { SendNotification, decodeJwtToken, getCurrentDate } from '../service.js';

let router = express.Router();

//Upload Post
router.post('/newpost', async (req, res) => {
  try {
    let token = req.headers['x-auth'];
    let userId = decodeJwtToken(token);

    let user = await User.findById({ _id: userId });
    if (!user) {
      res.status(400).json({ message: 'Invalid Authorization' });
      return;
    }

    let { title, details, image } = req.body;
    //Current Date
    let date = getCurrentDate();
    //Uploading New Post to the Post collections
    const uploadPost = await new Post({
      userName: user.name,
      userGender: user.gender,
      image,
      title,
      details,
      userId,
      date,
    }).save();

    //content for notification
    let content = {
      title,
      date,
      isViewed: false,
      id: uploadPost._id,
      message: 'New Post',
    };
    //Send notification to all users
    let all_users = User.find();
    for (var i = 0; i < all_users.length; i++) {
      if (all_users[i]._id !== userId) {
        await SendNotification({ id: all_users[i]._id, content });
      }
    }

    res.status(201).json({ message: 'Post uploaded Successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
});

//Update Views
router.put('/addviews', async (req, res) => {
  try {
    let token = req.headers['x-auth'];
    let userId = decodeJwtToken(token);

    let user = await User.findById({ _id: userId });
    if (!user) {
      res.status(400).json({ message: 'Invalid Authorization' });
      return;
    }
    let id = req.body.id;
    let post = await Post.findById({ _id: id });
    //Add +1 views on existing views count
    let views = post.views + 1;

    //Updating Views
    await Post.findOneAndUpdate({ _id: id }, { $set: { views: views } });

    res.status(200).json({ message: 'Views added Successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

//Get All Post's
router.get('/get-post', async (req, res) => {
  try {
    let token = req.headers['x-auth'];
    let userId = decodeJwtToken(token);

    let user = await User.findById({ _id: userId });
    if (!user) {
      res.status(400).json({ message: 'Invalid Authorization' });
      return;
    }
    let post = await Post.find();
    res.status(200).json({ message: 'Post Got Successfully', post });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

//Edit Post
router.post('/edit-post', async (req, res) => {
  try {
    let token = req.headers['x-auth'];
    let userId = decodeJwtToken(token);

    let user = await User.findById({ _id: userId });
    //Checkig is Post is available!
    let post = await Post.findById({ _id: userId });
    if (!user || !post || post.userId !== userId) {
      res.status(400).json({ message: 'Invalid Authorization' });
      return;
    }
    let { title, details, image, id } = req.body;
    //Updating the existing post
    await Post.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          userName: user.name,
          userGender: user.gender,
          image,
          title,
          details,
        },
      }
    );

    res.status(201).json({ message: 'Post updated Successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
});

//Delete Post
router.delete('/delete-post/:id', async (req, res) => {
  try {
    let token = req.headers['x-auth'];
    let userId = decodeJwtToken(token);

    let user = await User.findById({ _id: userId });
    if (!user) {
      res.status(400).json({ message: 'Invalid Authorization' });
      return;
    }
    let id = req.params.id;
    //Deleting Post by Id
    await Post.findByIdAndDelete({ _id: id });

    res.status(200).json({ message: 'Post Deleted Successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

export let postRouter = router;
