import { createClient } from '@supabase/supabase-js';

// src/lib/supabase.js
console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
console.log('Supabase Key:', process.env.REACT_APP_SUPABASE_ANON_KEY ? '✓ Configurada' : '❌ Não encontrada');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função para verificar autenticação
export const isAuthenticated = () => {
  return supabase.auth.user() !== null;
};