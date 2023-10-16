'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class LIKE extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            LIKE.belongsTo(models.POST, { foreignKey: 'POST_ID' })
        }
    }
    LIKE.init({
        USER_ID: {
            type: DataTypes.STRING(500),
            primaryKey: true,
        },
        POST_ID: {
            type: DataTypes.STRING(500),
            primaryKey: true,
        },
    }, {
        sequelize,
        freezeTableName: true,
        modelName: 'LIKE',
    });

    return LIKE;
};