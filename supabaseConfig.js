import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ccvfzxopmskzeegxucms.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjdmZ6eG9wbXNremVlZ3h1Y21zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc0NzEwNTgsImV4cCI6MjAyMzA0NzA1OH0.FmvWCFYbXEvSLGdNDQSoR-ioczkl7fKRiDSqgU-N-Rg';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
