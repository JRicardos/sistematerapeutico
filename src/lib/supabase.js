import { createClient } from '@supabase/supabase-js'


const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY


if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or key is missing');
}
export const supabase = createClient(supabaseUrl, supabaseKey);

// Função para verificar autenticação
export const isAuthenticated = () => {
  return supabase.auth.user() !== null;
};