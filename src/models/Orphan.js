const { DataTypes } = require("sequelize");
const sequelize = require("../config/db").sequelize;
const Orphanage = require("./Orphanage");

const Orphan = sequelize.define("Orphan", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM("male", "female"),
    allowNull: false
  },
  education_status: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  health_condition: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  orphanage_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Orphanage,
      key: "id"
    },
    onDelete: "SET NULL",
    allowNull: true
  },
  profile_image: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Orphan;
