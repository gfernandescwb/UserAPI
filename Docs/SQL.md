# Banco de dados

## Criar tabelas

``` sql
-- Tabela de usuários
CREATE TABLE `Users` (
  `Id` integer PRIMARY KEY,
  `Account` integer,
  `ActiveMsg` ENUM ('BLOCKED', 'DELETED', 'ACTIVE'),
  `ActiveStatus` bool
);

-- Tabela para as informações dos usuários
CREATE TABLE `Account` (
  `Id` integer PRIMARY KEY,
  `Firstname` varchar(255),
  `Lastname` varchar(255),
  `Username` varchar(255),
  `Email` varchar(255),
  `Password` varchar(255)
);

-- Tabela com as últimos logins e tentativas
CREATE TABLE `Signins` (
  `Id` integer PRIMARY KEY,
  `Email` varchar(255),
  `AccessDate` datetime,
  `AccessMsg` ENUM ('SUCCEED', 'PASSWORD', 'EMAIL', 'SERVICE'),
  `AccessStatus` bool
  `UserId` integer
);

-- Relações
ALTER TABLE `Account` ADD FOREIGN KEY (`Account`) REFERENCES `Users` (`Id`);
ALTER TABLE `Signins` ADD FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`);
```

## Adicionar novo usuario

``` sql
SELECT * FROM Signins WHERE UserId NOT IN (SELECT Id FROM Users);
SELECT * FROM Signins;

-- Registrar --

-- Inserir um novo registro na tabela 'account'
INSERT INTO Accounts (Firstname, Lastname, Username, Email, Password)
VALUES ('Jane', 'Doe', 'jonedoe', 'jone.doe@example.com', 'hashed_password');

-- Obter o ID da conta recém-criada
SET @account_id = LAST_INSERT_ID();

-- Inserir um novo registro na tabela 'users' usando o ID da conta
INSERT INTO Users (Account, ActiveMsg, ActiveStatus)
VALUES (@account_id, 'ACTIVE', true);
```

## Login do novo usuario

``` sql
-- Supondo que @input_email e @input_password (hash) são fornecidos
SET @input_email = 'jone.doeas@example.com';
SET @input_password = 'hashed_password';  -- A senha já deve estar criptografada

-- Tentar inserir sucesso no login se o email e senha coincidem
INSERT INTO Signins (Email, AccessDate, AccessMsg, AccessStatus, UserId)
SELECT @input_email, NOW(), 'SUCCEED', true, 4
FROM Accounts a
WHERE a.Email = @input_email COLLATE utf8mb4_unicode_ci
  AND a.Password = @input_password COLLATE utf8mb4_unicode_ci
LIMIT 1;

-- Se o e-mail e senha não coincidem, verificar se o e-mail existe
INSERT INTO Signins (Email, AccessDate, AccessMsg, AccessStatus, UserId)
SELECT @input_email, NOW(), 'PASSWORD', false, 4
FROM Accounts a
WHERE a.Email = @input_email COLLATE utf8mb4_unicode_ci
  AND NOT EXISTS (
    SELECT 1
    FROM Accounts
    WHERE email = @input_email COLLATE utf8mb4_unicode_ci
      AND password = @input_password COLLATE utf8mb4_unicode_ci
  )
LIMIT 1;

-- Se o e-mail não existe, insira uma entrada de falha no login
INSERT INTO Signins (Email, AccessDate, AccessMsg, AccessStatus, UserId)
SELECT @input_email, NOW(), 'EMAIL', false, 4
WHERE NOT EXISTS (
    SELECT 1 
    FROM Accounts 
    WHERE Email = @input_email COLLATE utf8mb4_unicode_ci
)
LIMIT 1;
```

## Acessos nas ultimas 2h

``` sql
-- Selecionar logins realizados e tentativas nas últimas duas horas
SELECT *
FROM Signins
JOIN Users ON Users.Id = Signins.UserId
JOIN Accounts ON Accounts.Id = Users.Account
WHERE Signins.AccessDate >= NOW() - INTERVAL 2 HOUR;
```