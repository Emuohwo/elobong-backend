const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose')
require('dotenv/config')

// routers
const productRouter = require('./routers/products')


const api = process.env.API_URL

// Middleware
app.use(express.json());
app.use(morgan('tiny'))
app.use(`${api}/products`, productRouter)



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