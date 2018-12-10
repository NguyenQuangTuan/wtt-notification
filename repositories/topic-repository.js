module.exports = class TopicRepository {
    constructor(db_context) {
        this.db_context = db_context;
        this.sequelize = db_context.sequelize;
        this.Topic = db_context.Topic;
        this.User = db_context.User;
        this.UserTopic = db_context.UserTopic;

        this.find_all = this.find_all.bind(this)
        this.find_one = this.find_one.bind(this)
        this.create = this.create.bind(this)
        this.update = this.update.bind(this)
        this.delete = this.delete.bind(this)
        this.get_all_user_by_topic = this.get_all_user_by_topic.bind(this)
    }

    find_all(condition = {}, select = null, offset = 0, limit = null, order_by = null, callback) {
        this.Topic
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
        this.Topic
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
        this.Topic
            .create(user)
            .then(res => {
                if (!res) return callback(null, null)
                else {
                    callback(null, res.dataValues)
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
        this.Topic
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


    delete(condition, callback) {
        this.Topic
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

    // lay danh sach user theo topic va loai (user/post)
    get_all_user_by_topic(topic_id, type, callback) {
        this.UserTopic.findAll({
            where: {
                topic_id,
                type
            },
            include: {
                model: this.User,
                as: 'user'
            }
        }).then(res => {
            res = res.map(ck => ck.dataValues.user)
            callback(null, res)
            return null
        }).catch(err => {
            console.log(err)
            callback(err)
            return null
        })
    }
}