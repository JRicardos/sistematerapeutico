import { supabase } from '../lib/supabase.js';

export const api = {
  // Autenticação
  loginPsychologist: async (email, password) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  },

  registerPatient: async (email, password, patientData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (data.user && !error) {
      await supabase.from('patients').insert([{
        id: data.user.id,
        ...patientData
      }]);
    }

    return { data, error };
  },

  // Dados do psicólogo
  getPsychologistDashboard: async (psychologistId) => {
    // Total de pacientes
    const { count: totalPatients } = await supabase
      .from('patients')
      .select('*', { count: 'exact' })
      .eq('psychologist_id', psychologistId);

    // Sessões ativas (pacientes com práticas)
    const { count: activeSessions } = await supabase
      .from('patient_practices')
      .select('*', { count: 'exact' })
      .eq('patient_id', psychologistId);

    return {
      totalPatients: totalPatients || 0,
      activeSessions: activeSessions || 0,
      averageMood: 7.2 // Mock - você pode calcular isso com dados reais
    };
  },

  getPsychologistPatients: async (psychologistId) => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('psychologist_id', psychologistId);
    
    return { data, error };
  },

  // Dados do paciente
  getPatientPractices: async (patientId) => {
    const { data, error } = await supabase
      .from('patient_practices')
      .select(`
        practice_id,
        therapeutic_practices(name)
      `)
      .eq('patient_id', patientId);
    
    return { 
      data: data ? data.map(item => item.therapeutic_practices.name) : [], 
      error 
    };
  },

  getTherapeuticPractices: async () => {
    const { data, error } = await supabase
      .from('therapeutic_practices')
      .select('*');
    
    return { data, error };
  },

  saveDailyEntry: async (entryData) => {
    const { data, error } = await supabase
      .from('daily_entries')
      .insert([entryData]);
    
    return { data, error };
  },

  // Gerenciamento de práticas
  addTherapeuticPractice: async (practiceData) => {
    const { data, error } = await supabase
      .from('therapeutic_practices')
      .insert([practiceData]);
    
    return { data, error };
  },

  assignPracticeToPatient: async (patientId, practiceId) => {
    const { data, error } = await supabase
      .from('patient_practices')
      .insert([{ patient_id: patientId, practice_id: practiceId }]);
    
    return { data, error };
  }
};