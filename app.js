require('dotenv').config()

const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const cors = require('cors')
// MY ROUTES
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const orderRoutes = require('./routes/order')
const paymentRoutes = require('./routes/payment')

// DATABASE CONNECTION 
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("DATABASE CONNECTED...");
    // console.log(process.env) it will give env infos
}).catch(
    console.log("DATABASE CRASHED...")
)
// THIS IS MY MIDDLEWARE
app.use(bodyParser.json());
app.use(cookieParser())
app.use(cors())

// MY ROUTES
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', paymentRoutes);


// PORT
const port = process.env.PORT || 8000;  //if find port then run on it, else on 8000
// STARTING SERVER
app.listen(port, () => {
    console.log(`App is running at port ${port}`);
})