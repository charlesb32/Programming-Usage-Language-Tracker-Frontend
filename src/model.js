const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    title: String,
    data: {
        type: Array,
        items: {
            type: Object,
            properties: {
                Week: String,
                javascript: Number,
                python: Number,
                java: Number,
            }
        }
    }
});
// Export schema
module.exports = mongoose.model('tableSchema', tableSchema, 'Datasets');
