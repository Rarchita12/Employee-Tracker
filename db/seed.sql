INSERT INTO department (department_name)
VALUES
  ('IT'),
  ('Sales'),
  ('General Management'),
  ('Marketing'),
  ('Finance'),
  ('Human Resource')
  ;

INSERT INTO role (title, salary, department_id)
VALUES
  ('Software Engineer', 40, 1),
  ('Associate', 100, 2),
  ('Vice President', 250, 4),
  ('General Manager', 190, 3),
  ('Managing Director', 500,6),
  ('CEO', 1000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES

('Jamie','Dimon', 6, NULL),
 ('Doug', 'Dime', 5, 1),
 ('Bill', 'Doe', 4, NULL),
('Joe', 'Ole', 3, 2),
('Sam', 'Grof', 2, 4),
('Bob', 'Smith', 1, 5);
