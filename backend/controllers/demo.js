var Demo = require('../models/demo')

// Demo list
module.exports.list = () => {
        return Demo.find({},{idDemo:1,demoName:1})
                .then(docs => {
                        return docs
                })
                .catch(erro => {
                        return erro
                })
}

module.exports.getDemo = (id) => {
    return Demo.findOne({idDemo:id})
        .then(docs => {
                return docs
        })
        .catch(erro => {
                return erro
        })
}

module.exports.generateDemo = (text) => {
        // generate Demo by using the parser.py script with the text provided as input
        // call the parser.py script with the text as input
        var spawn = require("child_process").spawn;
        // create a temporary file to store the text
        var fs = require('fs');
        fs.writeFileSync("temp.txt", text);
        // call the parser.py script with the temporary file as input
        var process = spawn('python3',["./parser.py", "temp.txt"]);
        var output = {"idDemo":""};
        process.stdout.on('data', function(data) {
            output = {"idDemo":data.toString()};
            return output
        });

        return output
}