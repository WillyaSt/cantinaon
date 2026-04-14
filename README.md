<p align="center">
  <img alt="CantinaOn Logo" src="./logo.svg" width="160" />
</p>

<p align="center">
  <img alt="CantinaOn Header" src="https://capsule-render.vercel.app/api?type=waving&height=220&color=0:21C45D,100:308CE8&text=CantinaOn&fontColor=FAFAFA&fontSize=56&fontAlignY=40&desc=Gest%C3%A3o%20inteligente%20de%20cantina%20escolar&descAlignY=62&descSize=18" />
</p>

# CantinaOn

O **CantinaOn** é uma plataforma SaaS desenvolvida para digitalizar a operação de cantinas escolares, permitindo pedidos antecipados, pagamento simplificado e retirada organizada. A proposta do sistema é conectar alunos, responsáveis, equipe da cantina e gestão escolar em um fluxo único, com foco em segurança alimentar, controle parental, previsibilidade de estoque e eficiência no atendimento.

Na prática, o sistema substitui processos manuais por uma base centralizada de dados, facilitando o controle de cardápio, pedidos, pagamentos, estoque e operação diária da cantina.

---

## 🛠️ Stack base

- **Frontend:** React
- **Backend:** Node.js + Express
- **Banco de Dados:** PostgreSQL

---

## 🏗️ Arquitetura do Sistema

O **CantinaOn** segue uma arquitetura **cliente-servidor em camadas**, em que o frontend consome uma API REST no backend, e o backend centraliza as regras de negócio e a comunicação com o banco de dados.

### Visão geral da arquitetura

- o **frontend** é responsável pela interface e interação com o usuário;
- o **backend** expõe os endpoints da aplicação, valida dados e aplica as regras de negócio;
- o **PostgreSQL** atua como fonte principal de persistência;
- integrações externas, como **Mercado Pago** e o frontend **canteen-express**, se conectam ao backend.

### Diagrama de arquitetura

```mermaid
flowchart LR
    U[Usuarios<br/>alunos, responsaveis, staff e gestao]
    F[Frontend React]
    B[Backend Node.js + Express<br/>API REST]
    DB[(PostgreSQL)]
    MP[Mercado Pago<br/>integracao prevista]
    CE[Frontend externo<br/>canteen-express]

    U --> F
    F -->|HTTP/JSON| B
    CE -->|HTTP/JSON| B
    B -->|SQL| DB
    B -->|checkout/webhook| MP
```

### Responsabilidade de cada camada

#### Frontend
O frontend é responsável por exibir o cardápio, autenticar usuários, permitir criação de pedidos, consultar pedidos já realizados e interagir com funcionalidades como carteira, fluxo parental e operação.

#### Backend
O backend concentra a lógica principal do sistema. Ele recebe requisições do frontend, valida autenticação, consulta o banco, processa pedidos, controla pagamento, estoque e regras operacionais, além de expor os endpoints usados na aplicação.

#### Banco de Dados
O PostgreSQL armazena usuários, produtos, alérgenos, pedidos, pagamentos, carteira, vínculos parentais e demais informações persistentes do sistema. No estado atual do projeto, ele também é parte central do fluxo de autenticação.

#### Integrações externas
O sistema já prevê integração com serviços externos, principalmente:
- **Mercado Pago**, para checkout e webhook de pagamentos;
- **canteen-express**, como frontend/protótipo externo em integração incremental com o backend atual.

### Fluxo resumido de uma compra

1. o usuário acessa o frontend;
2. o frontend envia a requisição para o backend;
3. o backend consulta o cardápio e os dados no PostgreSQL;
4. o usuário cria um pedido;
5. o backend registra o pedido e reserva estoque;
6. o pagamento é processado;
7. após confirmação, o sistema gera o código de retirada;
8. a equipe da cantina confirma a retirada no fluxo operacional.

---

## 📁 Conteúdo inicial deste repositório

- [`docs/cantinaon-spec.md`](docs/cantinaon-spec.md): especificação funcional e técnica consolidada.
- [`database/schema.sql`](database/schema.sql): modelo inicial relacional em PostgreSQL.
- [`database/seed.sql`](database/seed.sql): massa de dados para desenvolvimento local.
- [`docs/api-draft.md`](docs/api-draft.md): rascunho de endpoints REST para o MVP.
- [`docs/canteen-express-integration-plan.md`](docs/canteen-express-integration-plan.md): plano inicial de integração do frontend externo `canteen-express` com este backend.

---

## 🚀 Backend MVP

Foi adicionado um backend inicial em `backend/` com **Express** e **PostgreSQL** como banco padrão, cobrindo os endpoints principais do rascunho.

### Endpoints principais

#### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`

#### Cardápio e catálogo
- `GET /menu/today`
- `GET /products/:id`
- `GET /allergens`

#### Pedidos
- `POST /orders`
- `GET /orders/:id`
- `GET /orders/my`
- `POST /orders/:id/cancel`

#### Pagamento
- `POST /payments/checkout`
- `POST /payments/webhooks/mercadopago`
- `POST /wallet/pay`

#### Operação
- `GET /ops/online-status`

#### Funcionário
- `GET /staff/orders/paid`
- `POST /staff/orders/:id/confirm-pickup`

#### Controle parental
- `GET /parental/...`

#### Carteira
- `GET /wallet/students/...`

### Regras centrais de negócio

O backend já considera regras importantes do domínio:

- reserva atômica e devolução de estoque em cancelamento ou expiração;
- timeout de pagamento de **8 minutos** com expiração automática;
- geração de código de retirada de **4 dígitos** após pagamento;
- recálculo de estoque online por regra **FIXO** ou **PERCENTUAL**.

---

## 👥 Usuários e autenticação

Como o fluxo de autenticação está **100% em PostgreSQL**, não existe fallback local para login.

Crie usuários usando `POST /auth/register` antes de autenticar com `POST /auth/login`.

Para resetar os dados em ambiente local, execute o seed do banco:

```bash
psql "postgresql://postgres:postgres@localhost:5432/cantinaon" -f database/seed.sql
```

O `seed.sql` usa `TRUNCATE ... RESTART IDENTITY CASCADE` e recria uma massa completa de simulação com usuários, produtos, estoque, alérgenos, carteira, vínculos parentais e pedidos.

### Credenciais padrão do seed

| Perfil | E-mail | Senha |
|---|---|---|
| Admin | `admin@cantinaon.local` | `admin123` |
| Staff | `staff@cantinaon.local` | `staff123` |
| Responsável | `maria.resp@cantinaon.local` | `resp123` |
| Aluno | `joao.aluno@cantinaon.local` | `aluno123` |
| Aluna | `ana.aluna@cantinaon.local` | `aluno123` |

---

## 🗄️ Banco de Dados

Esta seção foi escrita para que qualquer pessoa — desenvolvedor, professor, colega de equipe ou alguém sem perfil técnico — consiga entender **como os dados do sistema são organizados e por que isso importa**.

### Explicação didática

Uma forma simples de entender o banco de dados do **CantinaOn** é imaginar a cantina funcionando no dia a dia:

- **usuários** representam as pessoas que usam o sistema;
- **produtos** representam os itens vendidos;
- **pedidos** representam as compras realizadas;
- **pagamentos** registram a confirmação financeira;
- **carteira** guarda saldo do usuário;
- **vínculos parentais** ligam responsáveis aos estudantes;
- **alérgenos** ajudam no controle de restrições alimentares.

Ou seja, o banco funciona como a **memória organizada da cantina**. Ele registra quem comprou, o que foi comprado, como foi pago e quais regras precisam ser respeitadas pelo sistema.

### Exemplo prático

Imagine este fluxo:

1. um aluno acessa o sistema;
2. consulta o cardápio do dia;
3. escolhe um salgado e um suco;
4. o pedido é criado;
5. o sistema reserva o estoque;
6. o pagamento é confirmado;
7. um código de retirada é gerado.

O banco de dados é o responsável por manter cada parte desse processo conectada e consistente.

---

## 📦 Scripts de banco de dados

Os scripts atuais do banco estão versionados em `database/`:

```bash
database/
├── schema.sql
└── seed.sql
```

### Ordem de execução

1. `database/schema.sql`  
   Cria a estrutura do banco de dados.

2. `database/seed.sql`  
   Popula o banco com dados de simulação para desenvolvimento.

Mesmo no MVP atual com poucos arquivos, os scripts já estão:
- versionados;
- organizados;
- com ordem definida;
- preparados para reprodução em ambiente limpo.

---

## 📌 Pré-requisitos

Antes de implantar o banco de dados, garanta que a máquina tenha:

- **PostgreSQL 15+**
- comando `psql` disponível
- **Node.js**
- **npm**
- acesso ao repositório clonado localmente

---

## 🛠️ Guia de implantação do banco de dados

### 1. Criar o banco local

Abra o PostgreSQL:

```bash
psql -U postgres
```

Depois execute:

```sql
CREATE DATABASE cantinaon;
```

Saia com:

```sql
\q
```

### 2. Criar a estrutura do banco

```bash
psql "postgresql://postgres:postgres@localhost:5432/cantinaon" -f database/schema.sql
```

### 3. Popular com dados de desenvolvimento

```bash
psql "postgresql://postgres:postgres@localhost:5432/cantinaon" -f database/seed.sql
```

### 4. Configurar a conexão do backend

Crie um arquivo `backend/.env` com:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cantinaon
```

---

## ✅ Validação pós-implantação

Depois da carga do banco, valide com os comandos abaixo.

### Verificar se as tabelas foram criadas

```bash
psql "postgresql://postgres:postgres@localhost:5432/cantinaon" -c "\dt"
```

### Verificar quantidade de tabelas públicas

```bash
psql "postgresql://postgres:postgres@localhost:5432/cantinaon" -c "SELECT COUNT(*) AS total_tabelas FROM information_schema.tables WHERE table_schema = 'public';"
```

### Verificar se o backend enxerga o banco

Depois de subir a aplicação, teste:

- `GET /health`

Se a configuração estiver correta, o endpoint deve retornar status de conexão com o banco.

### Validar autenticação com seed

Teste login com uma das credenciais padrão, por exemplo:

- `admin@cantinaon.local` / `admin123`

---

## ↩️ Rollback / limpeza

Se for necessário resetar tudo em ambiente local, execute:

```bash
psql "postgresql://postgres:postgres@localhost:5432/cantinaon" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
psql "postgresql://postgres:postgres@localhost:5432/cantinaon" -f database/schema.sql
psql "postgresql://postgres:postgres@localhost:5432/cantinaon" -f database/seed.sql
```

> **Atenção:** esse procedimento apaga os dados do ambiente local. Use apenas em desenvolvimento ou teste.

---

## ▶️ Como executar

### Backend

```bash
cd backend
npm i
npm run dev
```

### Frontend

Em outro terminal:

```bash
cd frontend
npm i
npm run dev
```

---

## 🔌 PostgreSQL no backend

O backend depende de PostgreSQL como configuração padrão de execução.

### Variável obrigatória

- `DATABASE_URL`: string de conexão PostgreSQL usada na inicialização do pool.

### Endpoints já ligados ao PostgreSQL

- `POST /auth/register`
- `POST /auth/login`
- `GET /menu/today`
- `GET /products/:id`
- `GET /allergens`
- `GET /health`

---

## 🔄 Fluxo disponível no estado atual do MVP

Atualmente, o sistema já permite:

- login com `POST /auth/login`;
- consulta de cardápio com `GET /menu/today`;
- criação de pedido com `POST /orders`.

### Limitação atual

- o pagamento por carteira com `POST /wallet/pay` **ainda não está funcional no estado atual**.

---

## 🧭 Plano de integração com o protótipo do front `canteen-express`

Foi adicionada uma trilha inicial em [`docs/canteen-express-integration-plan.md`](docs/canteen-express-integration-plan.md) com:

- fases de execução por fluxo;
- checklist de kickoff técnico;
- riscos e mitigação para integração incremental;
- evolução entre discovery, MVP, operação de staff e recursos avançados.

---

## 📌 Próximos passos recomendados

1. integrar Mercado Pago real com checkout e webhook assinado;
2. criar suíte de testes automatizados da API;
3. ampliar cobertura das regras de negócio;
4. detalhar melhor os contratos de integração com o frontend;
5. evoluir os scripts SQL para migrações mais granulares à medida que o projeto crescer.

---

## 📚 Documentação complementar

- [Especificação funcional e técnica](docs/cantinaon-spec.md)
- [Rascunho da API](docs/api-draft.md)
- [Plano de integração do frontend](docs/canteen-express-integration-plan.md)
- [Schema do banco](database/schema.sql)
- [Seed local](database/seed.sql)
