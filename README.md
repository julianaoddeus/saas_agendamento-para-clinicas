# 🏥 Bootcamp - SaaS para Clínica Médica

## 📌 Objetivo

Desenvolver uma aplicação SaaS voltada para clínicas médicas, permitindo aos profissionais da saúde e suas equipes:

- Realizar **agendamentos de consultas** de forma rápida e intuitiva  
- Visualizar **gráficos de atendimentos** com dados analíticos para suporte à gestão  
- Integrar **sistemas de pagamento online**, facilitando cobranças e controle financeiro  

## 🚀 Funcionalidades previstas

- Autenticação de usuários com segurança 
- Cadastro de clínicas e profissionais da saúde  
- Cadastro e gerenciamento de pacientes  
- Agendamento com calendário inteligente  
- Dashboard com gráficos de atendimentos por período  
- Integração com gateways de pagamento  
- Painel administrativo com controle de permissões
- Área de planos

## 🛠️ Tecnologias Utilizadas

- **Next.js** — Framework React para desenvolvimento fullstack  
- **React** — Biblioteca JavaScript para construção da interface  
- **Typescript** — Superset do JavaScript com tipagem estática  
- **Shadcn/UI** — Componentes UI modernos, acessíveis e personalizáveis  
- **Node.js** — Ambiente de execução para o backend  
- **Drizzle ORM** — ORM moderno e tipado para bancos de dados relacionais  
- **PostgreSQL** — Banco de dados relacional robusto e escalável  
- **Vercel** — Plataforma para deploy contínuo e escalável
- **Tailwind CSS** — estilização de componetes
- **Zod** — validação de formulários
- **Better Auth** — autenticação de usuários

```
npm install -D prettier prettier-plugin-tailwindcss
npm i eslint-plugin-simple-import-sort@12.1.1 -D
npm i drizzle-orm@0.43.1 pg@8.15.6 
npm i -D drizzle-kit@0.31.1
npx drizzle-kit push
npx drizzle-kit studio
npx shadcn@2.5.0 init
```

## 📦 Estrutura do Projeto
    /src/app # Rotas e componentes de página do Next.js
    /src/components # Componentes reutilizáveis da UI
    /src/lib # Funções auxiliares e integrações
    /src/db # Schema e acesso ao banco de dados (Drizzle)
    /src/api # Rotas da API (Next.js)
    /src/actions # Server Actions para lógica de backend
    /src/helpers # Funções utilitárias e helpers
    /src/providers # Provedores de contexto e estado global
    /src/hooks # Hooks personalizados

## 🧪 Em breve...
- Suporte a múltiplas clínicas (multi-tenant)  
- Integração com sistemas de prontuário eletrônico  
- Sistema de notificações por e-mail e SMS  

## 🚧 Status do Projeto

> ⚙️ Em desenvolvimento — acompanhe os updates por aqui!

## 📍 Deploy

A aplicação será hospedada na **[Vercel](https://vercel.com/)** para garantir alta disponibilidade, escalabilidade automática e facilidade de integração contínua.


