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
