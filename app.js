const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose')
const cors = require('cors')

require('dotenv/config')

app.use(cors())
app.options('*', cors())

// routers
const categoriesRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error_handler')


const api = process.env.API_URL

// Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt())
// app.use(errorHandler())
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ message: 'User not authorized' })
    } 

    if (err.name === 'ValidationError') {
        return res.status(401).json({ message: err })
    }

    return res.status(500).json({ message: err })
})

app.use(`${api}/categories`, categoriesRoutes)
app.use(`${api}/products`, productRoutes)
app.use(`${api}/users`, usersRoutes)
app.use(`${api}/orders`, ordersRoutes)



mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    dbName: 'elong'
})
.then(() => {
    console.log('Database connection is ready')
})
.catch((err) => {
    console.log(err)
})

app.listen(3000, () => {
    console.log(api)
    console.log('Server is running on http://localhost:3000')
})