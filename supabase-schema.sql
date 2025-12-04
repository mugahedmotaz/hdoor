-- HDOOR Attendance System - Complete Supabase Schema
-- This SQL script creates all necessary tables for the attendance system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Universities Table
CREATE TABLE universities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    domain TEXT,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles Table (extends auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('student', 'professor', 'admin')),
    student_id TEXT,
    department TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Device Bindings Table
CREATE TABLE device_bindings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    device_fingerprint TEXT NOT NULL,
    device_name TEXT,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, device_fingerprint)
);

-- Lectures Table
CREATE TABLE lectures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    course_code TEXT NOT NULL,
    location TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    qr_code_data TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance Table
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lecture_id UUID REFERENCES lectures(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    professor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    device_fingerprint TEXT NOT NULL,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    ip_address INET,
    UNIQUE(lecture_id, student_id)
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('lecture_start', 'attendance_reminder', 'system_alert', 'attendance_recorded')),
    read BOOLEAN DEFAULT false,
    data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics Table
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security Logs Table
CREATE TABLE security_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Backups Table
CREATE TABLE backups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
    backup_type TEXT NOT NULL CHECK (backup_type IN ('attendance', 'lectures', 'users', 'full')),
    file_path TEXT,
    file_size BIGINT,
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX idx_profiles_university_id ON profiles(university_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_device_bindings_user_id ON device_bindings(user_id);
CREATE INDEX idx_device_bindings_active ON device_bindings(user_id, is_active);
CREATE INDEX idx_lectures_professor_id ON lectures(professor_id);
CREATE INDEX idx_lectures_active ON lectures(is_active, start_time);
CREATE INDEX idx_attendance_lecture_id ON attendance(lecture_id);
CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_attendance_scanned_at ON attendance(scanned_at);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);
CREATE INDEX idx_analytics_university_id ON analytics(university_id);
CREATE INDEX idx_analytics_created_at ON analytics(created_at);
CREATE INDEX idx_security_logs_user_id ON security_logs(user_id);
CREATE INDEX idx_security_logs_created_at ON security_logs(created_at);
CREATE INDEX idx_backups_university_id ON backups(university_id);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_bindings ENABLE ROW LEVEL SECURITY;
ALTER TABLE lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE backups ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles: Users can see their own profile, admins can see all in their university
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles in university" ON profiles FOR SELECT USING (
    auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin' AND university_id = profiles.university_id
    )
);

-- Device Bindings: Users can only manage their own devices
CREATE POLICY "Users can manage own devices" ON device_bindings FOR ALL USING (auth.uid() = user_id);

-- Lectures: Professors can manage their lectures, students can view active lectures
CREATE POLICY "Professors can manage own lectures" ON lectures FOR ALL USING (auth.uid() = professor_id);
CREATE POLICY "Students can view active lectures" ON lectures FOR SELECT USING (
    auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'student' AND university_id = (SELECT university_id FROM profiles WHERE id = auth.uid())
    ) AND is_active = true
);

-- Attendance: Students can only see their own attendance, professors can see their lecture attendance
CREATE POLICY "Students can view own attendance" ON attendance FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Professors can view lecture attendance" ON attendance FOR SELECT USING (auth.uid() = professor_id);

-- Notifications: Users can only manage their own notifications
CREATE POLICY "Users can manage own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

-- Analytics: University-specific access
CREATE POLICY "University analytics access" ON analytics FOR SELECT USING (
    auth.uid() IN (
        SELECT id FROM profiles WHERE university_id = analytics.university_id AND role IN ('admin', 'professor')
    )
);

-- Security Logs: Admin-only access
CREATE POLICY "Admin security logs access" ON security_logs FOR SELECT USING (
    auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    )
);

-- Backups: University-specific access
CREATE POLICY "University backup access" ON backups FOR SELECT USING (
    auth.uid() IN (
        SELECT id FROM profiles WHERE university_id = backups.university_id AND role = 'admin'
    )
);

-- Functions and Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_universities_updated_at BEFORE UPDATE ON universities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lectures_updated_at BEFORE UPDATE ON lectures FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
    p_user_id UUID,
    p_event_type TEXT,
    p_event_data JSONB DEFAULT '{}',
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO security_logs (user_id, event_type, event_data, ip_address, user_agent)
    VALUES (p_user_id, p_event_type, p_event_data, p_ip_address, p_user_agent);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_title TEXT,
    p_message TEXT,
    p_type TEXT,
    p_data JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO notifications (user_id, title, message, type, data)
    VALUES (p_user_id, p_title, p_message, p_type, p_data)
    RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get lecture statistics
CREATE OR REPLACE FUNCTION get_lecture_stats(p_lecture_id UUID)
RETURNS JSONB AS $$
DECLARE
    total_students INTEGER;
    attended_students INTEGER;
    result JSONB;
BEGIN
    SELECT COUNT(*) INTO total_students
    FROM profiles p
    JOIN lectures l ON p.university_id = (SELECT university_id FROM profiles WHERE id = l.professor_id)
    WHERE l.id = p_lecture_id AND p.role = 'student';
    
    SELECT COUNT(*) INTO attended_students
    FROM attendance a
    WHERE a.lecture_id = p_lecture_id;
    
    result := jsonb_build_object(
        'total_students', total_students,
        'attended_students', attended_students,
        'attendance_rate', CASE 
            WHEN total_students > 0 THEN (attended_students::float / total_students::float) * 100 
            ELSE 0 
        END
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sample Data (for testing)
-- This should be removed in production
-- INSERT INTO universities (name, code) VALUES 
-- ('Test University', 'TEST001'),
-- ('Sample University', 'SAMPLE001');

-- Comments for documentation
COMMENT ON TABLE universities IS 'Universities/Institutions using the system';
COMMENT ON TABLE profiles IS 'User profiles extending auth.users';
COMMENT ON TABLE device_bindings IS 'Device fingerprinting for security';
COMMENT ON TABLE lectures IS 'Lecture/Schedule information';
COMMENT ON TABLE attendance IS 'Attendance records';
COMMENT ON TABLE notifications IS 'User notifications';
COMMENT ON TABLE analytics IS 'System analytics and events';
COMMENT ON TABLE security_logs IS 'Security and audit logs';
COMMENT ON TABLE backups IS 'System backup records';
