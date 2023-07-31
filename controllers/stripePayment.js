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
                descriptiom: "a test account",
                shipping: {
                    name: token.card.name,
                    address: {
                        line1: token.card.address_line1,
                        line2: token.card.address_line2,
                        city: token.card.adddress_city,
                        country: token.card.address_country,
                        postal_code: token.card.address_zip
                    }

                }
            }, { idempotenceKey })
                .then(result => res.status(200).jsom(result))
                .catch(err => console.log("ERROR: ", error))
        })

}