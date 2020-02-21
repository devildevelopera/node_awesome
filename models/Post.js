const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
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
    quantity: {
        type: Number,
        required: true
    },
    img_arr: {
        type: Array,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Posts', PostSchema);