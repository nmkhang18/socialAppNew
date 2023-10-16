'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class OTP extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

        }
    }
    OTP.init({
        EMAIL: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        VALUE: DataTypes.STRING,
        THOIHAN: DataTypes.DATE
    }, {
        sequelize,
        freezeTableName: true,
        modelName: 'OTP',
    });

    return OTP;
};