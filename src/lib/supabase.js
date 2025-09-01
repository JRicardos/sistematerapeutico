import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Verifica se as variáveis de ambiente estão definidas 


if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or key is missing');
}
export const supabase = createClient(supabaseUrl, supabaseKey);

// Função para verificar autenticação
export const isAuthenticated = () => {
  return supabase.auth.user() !== null;
};