'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CONVERSATION extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            CONVERSATION.hasMany(models.USER_CONVERSATION, { foreignKey: 'CONVERSATION_ID' })
        }
    }
    CONVERSATION.init({
        ID: {
            type: DataTypes.STRING(500),
            primaryKey: true,
        },
        TITLE: DataTypes.STRING(500)
    }, {
        sequelize,
        freezeTableName: true,
        modelName: 'CONVERSATION',
    });

    return CONVERSATION;
};