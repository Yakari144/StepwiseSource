var express = require('express');
var router = express.Router();

var DemoController = require('../controllers/demo');
var VariableController = require('../controllers/variable');

/* GET home page. */
router.get('/api/:idDemo', function(req, res, next) {
  var id = req.params.idDemo;
  //Ir buscar as ligações com origem na cidade
  DemoController.getDemo(id)
    .then(dados=>{
      //Adicionar o nome da cidade de destino
      slides = dados.slides;
      //Para cada ligação, criar uma promessa para ir buscar os dados da cidade de destino
      VariableController.getVariable(id)
        .then(dados=>{
          //Adicionar o nome da cidade de destino
          res.json({slides:slides,variables:dados.variables});
        })
  })
  .catch(erro=>{
      res.status(500).json({error: erro, message: req.params.idDemo});
  });
});

router.get('*', function(req, res, next) {
  res.status(404).json({error: "Not Found", message: req.params.idDemo});
})

router.post('/api/demo', function(req, res, next) {
  // generate Demo by using the parser.py script with the text provided as input
  // call the parser.py script with the text as input
  var spawn = require("child_process").spawn;
  // create a temporary file to store the text
  var fs = require('fs');
  fs.writeFileSync("temp.txt", req.body.text);
  // call the parser.py script with the temporary file as input
  var process = spawn('python3',["./parser.py", "temp.txt"]);
  process.stdout.on('data', function(data) {
    idDemo = data.toString();
    // remove the \n character from the end of the string
    idDemo = idDemo.replace(/\n$/, '');
    console.log(idDemo);
    res.json({"idDemo":idDemo});
  });

  process.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    res.status(500).send(`stderr: ${data}`);
  });

  process.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    //res.send(`child process exited with code ${code}`);
  });
});

module.exports = router;
