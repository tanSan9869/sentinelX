import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import Project from "./Project.js";

const RequestLog = sequelize.define("RequestLog", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: false
  },
  method: {
    type: DataTypes.STRING,
    allowNull: false
  },
  route: {
    type: DataTypes.STRING,
    allowNull: false
  },
  statusCode: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userAgent: {
    type: DataTypes.STRING
  },
  ProjectId: {
    type: DataTypes.UUID,
    allowNull: true
  }
});

Project.hasMany(RequestLog);
RequestLog.belongsTo(Project, { onDelete: "CASCADE" });

export default RequestLog;
