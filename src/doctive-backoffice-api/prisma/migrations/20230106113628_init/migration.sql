BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [walletAddress] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedAt] DATETIME2,
    [role] INT NOT NULL,
    [lockEnabled] BIT NOT NULL CONSTRAINT [User_lockEnabled_df] DEFAULT 0,
    [loginAttempts] INT,
    [lockedUntil] DATETIME2,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_walletAddress_key] UNIQUE NONCLUSTERED ([walletAddress])
);

-- CreateTable
CREATE TABLE [dbo].[UserSession] (
    [id] INT NOT NULL IDENTITY(1,1),
    [message] NVARCHAR(1000) NOT NULL,
    [used] BIT NOT NULL CONSTRAINT [UserSession_used_df] DEFAULT 0,
    [userId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [UserSession_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [UserSession_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Institution] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [fullAddress] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [phoneNr] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Institution_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedAt] DATETIME2,
    CONSTRAINT [Institution_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[InstitutionSubscription] (
    [id] INT NOT NULL IDENTITY(1,1),
    [isActive] BIT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [InstitutionSubscription_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedAt] DATETIME2,
    [institutionId] INT NOT NULL,
    CONSTRAINT [InstitutionSubscription_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [InstitutionSubscription_institutionId_key] UNIQUE NONCLUSTERED ([institutionId])
);

-- CreateTable
CREATE TABLE [dbo].[InstitutionManager] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [walletAddress] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [InstitutionManager_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedAt] DATETIME2,
    [institutionId] INT NOT NULL,
    CONSTRAINT [InstitutionManager_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [InstitutionManager_walletAddress_key] UNIQUE NONCLUSTERED ([walletAddress]),
    CONSTRAINT [InstitutionManager_institutionId_key] UNIQUE NONCLUSTERED ([institutionId])
);

-- AddForeignKey
ALTER TABLE [dbo].[UserSession] ADD CONSTRAINT [UserSession_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[InstitutionSubscription] ADD CONSTRAINT [InstitutionSubscription_institutionId_fkey] FOREIGN KEY ([institutionId]) REFERENCES [dbo].[Institution]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[InstitutionManager] ADD CONSTRAINT [InstitutionManager_institutionId_fkey] FOREIGN KEY ([institutionId]) REFERENCES [dbo].[Institution]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
