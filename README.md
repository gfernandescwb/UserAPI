# UserApi

Este é um projeto ASP.NET Core que utiliza Entity Framework Core com MySQL. O projeto inclui uma API de autenticação e gerenciamento de usuários. O banco de dados MySQL é gerenciado usando Docker Compose.

## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

- [.NET SDK](https://dotnet.microsoft.com/download) (versão 6.0 ou superior - Usada 8.0)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Configuração do Projeto

### 1. Clone o repositório

Clone este repositório em sua máquina local:

```bash
git clone https://github.com/gfernandescwb/UserAPI.git
cd UserApi
```

### 2. Configure as variáveis de ambiente

> Embora não seja uma boa prática, o arquivo `.env` está junto no projeto, por se tratar de um teste.

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente:

```env
# JWT Token
JWT_KEY=aGq1R2J5oTp8Dq5L7xWmQ9cUkYh3Fs6N
JWT_ISSUER=UserApiIssuer
JWT_AUDIENCE=userApiAudience
JWT_EXPIRE_MINUTES=60

# DB settings
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=user_management
DB_USER=user
DB_PASSWORD=password
MYSQL_ROOT_PASSWORD=root_password
```

- **DB_HOST**: O host do banco de dados (normalmente `localhost` para ambientes locais).
- **DB_PORT**: A porta do banco de dados MySQL (padrão é `3306`).
- **DB_DATABASE**: O nome do banco de dados.
- **DB_USER**: O usuário do banco de dados.
- **DB_PASSWORD**: A senha do banco de dados.
- **JWT_KEY**: Chave secreta para geração de tokens JWT.
- **JWT_ISSUER**: Issuer para tokens JWT.
- **JWT_AUDIENCE**: Audience para tokens JWT.
- **JWT_EXPIRE_MINUTES**: Tempo de expiração dos tokens JWT em minutos.

### 3. Configure o Docker Compose

O projeto utiliza Docker Compose para gerenciar o banco de dados MySQL. O arquivo `docker-compose.yml` já está configurado para rodar um container MySQL.

### 4. Inicie o banco de dados

Inicie o banco de dados MySQL usando Docker Compose:

```bash
docker-compose up -d
```

Isso irá iniciar um container MySQL em segundo plano. Certifique-se de que o banco de dados esteja rodando corretamente:

```bash
docker-compose ps
```

### 5. Instale as ferramentas locais do .NET

O projeto utiliza `dotnet-ef` como uma ferramenta local para gerenciar as migrations do Entity Framework Core. Instale a ferramenta:

```bash
dotnet tool restore
```

### 6. Aplique as migrations

Após configurar o banco de dados e as ferramentas, aplique as migrations para criar as tabelas necessárias no banco de dados:

```bash
dotnet ef database update
```

### 7. Execute o projeto

Finalmente, execute o projeto:

```bash
dotnet run
```

A API estará disponível em `https://localhost:5133/swagger`.

### 8. Teste a API

Você pode testar a API usando Swager ou mais opções abaixo.

[Swagger](https://localhost:5133/swagger)

Você pode testar a API usando uma ferramenta como [Postman](https://www.postman.com/) ou [curl](https://curl.se/). Por exemplo, para registrar um novo usuário, envie uma requisição POST para:

```
POST https://localhost:5133/api/auth/register
Content-Type: application/json

{
    "username": "testuser",
    "password": "testpassword",
    "email": "testuser@example.com",
    "firstname": "Test",
    "lastname": "User"
}
```

```
POST https://localhost:5133/api/auth/login
Content-Type: application/json

{
    "email": "testuser@example.com",
    "password": "testpassword"
}
```

```
POST https://localhost:5133/api/auth/logout
Content-Type: application/json
```

### 9. Parar os containers do Docker

Após terminar de usar o projeto, você pode parar os containers do Docker:

```bash
docker-compose down
```

Isso irá parar e remover os containers do MySQL criados pelo Docker Compose.

## Frontend

O frontend do projeto está localizado no diretório `/Views`.

### Dependências

Antes de rodar o projeto, certifique-se de ter as seguintes dependências instaladas:

- **[Node.js](https://nodejs.org/)**: Plataforma JavaScript para desenvolvimento.
- **[NPM](https://www.npmjs.com/)**: Gerenciador de pacotes do Node.js.
- **[Next.js](https://nextjs.org/)**: Framework React para desenvolvimento de aplicações web.
- **[Tailwind CSS](https://tailwindcss.com/)**: Framework de CSS utilitário para estilização.
- **[React Icons](https://react-icons.github.io/react-icons/)**: Biblioteca de ícones para React.

### Instalação das Dependências

Para instalar todas as dependências do projeto, execute o seguinte comando na raiz do diretório:

```bash
npm install
```

### Executando o Projeto

Para iniciar o servidor de desenvolvimento e rodar o projeto localmente, utilize o comando:

```bash
npm run dev
```

Isso iniciará o servidor em modo de desenvolvimento. Normalmente, você pode acessar o projeto no navegador através de `http://localhost:3000`.

## Banco de dados

### Criar tabelas

``` sql
-- Tabela de usuários
CREATE TABLE `Users` (
  `Id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `Account` INTEGER,
  `ActiveMsg` ENUM ('BLOCKED', 'DELETED', 'ACTIVE'),
  `ActiveStatus` BOOLEAN,
  FOREIGN KEY (`Account`) REFERENCES `Accounts` (`Id`)
);

-- Tabela para as informações dos usuários
CREATE TABLE `Accounts` (
  `Id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `Firstname` LONGTEXT,
  `Lastname` LONGTEXT,
  `Username` LONGTEXT,
  `Email` LONGTEXT,
  `Password` LONGTEXT
);

-- Tabela com os últimos logins e tentativas
CREATE TABLE `Signins` (
  `Id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `Email` LONGTEXT,
  `AccessDate` DATETIME(6),
  `AccessMsg` ENUM ('SUCCEED', 'PASSWORD', 'EMAIL', 'SERVICE'),
  `AccessStatus` TINYINT(1),
  `UserId` INTEGER,
  FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`)
);
```

### Adicionar novo usuario e login

``` sql
-- Inserir um novo registro na tabela 'account'
INSERT INTO Accounts (Firstname, Lastname, Username, Email, Password)
VALUES ('Jane', 'Doe', 'janedoe', 'jane.doe@example.com', 'hashed_password');

-- Obter o ID da conta recém-criada
SET @account_id = LAST_INSERT_ID();

-- Inserir um novo registro na tabela 'users' usando o ID da conta
INSERT INTO Users (Id, ActiveMsg, ActiveStatus)
VALUES (@account_id, 'ACTIVE', true);  -- Usa `@account_id` para associar a conta ao usuário

-- Inserir uma operação de login para o novo usuário (exemplo de simulação de login)
INSERT INTO Signins (Email, AccessDate, AccessMsg, AccessStatus, UserId)
VALUES ('jane.doe@example.com', NOW(), 'SUCCEED', true, @account_id);

-- Verificar os logins atualizados
SELECT * FROM Signins;
```

### Acessos nas ultimas 2h

``` sql
-- Selecionar logins realizados e tentativas nas últimas duas horas
SELECT *
FROM Signins
JOIN Users ON Users.Id = Signins.UserId
JOIN Accounts ON Accounts.Id = Users.Account
WHERE Signins.AccessDate >= NOW() - INTERVAL 2 HOUR;
```

## Notas

- Se precisar rodar novamente as migrations ou modificar o banco de dados, use os comandos do `dotnet ef` descritos acima.
- Certifique-se de que as variáveis de ambiente no arquivo `.env` estejam corretas e seguras.
