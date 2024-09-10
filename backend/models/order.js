var mongoose = require('mongoose')

var orderSchema = new mongoose.Schema({
    idDemo: String,
    order: String
},{ versionKey: false })
    
module.exports = mongoose.model('order',orderSchema)