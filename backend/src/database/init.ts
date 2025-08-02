import { pool } from "../config/database"

export async function initDatabase() {
  const client = await pool.connect()

  try {
    // Create tables
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      -- Families table
      CREATE TABLE IF NOT EXISTS families (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        admin_email VARCHAR(255) NOT NULL UNIQUE,
        admin_password VARCHAR(255) NOT NULL,
        budget_monthly DECIMAL(10,2) DEFAULT 3000.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      -- Family members table
      CREATE TABLE IF NOT EXISTS family_members (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        family_id UUID REFERENCES families(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        role VARCHAR(50) DEFAULT 'member',
        avatar_url TEXT,
        balance DECIMAL(10,2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      -- Wallet transactions table
      CREATE TABLE IF NOT EXISTS wallet_transactions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        family_id UUID REFERENCES families(id) ON DELETE CASCADE,
        member_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
        type VARCHAR(20) NOT NULL CHECK (type IN ('add', 'remove', 'transfer')),
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(100),
        description TEXT,
        from_member_id UUID REFERENCES family_members(id),
        to_member_id UUID REFERENCES family_members(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      -- Expenses table
      CREATE TABLE IF NOT EXISTS expenses (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        family_id UUID REFERENCES families(id) ON DELETE CASCADE,
        member_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      -- IoT devices table
      CREATE TABLE IF NOT EXISTS iot_devices (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        family_id UUID REFERENCES families(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        room VARCHAR(100) NOT NULL,
        status BOOLEAN DEFAULT true,
        brightness INTEGER DEFAULT 100 CHECK (brightness >= 0 AND brightness <= 100),
        temperature INTEGER DEFAULT 22 CHECK (temperature >= 16 AND temperature <= 30),
        is_online BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      -- Tasks table
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        family_id UUID REFERENCES families(id) ON DELETE CASCADE,
        assigned_to UUID REFERENCES family_members(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        reward DECIMAL(10,2) DEFAULT 0.00,
        completed BOOLEAN DEFAULT false,
        due_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      );
      
      -- Shopping list table
      CREATE TABLE IF NOT EXISTS shopping_items (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        family_id UUID REFERENCES families(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        quantity INTEGER DEFAULT 1,
        estimated_price DECIMAL(10,2),
        purchased BOOLEAN DEFAULT false,
        purchased_by UUID REFERENCES family_members(id),
        purchased_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_family_members_family_id ON family_members(family_id);
      CREATE INDEX IF NOT EXISTS idx_wallet_transactions_family_id ON wallet_transactions(family_id);
      CREATE INDEX IF NOT EXISTS idx_wallet_transactions_member_id ON wallet_transactions(member_id);
      CREATE INDEX IF NOT EXISTS idx_expenses_family_id ON expenses(family_id);
      CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
      CREATE INDEX IF NOT EXISTS idx_iot_devices_family_id ON iot_devices(family_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_family_id ON tasks(family_id);
      CREATE INDEX IF NOT EXISTS idx_shopping_items_family_id ON shopping_items(family_id);
      
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
      CREATE TRIGGER update_families_updated_at BEFORE UPDATE ON families FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      
      DROP TRIGGER IF EXISTS update_family_members_updated_at ON family_members;
      CREATE TRIGGER update_family_members_updated_at BEFORE UPDATE ON family_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      
      DROP TRIGGER IF EXISTS update_iot_devices_updated_at ON iot_devices;
      CREATE TRIGGER update_iot_devices_updated_at BEFORE UPDATE ON iot_devices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `)

    console.log("Database tables created successfully")
  } catch (error) {
    console.error("Error initializing database:", error)
    throw error
  } finally {
    client.release()
  }
}
