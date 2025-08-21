const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const migrationPath = path.join(__dirname, 'migrate-purchases-userid.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  const statements = sql.split(';').filter(stmt => stmt.trim() !== '');

  for (const statement of statements) {
    const { error } = await supabase.rpc('execute_sql', { sql_statement: statement });
    if (error) {
      console.error('Error executing statement:', error);
      return;
    }
  }

  console.log('Migration completed successfully.');
}

runMigration();