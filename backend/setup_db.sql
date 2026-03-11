CREATE USER finance_tracker_user WITH PASSWORD 'yourpassword';
CREATE DATABASE finance_tracker OWNER finance_tracker_user;
GRANT ALL PRIVILEGES ON DATABASE finance_tracker TO finance_tracker_user;
