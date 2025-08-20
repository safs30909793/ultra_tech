-- Insert initial courses
INSERT INTO courses (name, abbreviation, duration, schedule, certification_type, description) VALUES
('Web Development Frontend', 'WDF', '6 months', 'weekend', 'Certificate', 'Learn HTML, CSS, JavaScript, and modern frontend frameworks'),
('Web Development Backend', 'WDB', '6 months', 'weekend', 'Certificate', 'Learn server-side programming, databases, and APIs'),
('AI Starter Kit', 'AI', '8 weeks', 'weekend', 'Certificate', 'Introduction to Artificial Intelligence and Machine Learning'),
('AutoCAD', 'CAD', '16 weeks', 'morning,evening', 'Certificate', 'Computer-Aided Design software training'),
('Solar Installation', 'SOL', '12 weeks', 'morning,evening', 'Certificate', 'Solar panel installation and maintenance'),
('Computer Appreciation', 'CA', '8 weeks', 'morning,evening', 'Certificate', 'Basic computer applications and skills'),
('Forex Trading', 'FX', '10 weeks', 'morning,evening', 'Certificate', 'Foreign exchange trading fundamentals'),
('Cybersecurity', 'CYB', '16 weeks', 'morning,evening', 'Certificate', 'Information security and ethical hacking'),
('Cryptocurrency', 'CRY', '8 weeks', 'morning,evening', 'Certificate', 'Digital currency and blockchain technology');

-- Insert default admin
INSERT INTO admins (username, password_hash, role, first_name, last_name) VALUES
('Admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'System', 'Administrator');

-- Insert sample staff (emails that can be used for signup)
INSERT INTO staff (staff_id, first_name, last_name, email, phone) VALUES
('STAFF001', 'John', 'Doe', 'john.doe@ultratechglobalsolution.com.ng', '08012345678'),
('STAFF002', 'Jane', 'Smith', 'jane.smith@ultratechglobalsolution.com.ng', '08087654321'),
('STAFF003', 'Mike', 'Johnson', 'mike.johnson@ultratechglobalsolution.com.ng', '08098765432');
