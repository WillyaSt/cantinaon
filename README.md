<p align="center">
  <img alt="CantinaOn Logo" src="./logo.svg" width="160" />
</p>

# CantinaOn
<p align="center">
  <img alt="CantinaOn Header" src="https://capsule-render.vercel.app/api?type=waving&height=220&color=0:21C45D,100:308CE8&text=CantinaOn&fontColor=FAFAFA&fontSize=56&fontAlignY=40&desc=Gest%C3%A3o%20inteligente%20de%20cantina%20escolar&descAlignY=62&descSize=18" />
</p>

## Visão Geral
CantinaOn é um sistema SaaS (Software as a service) desenvolvido para digitalizar a operação de cantinas escolares, permitindo pedidos antecipados, pagamento simplificado e retirada organizada. A plataforma conecta alunos, responsáveis, equipe da cantina e gestão escolar em um fluxo único, com foco em segurança alimentar, controle parental, previsibilidade de estoque e eficiência no atendimento.
## Stack base
- **Frontend:** React
- **Backend:** Node.js
- **Banco:** PostgreSQL

## Conteúdo inicial deste repositório
- `docs/cantinaon-spec.md`: especificação funcional e técnica consolidada.
- `database/schema.sql`: modelo inicial relacional em PostgreSQL.
- `docs/api-draft.md`: rascunho de endpoints REST para o MVP.
- `docs/canteen-express-integration-plan.md`: plano inicial de integração do frontend externo `canteen-express` com este backend.

## Backend MVP
Foi adicionado um backend inicial em `backend/` com Express e PostgreSQL como banco padrão, cobrindo os endpoints principais do rascunho:
- Auth (`/auth/register`, `/auth/login`, `/auth/refresh`)
- Cardápio e catálogo (`/menu/today`, `/products/:id`, `/allergens`)
- Pedidos (`/orders`, `/orders/:id`, `/orders/my`, `/orders/:id/cancel`)
- Pagamento (`/payments/checkout`, `/payments/webhooks/mercadopago`, `/wallet/pay`)
- Operação (`/ops/online-status`)
- Funcionário (`/staff/orders/paid`, `/staff/orders/:id/confirm-pickup`)
- Controle parental (`/parental/...`)
- Carteira (`/wallet/students/...`)

Também inclui regras centrais de negócio para:
- Reserva atômica e devolução de estoque em cancelamento/expiração.
- Timeout de pagamento (8 minutos) com expiração automática.
- Geração de código de retirada de 4 dígitos após pagamento.
- Função de recálculo de estoque online por regra FIXO ou PERCENTUAL.

### Usuários
Como o fluxo de autenticação está 100% em PostgreSQL, não há fallback local para login.
Crie usuários usando `POST /auth/register` antes de autenticar com `POST /auth/login`.

Para resetar dados em ambiente local, execute `database/seed.sql`.
Esse seed usa `TRUNCATE ... RESTART IDENTITY CASCADE` e recria uma massa completa de simulação (usuários, produtos, estoque, alérgenos, carteira, vínculos parentais e pedidos).
Credenciais padrão (com senha armazenada em bcrypt):
- `admin@cantinaon.local` / `admin123`
- `staff@cantinaon.local` / `staff123`
- `maria.resp@cantinaon.local` / `resp123`
- `joao.aluno@cantinaon.local` / `aluno123`
- `ana.aluna@cantinaon.local` / `aluno123`


## PostgreSQL
O backend depende de PostgreSQL como configuração padrão de execução.

Variáveis obrigatórias:
- `DATABASE_URL`: string de conexão PostgreSQL usada na inicialização do pool.

Endpoints já ligados ao PostgreSQL:
- `POST /auth/register`
- `POST /auth/login`
- `GET /menu/today`
- `GET /products/:id`
- `GET /allergens`
- `GET /health` (retorna status do banco)

### Como executar
```bash
cd backend
npm i
npm run dev
```
Em outro terminal:
```bash
cd frontend
npm i
npm run dev
```

### Fluxo disponível
- Login (`/auth/login`)
- Consulta de cardápio (`/menu/today`)
- Criação de pedido (`/orders`)
- Pagamento por carteira (`/wallet/pay`) NAO ESTA FUNCIONANDO


## Plano de integração com prototipo do front `canteen-express`
Foi adicionada uma trilha inicial em `docs/canteen-express-integration-plan.md` com:
- fases de execução por fluxo (discovery, MVP, staff e avançados);
- checklist de kickoff técnico;
- riscos e mitigação para integração incremental.

## Próximos passos recomendados
1. Integrar Mercado Pago real (checkout + webhook assinado).
2. Criar suíte de testes automatizados de API.
