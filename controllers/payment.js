const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: "useYourMerchantId",
    publicKey: "useYourPublicKey",
    privateKey: "useYourPrivateKey"
});

exports.getToken = (req, res) => {
    gateway.clientToken.generate({})
        .then(response => {
            // pass clientToken to your front-end
            res.send(response)
        })
        .catch(err => err.status(500).json(err));
}

exports.processPayment = (req, res) => {

    let nonceFromTheClient = req.body.paymentMethodNonce

    let amountFromTheClient = req.body.amount

    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        deviceData: deviceDataFromTheClient,

        options: {
            submitForSettlement: true
        }
    }).then(result => { 
        res.json(result)
    })
    .catch(error => {
        res.status(500).json(error)
    })
}