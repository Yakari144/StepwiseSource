var Order = require('../models/order')

// Order list
module.exports.list = () => {
        return Order.find()
                .then(docs => {
                        return docs
                })
                .catch(erro => {
                        return erro
                })
}

module.exports.getOrder = (id) => {
    return Order.findOne({idDemo:id})
        .then(docs => {
                return docs
        })
        .catch(erro => {
                return erro
        })
}


module.exports.updateOrder = (id,a) => {
        return Order.updateOne({idDemo: id},a)
            .then(Order => {
                    return a
            })
            .catch(erro => {
                    return erro
            })
    }