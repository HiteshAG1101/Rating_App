const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");

const User = sequelize.define(
    "User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(60),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING(400),
        allowNull: true,
    },
    role: {
        type: DataTypes.ENUM("admin", "normal", "store_owner"),
        allowNull: false,
    },
}, {
    timestamps: true,
}
);

module.exports = User;