INSERT INTO profiles (id, full_name, phone, role)
VALUES ('194054e9-d55a-4b9b-9dca-e69c083af463', 'Srija', '', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';