const User = require("./User");
const Orphanage = require("./Orphanage");
const Volunteer = require("./Volunteer"); 

User.hasMany(Orphanage, {
  foreignKey: "manager_id",
  as: "orphanages"
});

Orphanage.belongsTo(User, {
  foreignKey: "manager_id",
  as: "manager"
});

User.hasOne(Volunteer, {
  foreignKey: "user_id",
  as: "volunteer_profile"
});

Volunteer.belongsTo(User, {
  foreignKey: "user_id",
  as: "user"
});

console.log("✅ associations.js loaded");
