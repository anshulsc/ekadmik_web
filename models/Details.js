const mongoose = require('mongoose');

const DetailsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Details', DetailsSchema);