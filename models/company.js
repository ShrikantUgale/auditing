const mongoose = require('mongoose');

// CompanySchema Schema
const CompanySchema = mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    companyid: {
        type: String,
        required: true
    }
});

const Company = module.exports = mongoose.model('Company', CompanySchema);
