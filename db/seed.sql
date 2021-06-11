INSERT INTO department (name_department)
VALUES
  ('IT'),
  ('Sales'),
  ('General Management'),
  ('Marketing'),
  ('Finance'),
  ('Human Resource'),
  ('Purchase')
  ;

INSERT INTO role (title, salary, department_name)
VALUES
  ('Software Engineer', 40, 1),
  ('Associate', 100, 2),
  ('Vice President', 250, 4),
  ('General Manager', 190, 3),
  ('Managing Director', 500,6),
  ('CEO', 1000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Bob', 'Smith', 1, 2),
  ('Sam', 'Grof', 4, 3),
  ('Joe', 'Ole', 3, 5),
  ('Bill', 'Doe', 4, NULL),
  ('Doug', 'Dime', 5, 6),
  ('Jamie','Dimon', 6, NULL);