// test-supabase.js
const { createClient } = require('@supabase/supabase-js');

// Substitua pelos seus dados reais
const supabaseUrl = 'https://feqlwovabgylbwnchfrn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZWQiLCJhdWQiOiJzdXBhYmFzZS1kZWQiLCJpYXQiOjE2MjMxNjAwMDAsImV4cCI6MTYyMzIwMjQwMCwibmJmIjoxNjIzMjAxMDAwLCJqdWlkIjoiY2MwMmRlMGQtMzY0My00ZWI1LWEwZDktMzBjYzA3OTZiZjUzIiwic2lkIjoiY2MwMmRlMGQtMzY0My00ZWI1LWEwZDktMzBjYzA3OTZiZjUzIiwidWlkIjoiY2MwMmRlMGQtMzY0My00ZWI1LWEwZDktMzBjYzA3OTZiZjUzIiwiaWF0IjoxNjIzMjAxMDAwLCJleHAiOjE2MjMyMDI0MDAsIm5iZiI6MTYyMzIwMTAwMCwicGFydGljaXRvciI6dHJ1ZX0.Dqo1f2tTn9Xb8Q6eZ3f7r6K4d8P5aB2cV9u6gR4t7h3s2m1n0j9i8h7g6f5e4d3c2b1a0';

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