'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class USER extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            USER.hasMany(models.POST, { foreignKey: 'ID' })
            USER.hasMany(models.USER_CONVERSATION, { foreignKey: 'USER_ID' })
            USER.hasMany(models.FOLLOWER, { foreignKey: 'FOLLOWED_USER_ID' })

            // USER.belongsTo(models.TAIKHOAN, { foreignKey: 'ID' })

        }
    }
    USER.init({
        ID: {
            type: DataTypes.STRING(500),
            primaryKey: true,
        },
        USERNAME: DataTypes.STRING(50),
        FULLNAME: DataTypes.STRING(50),
        EMAIL: DataTypes.STRING(50),
        PASSWORD: DataTypes.STRING(100),
        GENDER: DataTypes.STRING(10),
        AVATAR: DataTypes.STRING(500),
        ADDRESS: DataTypes.STRING(500),
        MOBILE: DataTypes.CHAR(11),
        DESCRIPTION: DataTypes.STRING(500),




    }, {
        sequelize,
        freezeTableName: true,
        modelName: 'USER',
    });

    return USER;
};