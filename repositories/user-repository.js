const topic_enum = require('./enums/topic');

module.exports = class UserRepository {
    constructor(db_context) {
        this.db_context = db_context;
        this.sequelize = db_context.sequelize;
        this.User = db_context.User;
        this.Topic = db_context.Topic;
        
        this.find_all = this.find_all.bind(this)
        this.find_one = this.find_one.bind(this)
        this.create = this.create.bind(this)
        this.update = this.update.bind(this)
        this.update_or_create = this.update_or_create.bind(this)
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
                    return created
                }
            })
            .then(newUser => {
                this.Topic.create({ topic_id: newUser.user_id, type: topic_enum.User })
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
        let { user_id } = user_obj;
        this.User.findOne({ where: { user_id } })
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
            .update(
                { shows: false },
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


}