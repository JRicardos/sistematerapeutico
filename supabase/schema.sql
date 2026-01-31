-- ============================================
-- Schema do Sistema Terapêutico - Supabase
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- 1. Tabela de psicólogos (vinculada ao auth.users)
CREATE TABLE IF NOT EXISTS psychologists (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  crp TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de pacientes (vinculada ao auth.users)
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cpf TEXT,
  phone TEXT,
  psychologist_id UUID REFERENCES psychologists(id) ON DELETE SET NULL,
  contract TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de práticas terapêuticas
CREATE TABLE IF NOT EXISTS therapeutic_practices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela de relação paciente-práticas (N:N)
CREATE TABLE IF NOT EXISTS patient_practices (
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  practice_id UUID REFERENCES therapeutic_practices(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (patient_id, practice_id)
);

-- 5. Tabela de registros diários (humor)
CREATE TABLE IF NOT EXISTS daily_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  mood TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Inserir práticas iniciais (exemplo) - executar apenas uma vez
INSERT INTO therapeutic_practices (name, description) VALUES
  ('Respiração profunda', 'Técnicas de respiração para relaxamento'),
  ('Meditação guiada', 'Sessões de meditação com áudio'),
  ('Gratidão diária', 'Registro de momentos de gratidão'),
  ('Exercícios de mindfulness', 'Práticas de atenção plena'),
  ('Jornal de gratidão', 'Diário de gratidão')
ON CONFLICT (name) DO NOTHING;

-- 7. Habilitar RLS (Row Level Security)
ALTER TABLE psychologists ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapeutic_practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;

-- 8. Políticas para psychologists
CREATE POLICY "Usuários podem ver próprio perfil de psicólogo"
  ON psychologists FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Usuários podem inserir próprio perfil de psicólogo"
  ON psychologists FOR INSERT WITH CHECK (auth.uid() = id);

-- 9. Políticas para patients
CREATE POLICY "Psicólogos podem ver seus pacientes"
  ON patients FOR SELECT USING (
    psychologist_id = auth.uid() OR id = auth.uid()
  );
CREATE POLICY "Usuários podem inserir próprio perfil de paciente"
  ON patients FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Psicólogos podem atualizar seus pacientes"
  ON patients FOR UPDATE USING (psychologist_id = auth.uid());

-- 10. Políticas para therapeutic_practices (público para autenticados)
CREATE POLICY "Usuários autenticados podem ver práticas"
  ON therapeutic_practices FOR SELECT TO authenticated USING (true);
CREATE POLICY "Usuários autenticados podem inserir práticas"
  ON therapeutic_practices FOR INSERT TO authenticated WITH CHECK (true);

-- 11. Políticas para patient_practices
CREATE POLICY "Psicólogos e pacientes podem ver patient_practices"
  ON patient_practices FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM patients p 
      WHERE p.id = patient_id 
      AND (p.psychologist_id = auth.uid() OR p.id = auth.uid())
    )
  );
CREATE POLICY "Psicólogos podem atribuir práticas aos pacientes"
  ON patient_practices FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients p 
      WHERE p.id = patient_id AND p.psychologist_id = auth.uid()
    )
  );

-- 12. Políticas para daily_entries
CREATE POLICY "Pacientes podem ver próprios registros"
  ON daily_entries FOR SELECT USING (patient_id = auth.uid());
CREATE POLICY "Pacientes podem inserir próprios registros"
  ON daily_entries FOR INSERT WITH CHECK (patient_id = auth.uid());
CREATE POLICY "Psicólogos podem ver registros de seus pacientes"
  ON daily_entries FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM patients p 
      WHERE p.id = patient_id AND p.psychologist_id = auth.uid()
    )
  );
