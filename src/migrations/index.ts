import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" });

// Validate database URL exists
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

// Initialize Neon client and Drizzle
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

const main = async () => {
  try {
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error during migration:", error);
    process.exit(1);
  }
};

main();
