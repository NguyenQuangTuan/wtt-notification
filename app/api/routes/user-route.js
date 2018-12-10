const user_middleware = require('../middlewares/user-middleware')
const tokent_middleware = require('../middlewares/tokent-middleware')

module.exports = (app, user_controller) => {
    app.post('/notifcations-users/users-refresh-token',
        // tokent_middleware.verify,
        user_middleware.validate_create,
        user_controller.create,
        (req, res) => {
            return res.status(200).send(res.created);
        });

    app.put('/notifcations-users/users-refresh-token',
        // tokent_middleware.verify,
        user_middleware.validate_create,
        user_controller.update_or_create,
        (req, res) => {
            return res.status(200).send(res.result);
        });

    app.get('/notifcations-users/users-refresh-token',
        user_controller.find_all,
        (req, res) => {
            return res.status(200).send(res.count);
        })
}