import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://rnejibduftiosvpxugwu.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuZWppYmR1ZnRpb3N2cHh1Z3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNTUzMDQsImV4cCI6MjA3ODYzMTMwNH0.MelDkLzX3Kawz1oc4PRIx2mlAr1fxYS0NJAUXZ4KJCs';

export const supabase = createClient(supabaseUrl, supabaseKey);
