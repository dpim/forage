const mongoose = require('mongoose');
 
module.exports = mongoose.model('User',
    {
        username: { type: String, index: { unique: true }},
        password: String,
        email: { type: String, index: { unique: true }},
        createdDate: { type: Date, default: Date.now },
        lastUpdatedDate: { type: Date, default: Date.now },
        token: String,
        createdItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item'}],
        upvotedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item'}]
    }
);