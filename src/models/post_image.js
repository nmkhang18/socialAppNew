'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class POST_IMAGE extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            POST_IMAGE.belongsTo(models.POST, { foreignKey: 'POST_ID' })
        }
    }
    POST_IMAGE.init({
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        POST_ID: DataTypes.STRING(500),
        IMAGE: DataTypes.STRING(500)
    }, {
        sequelize,
        freezeTableName: true,
        modelName: 'POST_IMAGE',
    });

    return POST_IMAGE;
};