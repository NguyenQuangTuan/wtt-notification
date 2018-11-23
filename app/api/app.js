const express = require('express')
const body_parser = require('body-parser')
const query_handler = require('express-api-queryhandler')
const config = require('../../config/config')


// Express Setup
const app = express()
app.use(query_handler.filter())
app.use(query_handler.fields())
app.use(query_handler.pagination({ limit: 100 }))
app.use(query_handler.sort())
app.use(body_parser.urlencoded({ extended: false }))
app.use(body_parser.json())

// Data Context
const mysql_data_context = require('../../repositories/mysql-context')(config.mysql)
// mysql_data_context.sequelize.sync()
// // Repositories
const ProductRepository = require('../../repositories/product-repository')

const product_repository = new ProductRepository(mysql_data_context)

// Message Queue


// Services
const ProductService = require('../../services/product-service')

const product_service = new ProductService(product_repository)

// Controllers
const ProductController = require('./controllers/product-controller')

const product_controller = new ProductController(product_service)

// Routes
require('./routes/product-route')(app, product_controller)

// Error Handling
app.use((err, req, res, next) => {
  if (err.type) {
    let { type, message, detail } = err
    let error = { type }
    if (message) Object.assign(error, { message })
    if (detail) Object.assign(error, { detail })

    switch (type) {
      case 'Bad Request':
        return res.status(400).send(error)
      case 'Unauthorized':
        return res.status(401).send(error)
      case 'Request Failed':
        return res.status(402).send(error)
      case 'Not Found':
        return res.status(404).send(error)
      case 'Duplicated':
        return res.status(409).send(error)
    }
  }

  return res.status(500).send({ error: 'Internal Server Error' })
})

// Start Server
const port = config.port
const env = process.env.NODE_ENV
app.listen(port, () => {
  console.info(`Environment: ${env}`)
  console.info(`Server is listening on port: ${port}`)
})

module.exports = app
