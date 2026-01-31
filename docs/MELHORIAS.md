# Sugestões de Melhoria e Roadmap

Documento de acompanhamento de bugs, melhorias e evoluções do Sistema Terapêutico.

---

## Índice

1. [Bugs a Corrigir](#bugs-a-corrigir)
2. [Melhorias de Segurança](#melhorias-de-segurança)
3. [Melhorias de Funcionalidade](#melhorias-de-funcionalidade)
4. [Melhorias de UX/UI](#melhorias-de-uxui)
5. [Melhorias Técnicas](#melhorias-técnicas)
6. [Roadmap Sugerido](#roadmap-sugerido)

---

## Bugs a Corrigir

### 1. Cliente Supabase não exportado (`src/lib/supabase.js`)

**Problema:** O arquivo `src/lib/supabase.js` cria o cliente Supabase e executa `testSupabase()`, mas **não exporta** o `supabase`. As importações em `api.js` e `useAuth.js` (`import { supabase } from '../lib/supabase.js'`) podem falhar.

**Solução:** Separar o cliente do script de teste e garantir o export:

```javascript
// Manter apenas a criação e export do cliente
const supabase = createClient(supabaseUrl, supabaseKey);
export { supabase };
```

Mover o código de teste para `test-supabase.js` ou um script separado.

---

### 2. Login do Paciente sem formulário de email/senha (`Patient/Login.jsx`)

**Problema:** A tela "Área do Paciente" só oferece o botão "Entrar com meu Psicólogo", que redireciona para o cadastro. Não há formulário de login (email/senha) para pacientes que já possuem conta.

**Solução:** Adicionar formulário de email e senha na tela de login do paciente, similar ao `PsychologistLogin`, e usar `handlePatientLogin` do `App.jsx` para autenticar.

---

### 3. Cálculo incorreto de Sessões Ativas (`api.js`)

**Problema:** Em `getPsychologistDashboard`, a query de `activeSessions` usa `patient_id` com o valor de `psychologistId`:

```javascript
.eq('patient_id', psychologistId)  // ❌ Deveria buscar pacientes deste psicólogo
```

**Solução:** Contar pacientes do psicólogo que possuem ao menos uma prática atribuída. Exemplo:

```javascript
// Buscar patient_ids dos pacientes deste psicólogo
const { data: patients } = await supabase
  .from('patients')
  .select('id')
  .eq('psychologist_id', psychologistId);

const patientIds = patients?.map(p => p.id) || [];

// Contar patient_practices onde patient_id está na lista
const { count: activeSessions } = await supabase
  .from('patient_practices')
  .select('*', { count: 'exact', head: true })
  .in('patient_id', patientIds);
```

---

### 4. Humor médio estático (`api.js`)

**Problema:** O campo `averageMood` retorna valor fixo `7.2` (mock).

**Solução:** Calcular a média real a partir da tabela `daily_entries`, mapeando os valores de humor para números e agregando os pacientes vinculados ao psicólogo.

---

### 5. Bug no SignupScreen (`SignupScreen.jsx`)

**Problema:** O botão "Finalizar Cadastro" no step 3 tem:

```jsx
onClick={() => onNavigate("/src/components/LoginScreen.jsx")}
```

Isso passa um caminho de arquivo em vez de uma view. Deveria usar `onSubmit` do formulário e chamar `onSignup`, sem redirecionar manualmente para um caminho inválido.

---

## Melhorias de Segurança

### 6. Variáveis de ambiente para Supabase

**Problema:** URL e chave do Supabase estão hardcoded em `src/lib/supabase.js`. Isso expõe credenciais no repositório e impede uso de ambientes diferentes (dev/staging/prod).

**Solução:**
- Usar `process.env.REACT_APP_SUPABASE_URL` e `process.env.REACT_APP_SUPABASE_ANON_KEY`
- Criar `.env.example` com as chaves vazias como template
- Garantir que `.env` está no `.gitignore` (já está)

---

### 7. Row Level Security (RLS) no Supabase

**Recomendação:** Configurar políticas RLS nas tabelas para garantir que:
- Psicólogos só acessem seus próprios pacientes e dados
- Pacientes só acessem seus próprios registros e práticas

---

## Melhorias de Funcionalidade

### 8. Fluxo completo de cadastro de paciente pelo psicólogo

**Problema:** O botão "Novo Paciente" no dashboard do psicólogo não possui fluxo implementado.

**Solução:** Criar modal ou tela para o psicólogo cadastrar novo paciente (nome, CPF, telefone, email) e vincular ao seu `psychologist_id`. Usar `api.registerPatient` ou equivalente.

---

### 9. PatientDashboard usa práticas hardcoded

**Problema:** O `PatientDashboard` usa array fixo de práticas em vez de buscar do Supabase via `practices` (prop passada pelo App).

**Solução:** O App já passa `therapeuticPractices` como prop. Garantir que o `PatientDashboard` receba e use `practices` em vez do array local.

---

### 10. Fluxo de cadastro do paciente em etapas

**Problema:** O `PatientRegistrationStep2` pede "ID do Psicólogo" manualmente. O `onRegister` no App apenas faz `console.log` e redireciona para login — não persiste no Supabase.

**Solução:**
- Integrar com `signUp` + insert em `patients` (similar ao SignupScreen de paciente)
- Considerar lista de psicólogos ou busca por CRP em vez de ID manual

---

### 11. Atribuição de práticas ao paciente

**Problema:** O dashboard do psicólogo exibe práticas por paciente, mas o fluxo para atribuir/remover práticas pode não estar completo.

**Solução:** Verificar se `assignPracticeToPatient` e a remoção estão sendo chamados na UI (modais, botões) e se a lista de pacientes reflete os dados do Supabase.

---

## Melhorias de UX/UI

### 12. Feedback de erros

**Problema:** Erros são exibidos via `alert()`. Não há toasts ou mensagens inline consistentes.

**Solução:** Implementar componente de notificação (toast) e exibir erros de forma mais amigável.

---

### 13. Estados de loading

**Problema:** Durante chamadas à API (salvar registro, carregar dados), pode faltar indicador visual.

**Solução:** Usar estados de loading em botões e listas (skeleton, spinner) durante operações assíncronas.

---

### 14. Validação de formulários

**Problema:** Validação básica via `required` e comparação de senhas. Não há validação de CPF, CRP, email, etc.

**Solução:** Adicionar validação de CPF, formato de CRP, e feedback visual de campos inválidos.

---

## Melhorias Técnicas

### 15. Roteamento com React Router

**Problema:** O roteamento é feito via `currentView` e `switch` no `App.jsx`. URLs não refletem a tela atual.

**Solução:** Migrar para React Router para URLs como `/login`, `/paciente/dashboard`, `/psicologo/pacientes`, etc. Facilita compartilhamento de links e navegação.

---

### 16. Separação de lógica e apresentação

**Problema:** O `App.jsx` concentra bastante lógica (handlers, estado, efeitos).

**Solução:** Extrair lógica para hooks customizados ou context (ex.: `usePatientRegistration`, `usePsychologistData`) e deixar o App mais enxuto.

---

### 17. Tratamento de sessão expirada

**Problema:** Se o token Supabase expirar, o usuário pode continuar na tela sem conseguir fazer operações.

**Solução:** Usar o listener `onAuthStateChange` para redirecionar ao login quando a sessão for invalidada e exibir mensagem adequada.

---

## Roadmap Sugerido

### Fase 1 – Estabilização (prioridade alta)
1. Corrigir export do Supabase
2. Corrigir login do paciente (formulário email/senha)
3. Corrigir bug do SignupScreen (botão Finalizar Cadastro)
4. Corrigir cálculo de sessões ativas e humor médio

### Fase 2 – Segurança e dados
5. Migrar credenciais para variáveis de ambiente
6. Configurar RLS no Supabase
7. Conectar PatientDashboard às práticas reais

### Fase 3 – Funcionalidades
8. Fluxo completo de cadastro de paciente pelo psicólogo
9. Integrar cadastro do paciente em etapas ao Supabase
10. Atribuição e remoção de práticas na interface

### Fase 4 – Qualidade
11. React Router
12. Feedback de erros (toasts)
13. Estados de loading
14. Validação de formulários

---

*Documento atualizado conforme análise do código. Abra issues ou PRs para acompanhar o progresso de cada item.*
