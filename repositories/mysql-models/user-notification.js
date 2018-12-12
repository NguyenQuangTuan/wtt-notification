module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user_notification', {
        user_notification_id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        user_id: {

            type: DataTypes.STRING(50),
            allowNull: false
          
        },
        notification_id:{

            type: DataTypes.STRING(50),
            allowNull: false
          
        },
        seen: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
            underscored: true,
        })
}