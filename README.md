# NeoWallet - Carteira Virtual

### Stack

- PHP
- Laravel
- PostgreSQL
- Docker
- React
- Typescript
- TailwindCSS
- Vite

### Pré-requisitos

- Docker
- Docker Compose

### Como executar

#### Clone o repositório:

```bash
git clone <url-do-repositorio>
cd neowallet
```

#### Suba os containers:

```bash
docker compose up --build
```

#### Após a inicialização:

| Serviço  | URL                                            |
| -------- | ---------------------------------------------- |
| Frontend | [http://localhost:5173](http://localhost:5173) |
| API      | [http://localhost:8000](http://localhost:8000) |

#### As migrations são executadas automaticamente na inicialização da API.

### Regras de negócio

- Cada usuário possui exatamente uma conta bancária.
- Cada conta pertence a apenas um usuário.
- Uma transferência movimenta valores entre duas contas.
- As transações ficam registradas no histórico das contas de origem e destino.
- O histórico de transações é paginado.
- O saldo da conta é calculado dinamicamente a partir das transações.

### Testes

O projeto possui testes de integração para garantir o funcionamento das principais regras de negócio da API.

Os testes cobrem:

- CRUD de usuários
- Transferências entre contas
- Atualização de saldo após transferências
- Histórico de transações
- Paginação de transações
- Validações de regras de negócio (saldo insuficiente, transferência para a própria conta e contas inexistentes)

Para executar os testes:

```bash
docker compose exec api php artisan test
```

ou

```bash
php artisan test
```
