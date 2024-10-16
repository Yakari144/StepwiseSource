var mongoose = require('mongoose')

var exerciseSchema = new mongoose.Schema({
    idExercise: {
        type: String,
        required: true
    },
    regex: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
},{ versionKey: false })

var slideSchema = new mongoose.Schema({
    idSlide: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    variables: {
        type: [String],
        required: true
    },
    exercises: {
        type: [exerciseSchema],
        required: false
    }
},{ versionKey: false })

var demoSchema = new mongoose.Schema({
    idDemo: String,
    demoName: String,
    demoText: String,
    slides: [slideSchema]
},{ versionKey: false })
    
module.exports = mongoose.model('demo',demoSchema)
    
  