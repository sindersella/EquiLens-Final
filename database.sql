CREATE DATABASE equiLens;
USE equiLens;
CREATE TABLE rankings (id INT AUTO_INCREMENT, platform VARCHAR(100), category VARCHAR(100), issue VARCHAR(100), ranking DECIMAL(5, 2), PRIMARY KEY(id));
CREATE TABLE user_details (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(50) unique, firstname VARCHAR(50), lastname VARCHAR(50), email VARCHAR(100) unique, hashedPassword VARCHAR(100), registration_date timestamp NULL DEFAULT CURRENT_TIMESTAMP);
CREATE USER 'appuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2027';
GRANT ALL PRIVILEGES ON equiLens.* TO 'appuser'@'localhost';