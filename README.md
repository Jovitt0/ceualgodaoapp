# Céu Algodão App

Plataforma de e-commerce mobile com autenticação, gerenciamento de produtos e checkout rápido.

## Funcionalidades

### Para Clientes
- Login/Cadastro com autenticação
- Visualização de produtos do fornecedor
- Checkout rápido e simplificado
- Histórico de pedidos
- Design responsivo para mobile

### Para Fornecedor
- Dashboard com estatísticas
- Gerenciamento de produtos (criar, editar, deletar)
- Visualização de pedidos em tempo real
- Atualização de status de pedidos
- Controle de estoque

## Tecnologias

- **Frontend**: React 19, TypeScript, TailwindCSS 4, Wouter
- **Backend**: Express 4, tRPC 11, Node.js
- **Banco de Dados**: MySQL/TiDB com Drizzle ORM
- **Autenticação**: Manus OAuth
- **Testes**: Vitest

## Instalação

### Pré-requisitos
- Node.js 22+
- pnpm 10+
- Variáveis de ambiente configuradas

### Passos

1. Clone o repositório:
```bash
git clone https://github.com/Jovitt0/ceualgodaoapp.git
cd ceualgodaoapp
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure o banco de dados:
```bash
pnpm db:push
```

4. Inicie o servidor de desenvolvimento:
```bash
pnpm dev
```

O aplicativo estará disponível em `http://localhost:3000`

## Estrutura do Projeto

```
client/
  src/
    pages/          # Páginas da aplicação
    components/     # Componentes reutilizáveis
    lib/trpc.ts     # Cliente tRPC
    App.tsx         # Rotas principais
drizzle/
  schema.ts         # Schema do banco de dados
server/
  routers.ts        # Procedures tRPC
  db.ts             # Funções de banco de dados
  routers.test.ts   # Testes unitários
```

## Rotas Principais

### Cliente
- `/` - Página inicial
- `/cliente/login` - Login do cliente
- `/cliente/produtos` - Listagem de produtos
- `/cliente/checkout/:produtoId` - Checkout rápido

### Fornecedor
- `/fornecedor/login` - Login do fornecedor
- `/fornecedor/dashboard` - Dashboard de gerenciamento

## Testes

Execute os testes com:
```bash
pnpm test
```

## Variáveis de Ambiente

As seguintes variáveis são automaticamente injetadas:
- `DATABASE_URL` - Conexão com o banco de dados
- `JWT_SECRET` - Chave para assinar cookies de sessão
- `VITE_APP_ID` - ID da aplicação OAuth
- `OAUTH_SERVER_URL` - URL do servidor OAuth
- `VITE_OAUTH_PORTAL_URL` - URL do portal de login

## Desenvolvimento

### Adicionar nova página
1. Crie o arquivo em `client/src/pages/NomePagina.tsx`
2. Adicione a rota em `client/src/App.tsx`

### Adicionar novo endpoint
1. Crie a função em `server/db.ts`
2. Adicione o procedure em `server/routers.ts`
3. Use `trpc.feature.useQuery/useMutation` no frontend

### Atualizar schema do banco
1. Edite `drizzle/schema.ts`
2. Execute `pnpm db:push`

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT.

## Suporte

Para suporte, abra uma issue no repositório GitHub.
