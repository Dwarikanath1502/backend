const stripe = require('stripe')("SECRET_KEY")
const uuid = require("uuid/v4")


exports.makePayment = (req, res) => {
    const { products, token } = req.body
    console.log("PRODUCTS: ", products);

    let amount = 0;
    products.map(p => {
        amount = amount + p.price;
    });

    const idempotenceKey = uuid() //it will help to not charge the user agin in the case of network error or else

    // create a customer, charge a customer return

    return stripe.customers.create({
        email: token.email,
        source: token.id
    })
        .then(customer => {
            stripe.charges.create({
                amount: amount,
                currency: 'usd',
                customer: customer.id,
                receipt_email: token.email,
                shipping: {
                    name: token.card.name

                }
            }, { idempotenceKey })
                .then(result => res.status(200).jsom(result))
                .catch(err => console.log("ERROR: ", error))
        })

}