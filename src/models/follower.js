'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class FOLLOWER extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // FOLLOWER.belongsTo(models.USER, { foreignKey: 'ID' })
        }
    }
    FOLLOWER.init({
        FOLLOWING_USER_ID: {
            type: DataTypes.STRING(500),
            primaryKey: true,
        },
        FOLLOWED_USER_ID: {
            type: DataTypes.STRING(500),
            primaryKey: true,
        },

    }, {
        sequelize,
        freezeTableName: true,
        modelName: 'FOLLOWER',
    });

    return FOLLOWER;
};