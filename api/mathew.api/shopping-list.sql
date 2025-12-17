BEGIN TRANSACTION;

CREATE TABLE [ShoppingLists] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    [FamilyId] int NOT NULL,
    [CreatedDate] datetimeoffset NOT NULL,
    CONSTRAINT [PK_ShoppingLists] PRIMARY KEY ([Id])
);

CREATE TABLE [ShoppingListItems] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    [BudgetAmount] decimal(18,2) NOT NULL DEFAULT 0.0,
    [CategoryId] int NOT NULL,
    [ShoppingListId] int NOT NULL,
    [IsBought] bit NOT NULL,
    CONSTRAINT [PK_ShoppingListItems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ShoppingListItems_Categories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [Categories] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_ShoppingListItems_ShoppingLists_ShoppingListId] FOREIGN KEY ([ShoppingListId]) REFERENCES [ShoppingLists] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_ShoppingListItems_CategoryId] ON [ShoppingListItems] ([CategoryId]);
CREATE INDEX [IX_ShoppingListItems_ShoppingListId] ON [ShoppingListItems] ([ShoppingListId]);

COMMIT;

