// test-supabase.js
const { createClient } = require('@supabase/supabase-js');

// Substitua pelos seus dados reais
const supabaseUrl = 'https://rnejibduftiosvpxugwu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuZWppYmR1ZnRpb3N2cHh1Z3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNTUzMDQsImV4cCI6MjA3ODYzMTMwNH0.MelDkLzX3Kawz1oc4PRIx2mlAr1fxYS0NJAUXZ4KJCs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  console.log('🧪 Testando conexão com Supabase...');

  // Teste 1: Listar práticas terapêuticas
  console.log('\n📋 Testando leitura de práticas terapêuticas...');
  const { data: practices, error } = await supabase
    .from('therapeutic_practices')
    .select('*');

  if (error) {
    console.error('❌ Erro ao buscar práticas:', error.message);
  } else {
    console.log('✅ Práticas encontradas:', practices.length);
    practices.forEach(practice => {
      console.log(`  - ${practice.name}`);
    });
  }

  // Teste 2: Inserir nova prática
  console.log('\n➕ Testando inserção de nova prática...');
  const { data: newPractice, error: insertError } = await supabase
    .from('therapeutic_practices')
    .insert([
      {
        name: 'Teste de Conexão',
        description: 'Prática criada para testar a conexão com o banco'
      }
    ])
    .select();

  if (insertError) {
    console.error('❌ Erro ao inserir prática:', insertError.message);
  } else {
    console.log('✅ Prática inserida com sucesso:', newPractice[0].name);
  }

  // Teste 3: Autenticação (opcional)
  console.log('\n🔐 Testando autenticação...');
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError) {
    console.log('ℹ️  Nenhum usuário logado (isso é normal para testes)');
  } else {
    console.log('✅ Usuário autenticado:', user?.email || 'Sem email');
  }
}

// Executar teste
testSupabase();