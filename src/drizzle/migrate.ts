import { migrate } from 'drizzle-orm/node-postgres/migrator';
import db from './db'; 

const runMigration = async () => {
  try {
    console.log("🔄 Running migrations...");
    await migrate(db, { migrationsFolder: __dirname + "/migrations" });
    console.log("Migrations completed!");
    process.exit(0);
  } catch (err) {
    console.error(" Migration error:", err);
    process.exit(1);
  }
};

runMigration();
