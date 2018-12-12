const user_middleware = require('../middlewares/user-middleware')
const tokent_middleware = require('../middlewares/tokent-middleware')

module.exports = (app, user_controller) => {
    app.put('/notifcations-users/users-refresh-token',
        tokent_middleware.verify,
        user_middleware.validate_create,
        user_controller.update_or_create,
        (req, res) => {
            return res.status(200).send(res.result);
        });

    app.delete('/notifcations-users/users-refresh-token',
        tokent_middleware.verify,
        user_controller.delete,
        (req, res) => {
            return res.status(200).send(res.deleted);
        })
}