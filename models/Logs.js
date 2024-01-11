'use strict';

const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const moment = require('moment')

const schema = new Schema({
    "name" : String,
    "function": String,
    "input": String,
    "outPut" : String,
    updatedAt: String,
    // updatedBy: String,
    // createdAt: String,
}, {
    timestamps: true
});

// schema.pre("save", function (next) {
//     const now = moment.utc().format('YYYY-MM-DD HH:mm:ss');
//     if (!this.createdAt) {
//         this.createdAt = now;
//     }
//     next();
// });
// schema.pre("updateOne", function (next) {
//     this.updatedAt = moment.utc().format('YYYY-MM-DD HH:mm:ss');
//     next();
// });
schema.index({createdAt: 1},{expireAfterSeconds: 8640000});
module.exports = mongoose.model('log', schema);