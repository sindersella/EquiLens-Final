CREATE DATABASE myClinics;
USE myClinics;
CREATE TABLE books (id INT AUTO_INCREMENT,name VARCHAR(50),price DECIMAL(5, 2) unsigned,PRIMARY KEY(id));
INSERT INTO books (name, price)VALUES('database book', 40.25),('Node.js book', 25.00), ('Express book', 31.99) ;
CREATE TABLE clinics (id INT AUTO_INCREMENT,name VARCHAR(100),street VARCHAR(100),postcode VARCHAR(8), latitude DECIMAL(10, 8), longitude DECIMAL(11, 8), PRIMARY KEY(id));
CREATE TABLE user_details (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(50) unique, firstname VARCHAR(50), lastname VARCHAR(50), email VARCHAR(100) unique, hashedPassword VARCHAR(100), registration_date timestamp NULL DEFAULT CURRENT_TIMESTAMP);
CREATE USER 'appuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2027';
GRANT ALL PRIVILEGES ON myClinics.* TO 'appuser'@'localhost';
