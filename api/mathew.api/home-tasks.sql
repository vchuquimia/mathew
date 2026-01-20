BEGIN TRANSACTION;

CREATE TABLE [HomeTasks] (
    [Id] int NOT NULL IDENTITY,
    [Description] nvarchar(max) NOT NULL,
    [Done] bit NOT NULL,
    [DueDate] datetimeoffset NOT NULL,
    [Rating] int NULL,
    [RatingComment] nvarchar(max) NULL,
    [UserName] varchar(10) NOT NULL,
    [FamilyId] int NOT NULL,
    CONSTRAINT [PK_HomeTasks] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_HomeTasks_Families_FamilyId] FOREIGN KEY ([FamilyId]) REFERENCES [Families] ([Id]),
    CONSTRAINT [FK_HomeTasks_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id])
);

COMMIT;

