import dotenv from "dotenv";

import { drizzle } from "drizzle-orm/neon-http";

dotenv.config();

const DB_URL = process.env.DATABASE_URL || "";

export const db = drizzle(DB_URL, { casing: "snake_case" });

const makeConnectionWithDatabase = async () => {
  try {
    await db.execute("select 1");
    console.log("Database connection successful");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export default makeConnectionWithDatabase;
