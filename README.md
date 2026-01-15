# 🧪 Teste Técnico – Plataforma de Gerenciamento de VMs

Este projeto foi desenvolvido como parte de um **desafio técnico** da **Vituax**, com foco em **backend (Node.js + Prisma)** e **frontend (React)**, contemplando autenticação, gerenciamento de VMs, cadastro de MSPs, perfil de usuário, testes automatizados e documentação da API.

---

## 📋 Configuração Inicial

### Backend

- Criado arquivo `.env` a partir do `.env.example`
- Configuração de variáveis de ambiente para:
  - Banco de dados
  - JWT
  - Porta da API

### Frontend

- Criado arquivo `.env` a partir do `.env.example`
- Configuração das variáveis para consumo da API

---

## 🔐 Autenticação e Autorização

### Backend

- Implementadas rotas de **CRUD de usuários**
- Implementada rota de **login**
- Implementada rota de **register**
- Autenticação via **JWT**
- Middleware de proteção de rotas (`authUser`)
- Apenas rotas públicas:
  - `/login`
  - `/register`

### Frontend

- Tela de **login** (`/login`)
- Tela de **register** (`/register`)
- Persistência do token do usuário logado
- Proteção de rotas para que apenas usuários autenticados tenham acesso

### Usuários de Teste

Credenciais de teste podem ser encontradas em:

- `.env.example`

---

## 🗄️ Atualizações no Banco de Dados (Prisma)

Foram realizadas alterações no schema do banco de dados para atender aos requisitos do desafio:

### VM

- Adicionada coluna `pass` (senha da VM, respeitando regras de segurança)
- Adicionada coluna `location` do tipo `ETaskLocation`
- Adicionada coluna `hasBackup` (boolean)

As migrations foram criadas e versionadas utilizando **Prisma Migrate**.

---

## 🏠 Funcionalidades da Home Page

### VM Card List

- Implementada função de **start da VM**
- Implementada função de **pause da VM**
- Gráficos **mocados** de:
  - Uso de CPU
  - Uso de Memória

---

## ➕ Criação de VM

- Dropdown para seleção de **sistemas operacionais**
- Implementação correta da criação de uma VM
- Possibilidade de aceitar configurações vindas dos **cards de sugestão**

---

## 💾 Gerenciamento de VMs (My VMs)

### Filtros

- Filtro de pesquisa (busca por nome)
- Filtro por status da VM
- Filtro por MSP / BrandMaster
- Filtro **“Apenas minhas VMs”** (VMs exclusivas da mesma BrandMaster do usuário logado)

### Ações

- Start/Stop da VM diretamente pela tabela
- Start/Stop da VM via modal de edição

### Modal de Edição

- Carregamento correto das informações da VM
- Possibilidade de editar:
  - Senha da VM
  - Nome da VM
  - vCPU
  - Memória
  - Disco
  - Habilitar/desabilitar backup

### Exclusão

- Exclusão de VM permitida **somente para usuários do tipo admin**

---

## 🏢 Cadastro de MSP (BrandMaster)

Funcionalidades implementadas:

- Componente de cadastro de MSP em **2 etapas**
- Criação de novo MSP
- Edição de MSP existente
- Campos de endereço (manual ou via CEP/CNPJ)
- Filtro de busca
- Flag **“Mostrar somente os que estão em POC”**

---

## 👤 Configuração de Perfil e Notificações

- Edição das informações de contato do usuário
- Edição da senha do usuário

---

## 🧪 Testes Automatizados

### Backend

Foram implementados testes automatizados utilizando **Vitest** e **Supertest**:

- ✅ **Testes unitários**
- ✅ **Testes de integração**
- ⚠️ **Testes E2E**
  - Estrutura preparada
  - Não implementados no frontend neste momento

Para executar os testes do backend:

```bash
npm test
```

---

## 📄 Documentação Swagger

- Implementada documentação da API utilizando **Swagger**
- A documentação pode ser acessada através da rota:

```
http://localhost:3001/docs
```

---

## 🚀 Como Executar o Projeto

### Backend

```bash
npm install
npm run dev
```

### Frontend

```bash
npm install
npm run dev
```

### Banco de dados

```bash
npm run db:up
```

---
