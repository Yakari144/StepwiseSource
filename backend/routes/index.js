var express = require('express');
var router = express.Router();

var DemoController = require('../controllers/demo');
var VariableController = require('../controllers/variable');
var OrderController = require('../controllers/order');

/* GET home page. */
router.get('/api/presentations', function(req, res, next) {
  console.log("Getting all presentations");
  // get all the presentations
  DemoController.list()
    .then(data => {
      res.json(data)
  })
    .catch(err => res.status(500).json(err));
});

router.get('/api/:idDemo', function(req, res, next) {
  var id = req.params.idDemo;
  //Ir buscar as ligações com origem na cidade
  DemoController.getDemo(id)
    .then(dados=>{
      //Adicionar o nome da cidade de destino
      const slides = dados.slides;
      const demoName = dados.demoName;
      //Para cada ligação, criar uma promessa para ir buscar os dados da cidade de destino
      VariableController.getVariable(id)
        .then(d2=>{
          const variables = d2.variables;
          OrderController.getOrder(id)
            .then(d3=>{
              const order = d3.order;
              const jsonString = order.replace(/'/g, '"');
              const dataStructure = JSON.parse(jsonString);
              const obj = {"demoName":demoName,"slides":slides,"variables":variables,"order":dataStructure};
              res.json(obj);
            })
        })
  })
  .catch(erro=>{
      res.status(500).json({error: erro, message: req.params.idDemo});
  });
});

router.get('/edit/:idDemo', function(req, res, next) {
  var id = req.params.idDemo;
  //Ir buscar as ligações com origem na cidade
  DemoController.getDemo(id)
    .then(dados=>{
      //Adicionar o nome da cidade de destino
      const demoName = dados.demoName;
      const demoText = dados.demoText
      const demoID = dados.idDemo
      const obj = {"demoID":demoID,"demoText":demoText,"demoName":demoName}
      res.json(obj)
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
  var process = spawn('python3',["./parser.py", "temp.txt", req.body.demoName]);
  process.stdout.on('data', function(data) {
    idDemo = data.toString();
    // remove the \n character from the end of the string
    idDemo = idDemo.replace(/\n$/, '').trim();
    // check with regex if is a valid id
    if (!idDemo.match(/^DI[0-9]+$/)) {
      res.status(500).send(idDemo);
      return;
    }
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

router.post('/edit/demo', function(req, res, next) {
  // generate Demo by using the parser.py script with the text provided as input
  // call the parser.py script with the text as input
  var spawn = require("child_process").spawn;
  // create a temporary file to store the text
  var fs = require('fs');
  fs.writeFileSync("temp.txt", req.body.demoText);
  let demoName = req.body.demoName;
  let demoID = req.body.demoID;
  // call the parser.py script with the temporary file as input
  var process = spawn('python3',["./parser.py", "temp.txt", demoName, demoID]);
  process.stdout.on('data', function(data) {
    console.log("python3 ./parser.py temp.txt",demoName, demoID)
    idDemo = data.toString();
    // remove the \n character from the end of the string
    idDemo = idDemo.replace(/\n$/, '').trim();
    // check with regex if is a valid id
    if (!idDemo.match(/^DI[0-9]+$/)) {
      res.status(500).send(idDemo);
      return;
    }
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

router.post('/api/feedback', function(req, res, next){
  const formData = require('form-data');
  const Mailgun = require('mailgun.js');
  const mailgun = new Mailgun(formData);
  const emailText = req.body.feedbackText
  const mg = mailgun.client({username: 'StepwiseSource', 
    key: process.env.MAILGUN_API_KEY || "mailgun-api-key"});
  //const message = req.body.feedbackText
  mg.messages.create('sandbox8176455735434538939219a14cb91a9c.mailgun.org', {
  	from: "Stepwise Source <mailgun@sandbox8176455735434538939219a14cb91a9c.mailgun.org>",
  	to: ["joaoltmsantos@gmail.com"],
  	subject: "Stepwise Feedback",
  	text: emailText,
  	html: emailText
  })
  .then(msg => msg.status!=200?console.log(msg):console.log("Feedback registado com sucesso")) // logs response data
  .catch(err => console.log(err)); // logs any error

})

module.exports = router;
