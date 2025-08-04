-- Klario Database Initialization Script
-- This script sets up the initial database structure for production

-- Create the sessions table for express-session with connect-pg-simple
CREATE TABLE IF NOT EXISTS "sessions" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
) WITH (OIDS=FALSE);

-- Add index for session expiration cleanup
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "sessions" ("expire");

-- Create primary key for sessions table
ALTER TABLE "sessions" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- Ensure proper permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO klario_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO klario_user;
GRANT USAGE ON SCHEMA public TO klario_user;

-- Create extension for UUID generation (if needed)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create extension for cryptographic functions (if needed)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set timezone
SET timezone = 'UTC';