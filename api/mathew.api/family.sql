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

ALTER TABLE [Budgets] ADD [UserName] nvarchar(max) NOT NULL DEFAULT N'';

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251106175526_budget-username', N'9.0.10');

CREATE TABLE [Reinbursements] (
    [Id] int NOT NULL IDENTITY,
    [Amount] decimal(18,2) NOT NULL,
    [ExpenseId] int NOT NULL,
    [UserName] nvarchar(max) NOT NULL,
    [Percent] int NOT NULL,
    CONSTRAINT [PK_Reinbursements] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Reinbursements_Expenses_ExpenseId] FOREIGN KEY ([ExpenseId]) REFERENCES [Expenses] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_Reinbursements_ExpenseId] ON [Reinbursements] ([ExpenseId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251110201824_reembolso', N'9.0.10');

ALTER TABLE [Reinbursements] DROP CONSTRAINT [FK_Reinbursements_Expenses_ExpenseId];

DROP INDEX [IX_Users_Name] ON [Users];

DROP INDEX [IX_IncomeSources_Name] ON [IncomeSources];

DROP INDEX [IX_Categories_Name] ON [Categories];

ALTER TABLE [Reinbursements] DROP CONSTRAINT [PK_Reinbursements];

EXEC sp_rename N'[Reinbursements]', N'Reimbursements', 'OBJECT';

EXEC sp_rename N'[Reimbursements].[Percent]', N'Percentage', 'COLUMN';

EXEC sp_rename N'[Reimbursements].[IX_Reinbursements_ExpenseId]', N'IX_Reimbursements_ExpenseId', 'INDEX';

ALTER TABLE [Users] ADD [FamilyId] int NOT NULL DEFAULT 0;

ALTER TABLE [IncomeSources] ADD [FamilyId] int NOT NULL DEFAULT 0;

ALTER TABLE [Incomes] ADD [FamilyId] int NOT NULL DEFAULT 0;

ALTER TABLE [Expenses] ADD [FamilyId] int NOT NULL DEFAULT 0;

ALTER TABLE [Categories] ADD [FamilyId] int NOT NULL DEFAULT 0;

ALTER TABLE [Budgets] ADD [FamilyId] int NOT NULL DEFAULT 0;

ALTER TABLE [Reimbursements] ADD [FamilyId] int NOT NULL DEFAULT 0;

ALTER TABLE [Reimbursements] ADD [Pending] bit NOT NULL DEFAULT CAST(0 AS bit);

ALTER TABLE [Reimbursements] ADD CONSTRAINT [PK_Reimbursements] PRIMARY KEY ([Id]);

CREATE TABLE [Families] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Description] nvarchar(500) NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Families] PRIMARY KEY ([Id])
);

CREATE INDEX [IX_Users_FamilyId] ON [Users] ([FamilyId]);

CREATE UNIQUE INDEX [IX_Users_Name_FamilyId] ON [Users] ([Name], [FamilyId]);

CREATE INDEX [IX_IncomeSources_FamilyId] ON [IncomeSources] ([FamilyId]);

CREATE UNIQUE INDEX [IX_IncomeSources_Name_FamilyId] ON [IncomeSources] ([Name], [FamilyId]);

CREATE INDEX [IX_Incomes_FamilyId] ON [Incomes] ([FamilyId]);

CREATE INDEX [IX_Expenses_FamilyId] ON [Expenses] ([FamilyId]);

CREATE INDEX [IX_Categories_FamilyId] ON [Categories] ([FamilyId]);

CREATE UNIQUE INDEX [IX_Categories_Name_FamilyId] ON [Categories] ([Name], [FamilyId]);

CREATE INDEX [IX_Budgets_FamilyId] ON [Budgets] ([FamilyId]);

CREATE INDEX [IX_Reimbursements_FamilyId] ON [Reimbursements] ([FamilyId]);

CREATE UNIQUE INDEX [IX_Families_Name] ON [Families] ([Name]);

ALTER TABLE [Budgets] ADD CONSTRAINT [FK_Budgets_Families_FamilyId] FOREIGN KEY ([FamilyId]) REFERENCES [Families] ([Id]) ON DELETE NO ACTION;

ALTER TABLE [Categories] ADD CONSTRAINT [FK_Categories_Families_FamilyId] FOREIGN KEY ([FamilyId]) REFERENCES [Families] ([Id]) ON DELETE NO ACTION;

ALTER TABLE [Expenses] ADD CONSTRAINT [FK_Expenses_Families_FamilyId] FOREIGN KEY ([FamilyId]) REFERENCES [Families] ([Id]) ON DELETE NO ACTION;

ALTER TABLE [Incomes] ADD CONSTRAINT [FK_Incomes_Families_FamilyId] FOREIGN KEY ([FamilyId]) REFERENCES [Families] ([Id]) ON DELETE NO ACTION;

ALTER TABLE [IncomeSources] ADD CONSTRAINT [FK_IncomeSources_Families_FamilyId] FOREIGN KEY ([FamilyId]) REFERENCES [Families] ([Id]) ON DELETE NO ACTION;

ALTER TABLE [Reimbursements] ADD CONSTRAINT [FK_Reimbursements_Expenses_ExpenseId] FOREIGN KEY ([ExpenseId]) REFERENCES [Expenses] ([Id]) ON DELETE CASCADE;

ALTER TABLE [Reimbursements] ADD CONSTRAINT [FK_Reimbursements_Families_FamilyId] FOREIGN KEY ([FamilyId]) REFERENCES [Families] ([Id]) ON DELETE NO ACTION;

ALTER TABLE [Users] ADD CONSTRAINT [FK_Users_Families_FamilyId] FOREIGN KEY ([FamilyId]) REFERENCES [Families] ([Id]) ON DELETE NO ACTION;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251118184021_AddFamilySupport', N'9.0.10');

COMMIT;
GO

