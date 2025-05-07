const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const OrganizationFeedback = sequelize.define("OrganizationFeedback", {
  reviewer_type: {
    type: DataTypes.ENUM("organization", "manager"),
    allowNull: false,
  },
  reviewer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  target_type: {
    type: DataTypes.ENUM("organization", "orphanage"),
    allowNull: false,
  },
  target_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: "OrganizationFeedbacks" 
});

module.exports = OrganizationFeedback;
