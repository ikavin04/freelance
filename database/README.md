# Database Setup Guide

## PostgreSQL Installation

### Windows
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Set a password for the `postgres` user (remember this!)
4. Default port is 5432

### macOS
```bash
brew install postgresql
brew services start postgresql
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## Database Setup

### 1. Create Database

#### Using psql command line:
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE freelance_db;

# Exit psql
\q
```

#### Using pgAdmin (GUI):
1. Open pgAdmin
2. Right-click on "Databases"
3. Select "Create" > "Database"
4. Name it `freelance_db`
5. Click "Save"

### 2. Run Schema

#### Method 1: Using psql
```bash
psql -U postgres -d freelance_db -f schema.sql
```

#### Method 2: Using pgAdmin
1. Open pgAdmin
2. Select `freelance_db`
3. Click on "Query Tool"
4. Open `schema.sql` file
5. Execute the script

### 3. Verify Tables Created

```sql
-- Connect to database
\c freelance_db

-- List all tables
\dt

-- Should show: users, otps, applications
```

## Connection String Format

```
postgresql://username:password@host:port/database_name
```

Example:
```
postgresql://postgres:mypassword@localhost:5432/freelance_db
```

## Troubleshooting

### Cannot connect to database
- Check if PostgreSQL service is running
- Verify port 5432 is not blocked by firewall
- Check username and password

### Permission denied
- Make sure you're using the correct PostgreSQL user
- Grant necessary permissions:
```sql
GRANT ALL PRIVILEGES ON DATABASE freelance_db TO postgres;
```

### Reset database
```sql
DROP DATABASE IF EXISTS freelance_db;
CREATE DATABASE freelance_db;
```

## Notes

- Flask-SQLAlchemy will automatically create tables if you use `db.create_all()`
- The schema.sql file is provided as a backup/reference
- OTPs expire after 5 minutes (configurable in config.py)
- Minimum 3 days constraint is enforced at both database and application level
