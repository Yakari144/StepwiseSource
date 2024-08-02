var mongoose = require('mongoose')

var variableSchema = new mongoose.Schema({
    idDemo: String,
    variables: [
        {
        idVariable: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        command: {
            type: String,
            validate: {
                validator: function(v) {
                    return this.category == 'variable'
                },
                message: 'This is a variable, it must have a command'
            },
        },
        text: {
            type: String,
            validate: {
                validator: function(v) {
                    return this.category == 'variable'
                },
                message: 'This is a variable, it must have a text'
            },
        },
        style: {
            type: [String],
            validate: {
                validator: function(v) {
                    return this.category == 'command'
                },
                message: 'This is a command, it must have a style'
            },
        },
        type: {
            type: String,
            validate: {
                validator: function(v) {
                    return this.category == 'command'
                },
                message: 'This is a command, it must have a type'
            },
        }
        }
    ]
},{ versionKey: false })
    
module.exports = mongoose.model('variable',variableSchema)
    
  