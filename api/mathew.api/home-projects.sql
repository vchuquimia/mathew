BEGIN TRANSACTION;

CREATE TABLE [HomeProjects] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    [FamilyId] int NOT NULL,
    [Status] int NOT NULL,
    [Description] nvarchar(200) NULL,
    [Feedback] int NULL,
    [FeedbackComment] nvarchar(500) NULL,
    [CreationDate] datetimeoffset NOT NULL,
    CONSTRAINT [PK_HomeProjects] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_HomeProjects_Families_FamilyId] FOREIGN KEY ([FamilyId]) REFERENCES [Families] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [HomeProjectLogs] (
    [Id] int NOT NULL IDENTITY,
    [HomeProjectId] int NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [CreationDate] datetimeoffset NOT NULL,
    CONSTRAINT [PK_HomeProjectLogs] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_HomeProjectLogs_HomeProjects_HomeProjectId] FOREIGN KEY ([HomeProjectId]) REFERENCES [HomeProjects] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [HomeProjectTasks] (
    [Id] int NOT NULL IDENTITY,
    [HomeProjectId] int NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [CreationDate] datetimeoffset NOT NULL,
    [Done] bit NOT NULL,
    CONSTRAINT [PK_HomeProjectTasks] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_HomeProjectTasks_HomeProjects_HomeProjectId] FOREIGN KEY ([HomeProjectId]) REFERENCES [HomeProjects] ([Id]) ON DELETE CASCADE
);

COMMIT;

