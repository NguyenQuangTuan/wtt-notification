/**
 * Tầng routes:
 * - Tầng này định nghĩa ra các api và chèn các middleware theo thứ tự
 */


module.exports = (app, notification_controller) => {
  app.get('/notifications/findByUser',
    notification_controller.find_by_user,
    (req, res) => {
      return res.status(200).send(res.notifications)
    }
  )

  app.get('/notifications/getUnseenNumber',
    notification_controller.get_unseen_number,
    (req, res) => {
      return res.status(200).send(res.result)
    }
  )

  app.post('/notifications/markSeen',
    notification_controller.mark_seen,
    (req, res) => {
      return res.status(200).send(res.result)
    }
  )

  app.post('/notifications/create',
    notification_controller.create,
    (req, res) => {
      return res.status(200).send(res.result)
    }
  )
}