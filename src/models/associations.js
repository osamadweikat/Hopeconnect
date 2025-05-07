const User = require("./User");
const Orphanage = require("./Orphanage");

User.hasMany(Orphanage, {
  foreignKey: "manager_id",
  as: "orphanages"
});

Orphanage.belongsTo(User, {
  foreignKey: "manager_id",
  as: "manager"
});

