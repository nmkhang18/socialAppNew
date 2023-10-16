'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class USER_CONVERSATION extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            USER_CONVERSATION.belongsTo(models.CONVERSATION, { foreignKey: 'CONVERSATION_ID' })
            USER_CONVERSATION.belongsTo(models.USER, { foreignKey: 'USER_ID' })

        }
    }
    USER_CONVERSATION.init({
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        USER_ID: {
            type: DataTypes.STRING(500),
            primaryKey: true,
        },
        CONVERSATION_ID: {
            type: DataTypes.STRING(500),
            primaryKey: true,
        },
    }, {
        sequelize,
        freezeTableName: true,
        modelName: 'USER_CONVERSATION',
    });

    return USER_CONVERSATION;
};