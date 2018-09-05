let mongoose = require('mongoose');

// PFC Schema
let pfcSchema = mongoose.Schema({
    operationNum: {
        type: Number,
        required: true
    },
    machineNum: {
        type: String,
        required: true
    },
    offAssly: {
        type: String,
    },
    prodChars: {
        type: String,
        required: true
    },
    processChars: {
        type: String,
        required: true
    },
    char: {
        type: String,
    },
    remarks: {
        type: String,
    }
});

let PFC = module.exports = mongoose.model('PFC', pfcSchema);
