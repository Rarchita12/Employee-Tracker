
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS department;


CREATE TABLE department(
id INTEGER AUTO_INCREMENT PRIMARY KEY,
name_department VARCHAR(30) NOT NULL
);

CREATE TABLE role (
id INTEGER AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(30) NOT NULL,
salary DECIMAL(10,2) NOT NULL,
department_name INTEGER NOT NULL,
CONSTRAINT fk_department_name FOREIGN KEY (department_name) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee(
id INTEGER AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INTEGER NOT NULL,
manager_id INTEGER, 
CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
FOREIGN KEY (manager_id) REFERENCES employee(id) 
);