-- Seed data for UltraTech Global Solution LTD School Management System

USE ultratech_school_db;

-- Insert courses
INSERT INTO courses (name, description, duration, price, application_fee, registration_fee, certificate_fee) VALUES
('Web Development', 'Complete web development course covering HTML, CSS, JavaScript, and frameworks', '6 months', 50000.00, 200.00, 500.00, 1000.00),
('Artificial Intelligence', 'Introduction to AI, machine learning, and data science', '8 months', 75000.00, 200.00, 500.00, 1000.00),
('AutoCAD Design', 'Professional AutoCAD training for engineering and architectural design', '4 months', 40000.00, 200.00, 500.00, 1000.00),
('Solar Installation', 'Solar panel installation and maintenance training', '3 months', 35000.00, 200.00, 500.00, 1000.00),
('Digital Marketing', 'Complete digital marketing course including SEO, social media, and analytics', '5 months', 45000.00, 200.00, 500.00, 1000.00),
('Mobile App Development', 'Android and iOS app development using modern frameworks', '7 months', 60000.00, 200.00, 500.00, 1000.00);

-- Insert default admin
INSERT INTO admins (admin_id, first_name, last_name, email, password_hash, role) VALUES
('ADMIN001', 'System', 'Administrator', 'admin@ultratech.edu.ng', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin');

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value) VALUES
('school_name', 'UltraTech Global Solution LTD'),
('school_address', 'Lagos, Nigeria'),
('school_phone', '+234-XXX-XXXX-XXX'),
('school_email', 'info@ultratech.edu.ng'),
('paystack_public_key', 'pk_test_xxxxx'),
('paystack_secret_key', 'sk_test_xxxxx'),
('application_fee', '200.00'),
('registration_fee', '500.00'),
('certificate_fee', '1000.00');
