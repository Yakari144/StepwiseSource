var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
const MONGODB_PORT = "50744";
// get MONGO_URI from environment variables
const MONGO_URI = process.env.MONGO_URI;

var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost:'+MONGODB_PORT+'/StepwiseSource';
if (MONGO_URI) {
   var mongoDB = MONGO_URI+'/StepwiseSource';
}
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
// Handle CORS related issues that might occur when trying to access the API from different domains during development and testing
app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', 'http://epl.di.uminho.pt');
   res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
   res.header('Access-Control-Allow-Credentials', 'true');
   next();
 });
app.use(cors())
app.use('/', indexRouter);

module.exports = app;
