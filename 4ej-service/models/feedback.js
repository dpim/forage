const mongoose = require('mongoose');

module.exports = mongoose.model('Feedback',
    {
        email: String,
        text: String
    }
);