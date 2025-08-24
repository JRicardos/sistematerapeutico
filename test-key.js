// test-key.js
const { createClient } = require('@supabase/supabase-js');

// Substitua pela sua URL e chave corretas
const supabaseUrl = 'https://feqlwovabgylbwnchfrn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlcWx3b3ZhYmd5bGJ3bmNoZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5ODgwODIsImV4cCI6MjA3MTU2NDA4Mn0.fgaBevavCUNkIHxWlNxZTPbDZAW7o-6XYr2-vTLRkdU'; // Cole aqui

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
  console.log('🧪 Testando operações completas do Supabase...\n');

  // 1. Criar usuário de teste (se não existir)
  console.log('👤 1. Criando usuário de teste...');
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: 'teste@admin.com',
    password: 'senha123456'
  });

  if (authError && !authError.message.includes('already registered')) {
    console.log('❌ Erro na autenticação:', authError.message);
  } else {
    console.log('✅ Usuário criado ou já existente');
  }

  // 2. Fazer login (CORRIGIDO)
  console.log('🔐 2. Fazendo login...');
  const { data, error: loginError } = await supabase.auth.signInWithPassword({
    email: 'teste@admin.com',
    password: 'senha123456'
  });

  // CORRIGIDO: Acesso correto ao usuário
  const user = data?.user;
  
  if (loginError) {
    console.log('❌ Erro no login:', loginError.message);
    return;
  }

  console.log('✅ Usuário logado:', user?.email);

  // 3. Testar inserção com usuário autenticado
  console.log('\n➕ 3. Inserindo prática terapêutica...');
  const { data: newPractice, error: insertError } = await supabase
    .from('therapeutic_practices')
    .insert([
      {
        name: 'Teste com Autenticação',
        description: 'Prática inserida com usuário autenticado'
      }
    ])
    .select();

  if (insertError) {
    console.log('❌ Erro na inserção:', insertError.message);
  } else {
    console.log('✅ Prática inserida com sucesso!');
    console.log('   ID:', newPractice[0].id);
    console.log('   Nome:', newPractice[0].name);
  }

  // 4. Listar todas as práticas
  console.log('\n📋 4. Listando todas as práticas...');
  const { data: allPractices, error: listError } = await supabase
    .from('therapeutic_practices')
    .select('*');

  if (listError) {
    console.log('❌ Erro na listagem:', listError.message);
  } else {
    console.log(`✅ Total de práticas: ${allPractices.length}`);
    allPractices.forEach((practice, index) => {
      console.log(`   ${index + 1}. ${practice.name}`);
    });
  }

  console.log('\n🎉 Testes concluídos!');
}

// Executar testes
testDatabase();