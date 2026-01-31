import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar usuário logado
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  };

  const signUp = async (email, password, userData, userType) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (data?.user && !error) {
      // Salvar dados adicionais baseado no tipo de usuário
      const table = userType === 'psychologist' ? 'psychologists' : 'patients';
      const { error: insertError } = await supabase.from(table).insert([{
        id: data.user.id,
        ...userData
      }]);
      
      if (insertError) {
        return { data: null, error: { message: `Auth OK, mas falha ao salvar no banco: ${insertError.message}` } };
      }
    }
    
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return { user, loading, signIn, signUp, signOut };
};