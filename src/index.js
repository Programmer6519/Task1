import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { connectDB } from "../src/config/db.js";
import app from "./app.js";

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
