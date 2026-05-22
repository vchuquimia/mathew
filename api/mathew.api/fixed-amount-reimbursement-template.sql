-- ============================================================
-- Migration: AddFixedAmountReimbursementTemplate
-- Creates the FixedAmountReimbursementTemplates table
-- ============================================================

BEGIN TRANSACTION;

CREATE TABLE [FixedAmountReimbursementTemplates] (
    [Id]                        int             NOT NULL IDENTITY,
    [Name]                      nvarchar(max)   NOT NULL,
    [FixedAmount]               decimal(18,2)   NOT NULL,
    [NumberOfPayments]          int             NOT NULL,
    [PaymentDescriptionTemplate] nvarchar(max)  NOT NULL,
    [UserName]                  nvarchar(max)   NOT NULL,
    [FamilyId]                  int             NOT NULL,
    CONSTRAINT [PK_FixedAmountReimbursementTemplates] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_FixedAmountReimbursementTemplates_Families_FamilyId]
        FOREIGN KEY ([FamilyId]) REFERENCES [Families] ([Id])
        ON DELETE NO ACTION
);

CREATE INDEX [IX_FixedAmountReimbursementTemplates_FamilyId]
    ON [FixedAmountReimbursementTemplates] ([FamilyId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260521202018_AddFixedAmountReimbursementTemplate', N'9.0.10');

COMMIT;
GO

