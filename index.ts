import "dotenv/config";
import app from "./src/app";
import { connectDB } from "./src/database/mongodb";

const PORT = process.env.PORT || 3001;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`SikhshaSathi API running on http://localhost:${PORT}`);
  });
};

start();