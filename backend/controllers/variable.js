var Variable = require('../models/variable')

// Variable list
module.exports.list = () => {
        return Variable.find()
                .then(docs => {
                        return docs
                })
                .catch(erro => {
                        return erro
                })
}

module.exports.getVariable = (id) => {
    return Variable.findOne({idDemo:id})
        .then(docs => {
                return docs
        })
        .catch(erro => {
                return erro
        })
}

module.exports.updateVariable = (id,a) => {
        return Variable.updateOne({idDemo: id},a)
            .then(Variable => {
                    return a
            })
            .catch(erro => {
                    return erro
            })
    }