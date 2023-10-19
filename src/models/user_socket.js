'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class USER_SOCKET extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // USER_SOCKET.belongsTo(models.CONVERSATION, { foreignKey: 'CONVERSATION_ID' })
            // USER_SOCKET.belongsTo(models.USER, { foreignKey: 'USER_ID' })

        }
    }
    USER_SOCKET.init({
        USER_ID: {
            type: DataTypes.STRING(500),
            primaryKey: true,
        },
        SOCKET_ID: {
            type: DataTypes.STRING(500),
            primaryKey: true,
        },
    }, {
        sequelize,
        freezeTableName: true,
        modelName: 'USER_SOCKET',
    });

    return USER_SOCKET;
};