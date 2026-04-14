<p align="center">
  <img alt="CantinaOn Logo" src="./logo.svg" width="160" />
</p>

<p align="center">
  <img alt="CantinaOn Header" src="https://capsule-render.vercel.app/api?type=waving&height=220&color=0:21C45D,100:308CE8&text=CantinaOn&fontColor=FAFAFA&fontSize=56&fontAlignY=40&desc=Gest%C3%A3o%20inteligente%20de%20cantina%20escolar&descAlignY=62&descSize=18" />
</p>

# CantinaOn

O **CantinaOn** é uma plataforma para digitalizar a rotina de cantinas escolares, permitindo pedidos antecipados, pagamento simplificado e retirada organizada. A proposta é conectar alunos, responsáveis, equipe da cantina e gestão escolar em um fluxo único, com foco em previsibilidade, controle e eficiência no atendimento.

Na prática, o sistema substitui controles manuais por uma base centralizada de dados, facilitando o acompanhamento de cardápio, pedidos, pagamentos, estoque e vínculos parentais.

---

## 🛠️ Stack base

- **Frontend:** React
- **Backend:** Node.js + Express
- **Banco de Dados:** PostgreSQL

---

## 🏗️ Arquitetura do Sistema

A arquitetura de software é a organização fundamental do sistema: ela define seus componentes, os relacionamentos entre eles e as diretrizes que orientam sua evolução e implantação. Em outras palavras, funciona como o “plano de construção” da aplicação, mostrando como cada parte se conecta para atender às necessidades do negócio.

No **CantinaOn**, a arquitetura segue o estilo **cliente-servidor em camadas**, separando interface, processamento das regras de negócio e persistência de dados. Essa divisão facilita a manutenção, os testes, a evolução do código e também o deployment, pois cada parte pode ser configurada e publicada com responsabilidades bem definidas.

### Componentes principais

- **Camada de apresentação (Frontend):** aplicação web em **React + Vite**, responsável pelas telas, rotas, contexts e interação com o usuário.
- **Camada de aplicação (Backend):** API em **Node.js + Express**, responsável por autenticação, validação, regras de negócio e exposição dos endpoints REST.
- **Camada de domínio/serviços:** concentra fluxos centrais como pedidos, estoque, carteira e confirmação de retirada.
- **Camada de persistência:** repositórios e acesso a dados usados para consultar e gravar informações no PostgreSQL.
- **Banco de dados:** armazena usuários, produtos, pedidos, pagamentos, vínculos parentais, carteira e demais entidades do sistema.

### Relação entre as camadas

O fluxo principal do sistema acontece da seguinte forma:

1. o usuário acessa a aplicação pelo navegador;
2. o frontend renderiza a interface e envia requisições para a API;
3. o backend recebe a requisição, valida autenticação e regras de acesso;
4. os services processam a lógica de negócio;
5. os repositories executam leitura e escrita no PostgreSQL;
6. a resposta retorna ao frontend e é exibida para o usuário.

### Representação visual da arquitetura

```mermaid
flowchart TB
    subgraph CLIENTE["Camada de Apresentação"]
        U["Usuário<br/>Aluno, Responsável, Staff, Gestão"]
        FE["Frontend Web<br/>React + Vite"]
        UI["Telas, Rotas e Contexts"]
        U --> FE
        FE --> UI
    end

    subgraph APP["Camada de Aplicação"]
        API["API REST<br/>Node.js + Express"]
        AUTH["Autenticação e Autorização"]
        CTRL["Controllers / Rotas"]
        API --> AUTH
        API --> CTRL
    end

    subgraph DOM["Camada de Domínio / Serviços"]
        SRV["Services / Regras de Negócio"]
        PED["Pedidos"]
        EST["Estoque"]
        WAL["Carteira"]
        RET["Confirmação de Retirada"]
        PAR["Controle Parental"]

        CTRL --> SRV
        SRV --> PED
        SRV --> EST
        SRV --> WAL
        SRV --> RET
        SRV --> PAR
    end

    subgraph PERS["Camada de Persistência"]
        REPO["Repositories / Acesso a Dados"]
        SRV --> REPO
    end

    subgraph DATA["Banco de Dados"]
        DB[("PostgreSQL")]
        ENT["Usuários<br/>Produtos<br/>Pedidos<br/>Pagamentos<br/>Vínculos Parentais<br/>Carteira"]
        REPO --> DB
        DB --> ENT
    end

    subgraph EXT["Integrações Externas"]
        MP["Mercado Pago"]
        CE["canteen-express<br/>Frontend / Protótipo externo"]
    end

    FE -->|"HTTP / JSON"| API
    CE -->|"HTTP / JSON"| API
    API -->|"Checkout / Webhook"| MP
```

### Como essa arquitetura ajuda no deployment

Essa arquitetura é importante para a implantação porque deixa claro o que precisa ser publicado, configurado e monitorado:

- o **frontend** pode ser publicado separadamente como aplicação web estática;
- o **backend** precisa estar em execução como serviço Node.js, expondo a API HTTP;
- o **PostgreSQL** deve estar disponível antes da API, pois o backend depende da variável `DATABASE_URL` para conectar ao banco;
- em desenvolvimento, o frontend pode usar proxy `/api` para encaminhar chamadas ao backend em `localhost:3000`;
- em produção, a mesma separação permite trocar host, porta e variáveis de ambiente sem alterar a regra de negócio.

### Resumo arquitetural

Em termos simples, o **CantinaOn** possui uma arquitetura organizada em três grandes blocos:

- **Frontend:** interface e experiência do usuário;
- **Backend:** processamento das regras do sistema;
- **Banco de dados:** armazenamento persistente das informações.

Essa organização torna o sistema mais compreensível, facilita a evolução do projeto e cria uma base adequada para crescimento futuro.

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
- [`database/seed.sql`](database/seed.sql): massa de dados local para simulação do MVP.
- [`docs/api-draft.md`](docs/api-draft.md): rascunho de endpoints REST para o MVP.
- [`docs/canteen-express-integration-plan.md`](docs/canteen-express-integration-plan.md): plano inicial de integração do frontend externo `canteen-express` com este backend.

---

## 🚀 Backend MVP

Foi adicionado um backend inicial em `backend/` com **Express** e **PostgreSQL** como banco padrão, cobrindo os principais endpoints do rascunho:

- **Auth**
  - `POST /auth/register`
  - `POST /auth/login`
  - `POST /auth/refresh`

- **Cardápio e catálogo**
  - `GET /menu/today`
  - `GET /products/:id`
  - `GET /allergens`

- **Pedidos**
  - `POST /orders`
  - `GET /orders/:id`
  - `GET /orders/my`
  - `POST /orders/:id/cancel`

- **Pagamento**
  - `POST /payments/checkout`
  - `POST /payments/webhooks/mercadopago`
  - `POST /wallet/pay`

- **Operação**
  - `GET /ops/online-status`

- **Funcionário**
  - `GET /staff/orders/paid`
  - `POST /staff/orders/:id/confirm-pickup`

- **Controle parental**
  - `GET /parental/...`

- **Carteira**
  - `GET /wallet/students/...`

### Regras centrais de negócio já consideradas

- reserva atômica e devolução de estoque em cancelamento ou expiração;
- timeout de pagamento de **8 minutos** com expiração automática;
- geração de código de retirada de **4 dígitos** após pagamento;
- função de recálculo de estoque online por regra **FIXO** ou **PERCENTUAL**.

---

## 👥 Usuários e autenticação

Como o fluxo de autenticação está **100% em PostgreSQL**, não existe fallback local para login.

Crie usuários usando `POST /auth/register` antes de autenticar com `POST /auth/login`.

Para resetar os dados do ambiente local, execute:

```bash
psql "postgresql://cantinaon:cantinaon123@localhost:5432/cantinaon" -f database/seed.sql
```

O `seed.sql` usa `TRUNCATE ... RESTART IDENTITY CASCADE` e recria uma massa de simulação com usuários, produtos, estoque, alérgenos, carteira, vínculos parentais e pedidos.

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

Esta seção foi escrita para que qualquer pessoa — desenvolvedor, professor, colega de equipe ou alguém sem perfil técnico — consiga entender **como os dados são organizados e por quê**.

### 💡 Explicação didática

Uma forma simples de entender o banco de dados do **CantinaOn** é pensar na cantina como um espaço físico:

- **users** representam as pessoas que usam o sistema;
- **products** representam os itens do cardápio;
- **orders** funcionam como a comanda principal da compra;
- **order_items** representam cada linha da comanda;
- **payments** registram a confirmação financeira;
- **wallets** guardam saldo de carteira;
- **parental_links** ligam responsáveis e estudantes;
- **allergens** ajudam a sinalizar restrições alimentares.

Ou seja: o banco funciona como a **memória organizada da cantina**.  
Ele registra quem comprou, o que foi comprado, como foi pago e quais regras de negócio precisam ser respeitadas.

### 🧠 Exemplo prático

Imagine o seguinte cenário:

1. um aluno entra no sistema;
2. consulta o cardápio do dia;
3. escolhe um salgado e um suco;
4. o pedido é criado;
5. os itens do pedido são registrados;
6. o estoque é reservado;
7. o pagamento é concluído;
8. um código de retirada é gerado.

No banco, isso significa:

- a pessoa já existe em **users**;
- a compra vira um registro em **orders**;
- cada item entra em **order_items**;
- o pagamento fica em **payments**;
- o saldo pode passar por **wallets**;
- o estoque é ajustado conforme a regra de negócio.

### 🧩 DER conceitual do MVP

O esquema físico completo está em [`database/schema.sql`](database/schema.sql).  
O diagrama abaixo resume a lógica principal do domínio de forma legível dentro do próprio GitHub:

```mermaid
erDiagram
    USERS {
        int id PK
        string name
        string email
        string password_hash
        string role
        datetime created_at
    }

    PRODUCTS {
        int id PK
        string name
        string description
        decimal price
        boolean active
        int stock
        datetime created_at
    }

    ALLERGENS {
        int id PK
        string name
    }

    PRODUCT_ALLERGENS {
        int product_id FK
        int allergen_id FK
    }

    ORDERS {
        int id PK
        int user_id FK
        string status
        decimal total_amount
        string pickup_code
        datetime created_at
        datetime expires_at
    }

    ORDER_ITEMS {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal unit_price
        decimal subtotal
    }

    PAYMENTS {
        int id PK
        int order_id FK
        string method
        string status
        decimal amount
        datetime created_at
    }

    WALLETS {
        int id PK
        int user_id FK
        decimal balance
        datetime updated_at
    }

    PARENTAL_LINKS {
        int id PK
        int parent_user_id FK
        int student_user_id FK
        datetime created_at
    }

    USERS ||--o{ ORDERS : places
    ORDERS ||--|{ ORDER_ITEMS : contains
    PRODUCTS ||--o{ ORDER_ITEMS : composes
    ORDERS ||--o| PAYMENTS : generates
    USERS ||--o| WALLETS : owns
    PRODUCTS ||--o{ PRODUCT_ALLERGENS : maps
    ALLERGENS ||--o{ PRODUCT_ALLERGENS : classifies
    USERS ||--o{ PARENTAL_LINKS : parent
    USERS ||--o{ PARENTAL_LINKS : student
```

### 🔎 Leitura rápida do DER

- um **usuário** pode fazer vários **pedidos**;
- um **pedido** pode ter vários **itens**;
- cada **item** referencia um **produto**;
- um **pedido** pode gerar um **pagamento**;
- um **usuário** pode ter **carteira**;
- um **produto** pode possuir vários **alérgenos**;
- um **responsável** pode estar ligado a um ou mais **alunos**.

---

## 📦 Scripts de banco e ordem de execução

Os scripts do banco ficam em `database/` e estão versionados no Git.

```bash
database/
├── schema.sql
└── seed.sql
```

### Ordem oficial de execução

1. `database/schema.sql`  
   Cria a estrutura relacional do projeto.

2. `database/seed.sql`  
   Opcional para ambiente local de desenvolvimento e demonstração.

### Observação

Mesmo no MVP atual usando poucos arquivos, o processo está padronizado e reproduzível porque:

- os scripts estão versionados no repositório;
- a ordem de execução está definida;
- existe validação pós-implantação;
- existe procedimento de rollback.

---

## 📌 Pré-requisitos

Antes de implantar o banco de dados do zero, garanta que a máquina tenha:

- **PostgreSQL 15+**
- comando `psql` disponível no terminal
- **Node.js** e **npm**
- acesso ao repositório clonado localmente

---

## 🛠️ Guia de implantação do banco de dados

A partir da raiz do projeto, siga exatamente esta sequência.

### 1. Criar usuário e banco no PostgreSQL

Abra o PostgreSQL com um usuário administrador:

```bash
psql -U postgres
```

Depois execute:

```sql
CREATE ROLE cantinaon WITH LOGIN PASSWORD 'cantinaon123';
CREATE DATABASE cantinaon OWNER cantinaon;
GRANT ALL PRIVILEGES ON DATABASE cantinaon TO cantinaon;
```

Saia com:

```sql
\q
```

### 2. Configurar a conexão do backend

Crie o arquivo `backend/.env` com o conteúdo abaixo:

```env
DATABASE_URL=postgresql://cantinaon:cantinaon123@localhost:5432/cantinaon
```

### 3. Criar a estrutura do banco

Execute o schema:

```bash
psql "postgresql://cantinaon:cantinaon123@localhost:5432/cantinaon" -f database/schema.sql
```

### 4. Popular o banco com dados de simulação

Para ambiente local, carregue o seed:

```bash
psql "postgresql://cantinaon:cantinaon123@localhost:5432/cantinaon" -f database/seed.sql
```

### 5. Confirmar se a implantação funcionou

Liste as tabelas criadas:

```bash
psql "postgresql://cantinaon:cantinaon123@localhost:5432/cantinaon" -c "\dt"
```

---

## ✅ Validação pós-implantação

Depois da carga do banco, valide com os comandos abaixo.

### Verificar tabelas existentes

```bash
psql "postgresql://cantinaon:cantinaon123@localhost:5432/cantinaon" -c "\dt"
```

### Verificar quantidade de tabelas públicas

```bash
psql "postgresql://cantinaon:cantinaon123@localhost:5432/cantinaon" -c "SELECT COUNT(*) AS total_tabelas FROM information_schema.tables WHERE table_schema = 'public';"
```

### Verificar chaves estrangeiras

```bash
psql "postgresql://cantinaon:cantinaon123@localhost:5432/cantinaon" -c "SELECT tc.table_name, kcu.column_name, ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name FROM information_schema.table_constraints AS tc JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name WHERE tc.constraint_type = 'FOREIGN KEY';"
```

### Validar seed e autenticação

1. execute o backend;
2. confirme que o endpoint `GET /health` retorna o status do banco;
3. teste login com uma das credenciais padrão do seed.

---

## ↩️ Rollback / limpeza do ambiente

Se for necessário zerar o ambiente local e reimplantar tudo do zero, use um dos procedimentos abaixo.

### Opção 1: limpar o schema atual

```bash
psql "postgresql://cantinaon:cantinaon123@localhost:5432/cantinaon" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
psql "postgresql://cantinaon:cantinaon123@localhost:5432/cantinaon" -f database/schema.sql
psql "postgresql://cantinaon:cantinaon123@localhost:5432/cantinaon" -f database/seed.sql
```

### Opção 2: recriar o banco por completo

```bash
psql -U postgres -d postgres -c "DROP DATABASE IF EXISTS cantinaon;"
psql -U postgres -d postgres -c "DROP ROLE IF EXISTS cantinaon;"
psql -U postgres -d postgres -c "CREATE ROLE cantinaon WITH LOGIN PASSWORD 'cantinaon123';"
psql -U postgres -d postgres -c "CREATE DATABASE cantinaon OWNER cantinaon;"
psql -U postgres -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE cantinaon TO cantinaon;"
psql "postgresql://cantinaon:cantinaon123@localhost:5432/cantinaon" -f database/schema.sql
psql "postgresql://cantinaon:cantinaon123@localhost:5432/cantinaon" -f database/seed.sql
```

> **Atenção:** os procedimentos acima removem dados locais. Use apenas em ambiente de desenvolvimento ou teste.

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

- login com `POST /auth/login`;
- consulta de cardápio com `GET /menu/today`;
- criação de pedido com `POST /orders`;
- pagamento por carteira com `POST /wallet/pay` **ainda não está funcional no estado atual**.

---

## 🧭 Plano de integração com o protótipo do front `canteen-express`

Foi adicionada uma trilha inicial em [`docs/canteen-express-integration-plan.md`](docs/canteen-express-integration-plan.md) com:

- fases de execução por fluxo;
- checklist de kickoff técnico;
- riscos e mitigação para integração incremental;
- visão de evolução entre discovery, MVP, operação de staff e recursos avançados.

---

## 📌 Próximos passos recomendados

1. integrar Mercado Pago real com checkout e webhook assinado;
2. criar suíte de testes automatizados da API;
3. ampliar cobertura de regras de negócio e casos de borda;
4. detalhar contratos de integração com o frontend;
5. evoluir os scripts SQL para migrações granulares conforme o projeto crescer.

---

## ✅ Checklist desta atividade

- [x] O README contém introdução clara e não técnica do projeto
- [x] A seção de BD usa linguagem didática, exemplos e analogias
- [x] O DER está legível e referenciado no próprio README
- [x] O guia de implantação é reproduzível do zero em máquina limpa
- [x] Os scripts de BD estão versionados e com ordem de execução definida
- [x] Há validação pós-implantação
- [x] Há procedimento de rollback
- [x] A formatação Markdown está consistente
- [x] A arquitetura do sistema foi documentada
- [x] A arquitetura possui representação visual
- [x] Os links internos do README estão organizados

---

## 📚 Documentação complementar

- [Especificação funcional e técnica](docs/cantinaon-spec.md)
- [Rascunho da API](docs/api-draft.md)
- [Plano de integração do frontend](docs/canteen-express-integration-plan.md)
- [Schema do banco](database/schema.sql)
- [Seed local](database/seed.sql)
