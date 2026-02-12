import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import User from "./User.js";

const Project = sequelize.define("Project", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apiKey: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
});

User.hasMany(Project, { onDelete: "CASCADE" });
Project.belongsTo(User, { onDelete: "CASCADE" });

export default Project;
