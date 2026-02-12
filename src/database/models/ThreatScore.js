import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import Project from "./Project.js";

const ThreatScore = sequelize.define("ThreatScore", {
  ip: {
    type: DataTypes.STRING,
    allowNull: false
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  ProjectId: {
    type: DataTypes.UUID,
    allowNull: true
  }
});

Project.hasMany(ThreatScore);
ThreatScore.belongsTo(Project, { onDelete: "CASCADE" });

export default ThreatScore;
