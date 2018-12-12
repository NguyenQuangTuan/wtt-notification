const Sequelize = require('sequelize')
module.exports = class UserRepository {
    constructor(db_context) {
        this.db_context = db_context;
        this.sequelize = db_context.sequelize;
        this.User = db_context.User;

        this.find_all = this.find_all.bind(this)
        this.find_one = this.find_one.bind(this)
        this.create = this.create.bind(this)
        this.update = this.update.bind(this)
        this.update_or_create = this.update_or_create.bind(this)
        this.get_refresh_tokens = this.get_refresh_tokens.bind(this)
        this.delete = this.delete.bind(this)
    }

    find_all(condition = {}, select = null, offset = 0, limit = null, order_by = null, callback) {
        this.User
            .findAll({
                attribute: select,
                where: condition,
                limit: limit,
                offset: offset * limit,
                order_by: order_by,
            })
            .then(res => {
                res = res.map(ck => ck.dataValues)
                callback(null, res)
                return null
            })
            .catch(err => {
                console.log(err)
                callback(err)
                return null
            })
    }

    find_one(condition = {}, select = null, callback) {
        this.User
            .findOne({
                where: condition,
                attribute: select,
            })
            .then(res => {
                if (!res) {
                    callback(null, null)
                    return null
                }
                else {
                    callback(null, res ? res.dataValues : null)
                    return null
                }
            })
            .catch(err => {
                console.log(err)
                callback(err)
                return null
            })
    }

    create(user, callback) {
        this.User
            .create(user)
            .then(res => {
                if (!res) return callback(null, null)
                else {
                    let created = res.dataValues;
                    callback(null, created)
                    return null
                }
            })
            .catch(err => {
                console.log(err)
                callback(err)
                return null
            })
    }

    update(condition, user_obj, callback) {
        this.User
            .update(user_obj, { where: condition })
            .then(res => {
                res = res.every(val => val == 1)
                callback(null, res)

                return null
            })
            .catch(err => {
                console.log(err)
                callback(err)
                return null
            })
    }

    update_or_create(user_obj, callback) {
        let { user_id, refresh_token } = user_obj;
        this.User.findOne({ where: { user_id, refresh_token } })
            .then(_user => {
                if (_user) {
                    return _user.update(user_obj);
                }
                return this.User.create(user_obj);
            })
            .then(() => {
                callback(null, { success: true })
            })
            .catch(err => {
                console.log(err)
                callback(err)
                return null
            })
    }


    delete(condition, callback) {
        this.User
            .destroy(
                { where: condition }
            )
            .then(res => {
                callback(null, true)
            })
            .catch(err => {
                console.log(err)
                callback(err)
                return null
            })
    }

    get_refresh_tokens(users) {
        return new Promise((resolve, reject) => {
            this.User
                .findAll(
                    {
                        where: {
                            user_id: {
                                [Sequelize.Op.in]: users
                            }
                        }
                    }
                )
                .then(res => {
                    console.log(res)
                    let refresh_token_arr = res.map(item => item.dataValues.refresh_token)
                    console.log(refresh_token_arr);
                    resolve(refresh_token_arr)
                    return null
                })
                .catch(err => {
                    console.log(err)
                    reject(err)
                    return null
                })
        })

    }


}