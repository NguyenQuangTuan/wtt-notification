/**
 * Tầng routes:
 * - Tầng này định nghĩa ra các api và chèn các middleware theo thứ tự
 */
const tokent_middleware = require('../middlewares/tokent-middleware')


module.exports = (app, notification_controller) => {
  app.get('/notifications/findByUser',
    tokent_middleware.verify,
    notification_controller.find_by_user,
    (req, res) => {
      return res.status(200).send(res.notifications)
    }
  )

  app.get('/notifications/getUnseenNumber',
    tokent_middleware.verify,
    notification_controller.get_unseen_number,
    (req, res) => {
      return res.status(200).send(res.result)
    }
  )

  app.post('/notifications/markSeen',
    tokent_middleware.verify,
    notification_controller.mark_seen,
    (req, res) => {
      return res.status(200).send(res.result)
    }
  )
  app.post('/notifications/markSeenAll',
    tokent_middleware.verify,
    notification_controller.mark_seen_all,
    (req, res) => {
      return res.status(200).send(res.result)
    }
  )
}