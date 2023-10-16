'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class POST extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            POST.hasMany(models.POST_IMAGE, { foreignKey: 'POST_ID' })
            POST.hasMany(models.LIKE, { foreignKey: 'POST_ID' })
            POST.belongsTo(models.USER, { foreignKey: 'CREATED_BY_USER_ID' })

        }
    }
    POST.init({
        ID: {
            type: DataTypes.STRING(500),
            primaryKey: true,
        },
        CREATED_BY_USER_ID: DataTypes.STRING(500),
        CAPTION: DataTypes.STRING(500),
    }, {
        sequelize,
        freezeTableName: true,
        modelName: 'POST',
    });

    return POST;
};