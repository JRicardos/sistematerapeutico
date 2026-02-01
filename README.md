# Sistema Terapêutico

Sistema web para acompanhamento terapêutico entre **psicólogos** e **pacientes**, permitindo gestão de práticas, registro de humor diário e visualização de dados do consultório.

---

## Índice

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Configuração](#configuração)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Modelo de Dados](#modelo-de-dados)
- [Deploy](#deploy)
- [Documentação Adicional](#documentação-adicional)

---

## Funcionalidades

### Público Geral
- Cadastro de **Psicólogo** (nome, email, CRP)
- Cadastro de **Paciente** (nome, email, CPF)
- Login por tipo de usuário

### Área do Psicólogo
- Dashboard com métricas (total de pacientes, sessões ativas, humor médio)
- Lista de pacientes com edição
- Gestão de práticas terapêuticas (criar, listar)
- Atribuição de práticas aos pacientes

### Área do Paciente
- Dashboard com humor diário
- Registro de humor (escala: excelente → péssimo)
- Descrição livre do dia
- Visualização das práticas atribuídas pelo psicólogo

---

## Tecnologias

| Stack | Tecnologia |
|-------|------------|
| Frontend | React 18, Tailwind CSS |
| Backend | Supabase (Auth + PostgreSQL) |
| Deploy | Vercel |

---

## Estrutura do Projeto

```
src/
├── App.jsx                 # Fluxo principal e roteamento
├── components/
│   ├── LoginScreen.jsx     # Tela de login (escolha de tipo)
│   ├── SignupScreen.jsx    # Cadastro em 3 etapas
│   ├── Patient/
│   │   ├── Dashboard.jsx   # Dashboard do paciente
│   │   ├── DailyEntry.jsx  # Registro de humor
│   │   ├── Login.jsx       # Área do paciente (antes do login)
│   │   ├── RegistrationStep1.jsx
│   │   └── RegistrationStep2.jsx
│   └── Psychologist/
│       ├── Dashboard.jsx   # Dashboard do psicólogo
│       ├── Login.jsx       # Login com email/senha
│       ├── PatientList.jsx # Componente de lista (parcialmente usado)
│       └── PracticeManagement.jsx # Gestão de práticas
├── hooks/
│   └── useAuth.js          # Autenticação Supabase
├── lib/
│   └── supabase.js         # Cliente Supabase
├── services/
│   └── api.js              # Chamadas à API
└── index.css               # Estilos globais
```

---

## Rodar em servidor local

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v16 ou superior)
- [npm](https://www.npmjs.com/) (incluído com o Node.js)

### Passos

1. **Instalar dependências**

   ```bash
   npm install
   ```

2. **(Opcional) Variáveis de ambiente**

   O projeto funciona com credenciais padrão. Para usar suas próprias:

   ```bash
   cp .env.example .env
   # Edite .env e preencha REACT_APP_SUPABASE_URL e REACT_APP_SUPABASE_ANON_KEY
   ```

3. **Iniciar o servidor de desenvolvimento**

   ```bash
   npm start
   ```

   A aplicação abre em **http://localhost:3000** no navegador.

---

## Configuração

### Variáveis de ambiente

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `REACT_APP_SUPABASE_URL` | URL do projeto Supabase | Não (usa fallback) |
| `REACT_APP_SUPABASE_ANON_KEY` | Chave anônima do Supabase | Não (usa fallback) |

Use `.env.example` como template. O arquivo `.env` não deve ser commitado (já está no `.gitignore`).

### Supabase

Configure no [Supabase](https://supabase.com) as tabelas necessárias. Veja [Modelo de Dados](#modelo-de-dados) abaixo.

---

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm test` | Executa testes |

---

## Modelo de Dados

### Tabelas principais

| Tabela | Descrição |
|--------|-----------|
| `psychologists` | Psicólogos (id, name, email, crp) |
| `patients` | Pacientes (id, name, cpf, phone, psychologist_id) |
| `therapeutic_practices` | Práticas (id, name, description) |
| `patient_practices` | Relação N:N paciente ↔ prática |
| `daily_entries` | Registros diários (patient_id, mood, date, description) |

### Supabase Auth

- Psicólogos e pacientes usam o mesmo sistema de auth (`auth.users`)
- Perfil adicional é salvo em `psychologists` ou `patients` conforme o tipo de usuário

---

## Deploy (Vercel)

O projeto está configurado para [Vercel](https://vercel.com):

1. Conecte o repositório em [vercel.com/new](https://vercel.com/new)
2. Configure as variáveis de ambiente:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
3. Deploy automático a cada push em `main`

📖 Guia completo: [docs/DEPLOY-VERCEL.md](docs/DEPLOY-VERCEL.md)

---

## Documentação Adicional

- [Deploy na Vercel](docs/DEPLOY-VERCEL.md)
- [Configuração do Supabase](docs/SUPABASE-SETUP.md)
- [Sugestões de melhoria e roadmap](docs/MELHORIAS.md)

---

## Licença

Projeto privado.
