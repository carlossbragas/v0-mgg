-- MinhaGrana PWA Database Initialization Script

-- Create database if not exists (handled by Docker)
-- CREATE DATABASE IF NOT EXISTS minhagrana;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'member', 'child');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('add', 'remove', 'transfer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE device_type AS ENUM ('lighting', 'climate', 'security', 'appliance', 'sensor');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Families table
CREATE TABLE IF NOT EXISTS families (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    admin_email VARCHAR(255) NOT NULL UNIQUE,
    admin_password VARCHAR(255) NOT NULL,
    budget_monthly DECIMAL(10,2) DEFAULT 3000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT families_budget_positive CHECK (budget_monthly >= 0),
    CONSTRAINT families_email_format CHECK (admin_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Family members table
CREATE TABLE IF NOT EXISTS family_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    role user_role DEFAULT 'member',
    avatar_url TEXT,
    balance DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT family_members_balance_positive CHECK (balance >= 0),
    CONSTRAINT family_members_email_format CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT family_members_unique_email_per_family UNIQUE (family_id, email)
);

-- Wallet transactions table
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    member_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    from_member_id UUID REFERENCES family_members(id) ON DELETE SET NULL,
    to_member_id UUID REFERENCES family_members(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT wallet_transactions_amount_positive CHECK (amount > 0),
    CONSTRAINT wallet_transactions_transfer_members CHECK (
        (type = 'transfer' AND from_member_id IS NOT NULL AND to_member_id IS NOT NULL AND from_member_id != to_member_id) OR
        (type != 'transfer')
    )
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT expenses_amount_positive CHECK (amount > 0),
    CONSTRAINT expenses_date_not_future CHECK (date <= CURRENT_DATE)
);

-- IoT devices table
CREATE TABLE IF NOT EXISTS iot_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type device_type NOT NULL,
    room VARCHAR(100) NOT NULL,
    status BOOLEAN DEFAULT true,
    brightness INTEGER DEFAULT 100,
    temperature INTEGER DEFAULT 22,
    is_online BOOLEAN DEFAULT true,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT iot_devices_brightness_range CHECK (brightness >= 0 AND brightness <= 100),
    CONSTRAINT iot_devices_temperature_range CHECK (temperature >= 16 AND temperature <= 30),
    CONSTRAINT iot_devices_unique_name_per_family UNIQUE (family_id, name)
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES family_members(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    reward DECIMAL(10,2) DEFAULT 0.00,
    completed BOOLEAN DEFAULT false,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    
    CONSTRAINT tasks_reward_positive CHECK (reward >= 0),
    CONSTRAINT tasks_completed_at_logic CHECK (
        (completed = true AND completed_at IS NOT NULL) OR
        (completed = false AND completed_at IS NULL)
    )
);

-- Shopping list table
CREATE TABLE IF NOT EXISTS shopping_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    quantity INTEGER DEFAULT 1,
    estimated_price DECIMAL(10,2),
    purchased BOOLEAN DEFAULT false,
    purchased_by UUID REFERENCES family_members(id) ON DELETE SET NULL,
    purchased_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT shopping_items_quantity_positive CHECK (quantity > 0),
    CONSTRAINT shopping_items_price_positive CHECK (estimated_price IS NULL OR estimated_price >= 0),
    CONSTRAINT shopping_items_purchased_logic CHECK (
        (purchased = true AND purchased_by IS NOT NULL AND purchased_at IS NOT NULL) OR
        (purchased = false)
    )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_family_members_family_id ON family_members(family_id);
CREATE INDEX IF NOT EXISTS idx_family_members_email ON family_members(email) WHERE email IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_family_id ON wallet_transactions(family_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_member_id ON wallet_transactions(member_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at ON wallet_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_type ON wallet_transactions(type);

CREATE INDEX IF NOT EXISTS idx_expenses_family_id ON expenses(family_id);
CREATE INDEX IF NOT EXISTS idx_expenses_member_id ON expenses(member_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_iot_devices_family_id ON iot_devices(family_id);
CREATE INDEX IF NOT EXISTS idx_iot_devices_room ON iot_devices(room);
CREATE INDEX IF NOT EXISTS idx_iot_devices_type ON iot_devices(type);
CREATE INDEX IF NOT EXISTS idx_iot_devices_status ON iot_devices(status);

CREATE INDEX IF NOT EXISTS idx_tasks_family_id ON tasks(family_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

CREATE INDEX IF NOT EXISTS idx_shopping_items_family_id ON shopping_items(family_id);
CREATE INDEX IF NOT EXISTS idx_shopping_items_purchased ON shopping_items(purchased);
CREATE INDEX IF NOT EXISTS idx_shopping_items_category ON shopping_items(category);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_families_updated_at ON families;
CREATE TRIGGER update_families_updated_at 
    BEFORE UPDATE ON families 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_family_members_updated_at ON family_members;
CREATE TRIGGER update_family_members_updated_at 
    BEFORE UPDATE ON family_members 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_iot_devices_updated_at ON iot_devices;
CREATE TRIGGER update_iot_devices_updated_at 
    BEFORE UPDATE ON iot_devices 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to update last_seen on IoT devices
CREATE OR REPLACE FUNCTION update_iot_device_last_seen()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_online = true AND OLD.is_online = false THEN
        NEW.last_seen = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_iot_device_last_seen_trigger ON iot_devices;
CREATE TRIGGER update_iot_device_last_seen_trigger
    BEFORE UPDATE ON iot_devices
    FOR EACH ROW EXECUTE FUNCTION update_iot_device_last_seen();

-- Insert sample data for development (optional)
DO $$
BEGIN
    -- Only insert if no families exist
    IF NOT EXISTS (SELECT 1 FROM families LIMIT 1) THEN
        -- Insert sample family
        INSERT INTO families (id, name, admin_email, admin_password, budget_monthly) 
        VALUES (
            '550e8400-e29b-41d4-a716-446655440000',
            'Família Silva',
            'admin@silva.com',
            '$2b$12$LQv3c1yqBw2jo6H1PAmi/.WsCxaZKPDRfqfUNjKQrNG2ioMUBDlHu', -- password: admin123
            5000.00
        );
        
        -- Insert sample family members
        INSERT INTO family_members (family_id, name, email, role, balance) VALUES
        ('550e8400-e29b-41d4-a716-446655440000', 'João Silva', 'joao@silva.com', 'admin', 1500.00),
        ('550e8400-e29b-41d4-a716-446655440000', 'Maria Silva', 'maria@silva.com', 'member', 800.00),
        ('550e8400-e29b-41d4-a716-446655440000', 'Pedro Silva', NULL, 'child', 200.00),
        ('550e8400-e29b-41d4-a716-446655440000', 'Ana Silva', NULL, 'child', 150.00);
        
        RAISE NOTICE 'Sample data inserted successfully';
    END IF;
END $$;

-- Create views for reporting
CREATE OR REPLACE VIEW family_summary AS
SELECT 
    f.id,
    f.name,
    f.budget_monthly,
    COUNT(fm.id) as member_count,
    SUM(fm.balance) as total_balance,
    (SELECT COUNT(*) FROM expenses e WHERE e.family_id = f.id AND e.date >= DATE_TRUNC('month', CURRENT_DATE)) as monthly_expenses_count,
    (SELECT COALESCE(SUM(amount), 0) FROM expenses e WHERE e.family_id = f.id AND e.date >= DATE_TRUNC('month', CURRENT_DATE)) as monthly_expenses_total
FROM families f
LEFT JOIN family_members fm ON f.id = fm.family_id
GROUP BY f.id, f.name, f.budget_monthly;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO minhagrana_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO minhagrana_user;

-- Log completion
DO $$
BEGIN
    RAISE NOTICE 'MinhaGrana PWA database initialization completed successfully!';
    RAISE NOTICE 'Database version: %', version();
    RAISE NOTICE 'Tables created: %', (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public');
    RAISE NOTICE 'Indexes created: %', (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public');
END $$;
