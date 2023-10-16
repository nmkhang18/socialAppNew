'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class MESSEGES extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

        }
    }
    MESSEGES.init({
        ID: {
            type: DataTypes.STRING(500),
            primaryKey: true,
        },
        SEND_USER_ID: DataTypes.STRING(500),
        CONVERSATION_ID: DataTypes.STRING(500),
        TYPE: DataTypes.STRING(500),
        CONTENT: DataTypes.STRING(500),
    }, {
        sequelize,
        freezeTableName: true,
        modelName: 'MESSEGES',
    });

    return MESSEGES;
};