const mongoose = require('mongoose');

module.exports = mongoose.model('Item',
    {
        name: String,
        tags: [String],
        location: String,
        type: String,
        size: Number,
        createdDate: { type: Date, default: Date.now },
        lastUpdatedDate: { type: Date, default: Date.now },
        createdByUser : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        upvotedByUserId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        xCoordinate: Number,
        yCoordinate: Number,
        coordCode: String
    }
);