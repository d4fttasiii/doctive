BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [address] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedAt] DATETIME2,
    [role] INT NOT NULL,
    [lockEnabled] BIT NOT NULL CONSTRAINT [User_lockEnabled_df] DEFAULT 0,
    [loginAttempts] INT,
    [lockedUntil] DATETIME2,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_address_key] UNIQUE NONCLUSTERED ([address])
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

-- AddForeignKey
ALTER TABLE [dbo].[UserSession] ADD CONSTRAINT [UserSession_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
