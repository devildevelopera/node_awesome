const express = require('express');
var multer = require('multer');
const router = express.Router();
const Post = require('../models/Post');
var fs = require('fs');

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err){
        res.json({message: err})
    }
});

router.get('/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        res.json(post);
    } catch {
        res.json({message: err});
    }
});

router.get('/individual/:user_id', async (req, res) => {
    try {
        var query = { user_id: req.params.user_id };
        const posts = await Post.find(query);
        res.json(posts);
    } catch {
        res.json({message: err});
    }
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/product')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname )
    }
});

var upload = multer({ storage: storage }).array('file');

router.post('/upload', async (req, res) => {
    upload(req, res, function (err) {
           if (err instanceof multer.MulterError) {
               return res.status(500).json(err)
           } else if (err) {
               return res.status(500).json(err)
           }
      return res.status(200).send(req.files)
    });
});

router.post('/', async (req, res) => {
    const post = new Post({
        user_id: req.body.user_id,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        img_arr: req.body.img_arr
    });
    try {
        const savedPost = await post.save();
        res.json(savedPost);
    } catch (err) {
        res.json({message: err});
    }
});

router.delete('/:postId', async (req, res) => {
    try {
        const img_arr = req.body;
        for (var i = 0; i < img_arr.length; i++ ) {
            const path = './uploads/product/'+img_arr[i]
            fs.unlink(path, (err) => {
                if (err) {
                  console.error(err)
                  return
                }
              })
            }
        const removedPost = await Post.remove({_id: req.params.postId});
        res.json(removedPost);
    } catch {
        res.json({message: err});
    }
});

router.patch('/:postId', async (req, res) => {
    try {
        const updatePost = await Post.updateOne(
            { _id: req.params.postId},
            { $set: {
                    name: req.body.name,
                    description: req.body.description,
                    price: req.body.price
                } }
        );
        res.json(updatePost);
    } catch (err) {
        res.json({message: err});
    }
});

router.patch('/withimages/:postId', async (req, res) => {
    try {
        const previous_img_arr = req.body.previous_img_arr;
        for (var i = 0; i < previous_img_arr.length; i++ ) {
            const path = './uploads/product/'+previous_img_arr[i]
            fs.unlink(path, (err) => {
                if (err) {
                  console.error(err)
                  return
                }
              })
            }
        const updatePost = await Post.updateOne(
            { _id: req.params.postId},
            { $set: {
                    name: req.body.name,
                    description: req.body.description,
                    price: req.body.price,
                    img_arr: req.body.img_arr
                } }
        );
        res.json(updatePost);
    } catch (err) {
        res.json({message: err});
    }
})

module.exports = router;