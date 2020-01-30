const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img_arr: {
        type: Array,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Posts', PostSchema);