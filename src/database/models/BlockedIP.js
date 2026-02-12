import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import Project from "./Project.js";

const BlockedIP = sequelize.define("BlockedIP", {
  ip: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reason: {
    type: DataTypes.STRING
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  ProjectId: {
    type: DataTypes.UUID,
    allowNull: true
  }
});

Project.hasMany(BlockedIP);
BlockedIP.belongsTo(Project, { onDelete: "CASCADE" });

export default BlockedIP;

