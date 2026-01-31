# Configuração do Supabase

Este guia descreve como configurar o banco de dados no Supabase para o Sistema Terapêutico.

## 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Clique em **New Project**
3. Preencha nome, senha do banco e região
4. Aguarde a criação do projeto

## 2. Executar o schema SQL

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em **New Query**
3. Copie todo o conteúdo do arquivo `supabase/schema.sql`
4. Cole no editor e clique em **Run** (ou Ctrl+Enter)

O script cria:
- Tabelas: `psychologists`, `patients`, `therapeutic_practices`, `patient_practices`, `daily_entries`
- Práticas iniciais (5 exemplos)
- Políticas RLS (Row Level Security)

## 3. Configurar autenticação (opcional)

Para desenvolvimento, é comum desabilitar a confirmação de email:

1. Vá em **Authentication** → **Providers** → **Email**
2. Desative **Confirm email** se quiser login imediato após cadastro

## 4. Variáveis de ambiente

No projeto React, crie um arquivo `.env` (copie de `.env.example`):

```env
REACT_APP_SUPABASE_URL=https://seu-projeto.supabase.co
REACT_APP_SUPABASE_ANON_KEY=sua-chave-anonima
```

As credenciais estão em **Project Settings** → **API** no painel do Supabase.

## 5. Verificar conexão

Execute o script de teste:

```bash
node test-supabase.js
```

Se aparecer "✅ Práticas encontradas", a conexão está OK.

## Tabelas criadas

| Tabela | Descrição |
|--------|-----------|
| `psychologists` | Perfis de psicólogos (vinculado ao auth) |
| `patients` | Perfis de pacientes (vinculado ao auth) |
| `therapeutic_practices` | Práticas terapêuticas disponíveis |
| `patient_practices` | Relação paciente ↔ prática (N:N) |
| `daily_entries` | Registros diários de humor |

## RLS (Row Level Security)

As políticas garantem que:
- Psicólogos só veem e editam seus próprios pacientes
- Pacientes só veem e editam seus próprios dados
- Registros de humor são privados por paciente
