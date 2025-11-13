IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
CREATE TABLE [Categories] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Description] nvarchar(500) NULL,
    [Icon] nvarchar(50) NULL,
    [Color] nvarchar(50) NULL,
    CONSTRAINT [PK_Categories] PRIMARY KEY ([Id])
);

CREATE TABLE [IncomeSources] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Description] nvarchar(500) NULL,
    [ProjectedIncome] decimal(18,2) NOT NULL,
    CONSTRAINT [PK_IncomeSources] PRIMARY KEY ([Id])
);

CREATE TABLE [Users] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(450) NOT NULL,
    [Password] nvarchar(max) NOT NULL,
    [ColorClass] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
);

CREATE TABLE [Budgets] (
    [Id] int NOT NULL IDENTITY,
    [CategoryId] int NOT NULL,
    [Amount] decimal(18,2) NOT NULL,
    [Month] int NOT NULL,
    [Year] int NOT NULL,
    CONSTRAINT [PK_Budgets] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Budgets_Categories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [Categories] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Expenses] (
    [Id] int NOT NULL IDENTITY,
    [Amount] decimal(18,2) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [Date] datetimeoffset NOT NULL,
    [CategoryId] int NOT NULL,
    [RegisteredBy] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Expenses] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Expenses_Categories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [Categories] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Incomes] (
    [Id] int NOT NULL IDENTITY,
    [Amount] decimal(18,2) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [Date] datetime2 NOT NULL,
    [UserName] nvarchar(max) NOT NULL,
    [IncomeSourceId] int NOT NULL,
    CONSTRAINT [PK_Incomes] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Incomes_IncomeSources_IncomeSourceId] FOREIGN KEY ([IncomeSourceId]) REFERENCES [IncomeSources] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_Budgets_CategoryId] ON [Budgets] ([CategoryId]);

CREATE UNIQUE INDEX [IX_Categories_Name] ON [Categories] ([Name]);

CREATE INDEX [IX_Expenses_CategoryId] ON [Expenses] ([CategoryId]);

CREATE INDEX [IX_Incomes_IncomeSourceId] ON [Incomes] ([IncomeSourceId]);

CREATE UNIQUE INDEX [IX_IncomeSources_Name] ON [IncomeSources] ([Name]);

CREATE UNIQUE INDEX [IX_Users_Name] ON [Users] ([Name]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251106174637_users', N'9.0.10');

COMMIT;
GO

