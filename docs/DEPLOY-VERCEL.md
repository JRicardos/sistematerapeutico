# Deploy no Vercel

Guia para fazer o deploy do Sistema Terapêutico na [Vercel](https://vercel.com).

## Pré-requisitos

- Conta na [Vercel](https://vercel.com)
- Projeto conectado ao GitHub
- Projeto Supabase configurado (tabelas criadas)

## Passo a passo

### 1. Conectar repositório

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe o repositório `JRicardos/sistematerapeutico`
3. A Vercel detecta automaticamente Create React App

### 2. Variáveis de ambiente

Em **Settings** → **Environment Variables**, adicione:

| Nome | Valor | Ambiente |
|------|-------|----------|
| `REACT_APP_SUPABASE_URL` | `https://seu-projeto.supabase.co` | Production, Preview, Development |
| `REACT_APP_SUPABASE_ANON_KEY` | `sua-chave-anonima` | Production, Preview, Development |

**Onde encontrar:**
- Supabase Dashboard → **Project Settings** → **API**
- Use a **Project URL** e a **anon public** key

> **Importante:** Sem essas variáveis, a aplicação usa valores fallback do código. Para produção, configure-as.

### 3. Deploy

1. Clique em **Deploy**
2. Aguarde o build (cerca de 1–2 minutos)
3. A URL será algo como `sistematerapeutico.vercel.app`

### 4. Build que falhou?

Se o build falhar por **ESLint** (warnings tratados como erros):
- Verifique se não há variáveis não usadas no código
- O projeto foi revisado para passar no build com `CI=true`

Se falhar por **dependências**:
- Execute `npm run build` localmente para reproduzir
- Confirme que `package.json` está correto

## Configuração (vercel.json)

O `vercel.json` inclui:
- **rewrites:** Todas as rotas vão para `index.html` (SPA)
- **headers:** Segurança (X-Content-Type-Options)
- **framework:** create-react-app
- **outputDirectory:** build

## Domínio personalizado

Em **Settings** → **Domains** você pode adicionar um domínio próprio.

## Preview (branches)

Cada push em uma branch gera um preview deploy com URL única, útil para testar antes de mergear.
