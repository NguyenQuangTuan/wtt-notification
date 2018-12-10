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
mysql_data_context.sequelize.sync()

// // Repositories
const NotificationRepository = require('../../repositories/notification-repository')
const UserRepository = require('../../repositories/user-repository')

const notification_repository = new NotificationRepository(mysql_data_context)
const user_repository = new UserRepository(mysql_data_context)

// Message Queue


// Services
const NotificationService = require('../../services/notification-service')
const UserService = require('../../services/user-service')

const notification_service = new NotificationService(notification_repository)
const user_service = new UserService(user_repository)

// Controllers
const NotificationController = require('./controllers/notification-controller')
const UserController = require('./controllers/user-controller')

const notification_controller = new NotificationController(notification_service)
const user_controller = new UserController(user_service)

// Routes
require('./routes/notification-route')(app, notification_controller)
require('./routes/user-route')(app, user_controller)

// Error Handling
app.use((err, req, res, next) => {
  console.log(err);
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
