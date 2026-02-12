import dotenv from "dotenv";
import app from "./app.js";
import sequelize from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;


async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer();
