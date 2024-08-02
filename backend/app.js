var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
const MONGODB_PORT = "50744";


var mongoose = require('mongoose');
var mongoDB = 'mongodb://epl.di.uminho.pt:'+MONGODB_PORT+'/StepwiseSource';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error...'));
db.once('open', function() {
   console.log("Conexão ao MongoDB realizada com sucesso...")
});

var indexRouter = require('./routes/index');
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
app.use('/', indexRouter);

module.exports = app;
