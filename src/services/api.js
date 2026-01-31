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
      .select('*', { count: 'exact', head: true })
      .eq('psychologist_id', psychologistId);

    // IDs dos pacientes deste psicólogo
    const { data: patientsData } = await supabase
      .from('patients')
      .select('id')
      .eq('psychologist_id', psychologistId);
    const patientIds = patientsData?.map(p => p.id) || [];

    // Sessões ativas (pacientes com ao menos uma prática)
    let activeSessions = 0;
    if (patientIds.length > 0) {
      const { data: practicesData } = await supabase
        .from('patient_practices')
        .select('patient_id')
        .in('patient_id', patientIds);
      const uniquePatients = new Set(practicesData?.map(p => p.patient_id) || []);
      activeSessions = uniquePatients.size;
    }

    // Humor médio dos registros dos pacientes
    let averageMood = 0;
    if (patientIds.length > 0) {
      const moodMap = { excelente: 5, bom: 4, neutro: 3, ruim: 2, péssimo: 1 };
      const { data: entries } = await supabase
        .from('daily_entries')
        .select('mood')
        .in('patient_id', patientIds);
      if (entries && entries.length > 0) {
        const sum = entries.reduce((acc, e) => acc + (moodMap[e.mood] || 0), 0);
        averageMood = Math.round((sum / entries.length) * 10) / 10; // 1 casa decimal
      }
    }

    return {
      totalPatients: totalPatients || 0,
      activeSessions,
      averageMood: averageMood || 0
    };
  },

  getPsychologistPatients: async (psychologistId) => {
    const { data, error } = await supabase
      .from('patients')
      .select(`
        *,
        patient_practices(
          therapeutic_practices(name)
        )
      `)
      .eq('psychologist_id', psychologistId);
    
    if (data && !error) {
      data.forEach(p => {
        p.practices = (p.patient_practices || [])
          .map(pp => pp.therapeutic_practices?.name)
          .filter(Boolean);
        delete p.patient_practices;
      });
    }
    return { data, error };
  },

  // Dados do paciente
  getPatientPractices: async (patientId) => {
    const { data, error } = await supabase
      .from('patient_practices')
      .select(`
        therapeutic_practices(name)
      `)
      .eq('patient_id', patientId);
    
    const names = (data || [])
      .map(item => item.therapeutic_practices?.name)
      .filter(Boolean);
    return { data: names, error };
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