const sequelize = require("../config/index");
const User = require("./user.model");
const Store = require("./store.model");
const Rating = require("./rating.model");

// Define associations

// A user can have many ratings
User.hasMany(Rating, { foreignKey: "user_id", as: "ratings" });
Rating.belongsTo(User, { foreignKey: "user_id", as: "user" });

// A store can have many ratings
Store.hasMany(Rating, { foreignKey: "store_id", as: "ratings" });
Rating.belongsTo(Store, { foreignKey: "store_id", as: "store" });

// A store belongs to a user (store owner)
Store.belongsTo(User, { foreignKey: "owner_id", as: "owner" });

module.exports = {
    sequelize,
    User,
    Store,
    Rating,
};