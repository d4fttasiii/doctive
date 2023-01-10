BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Patient] (
    [id] INT NOT NULL IDENTITY(1,1),
    [walletAddress] NVARCHAR(1000) NOT NULL,
    [firstname] NVARCHAR(1000) NOT NULL,
    [lastname] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Patient_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedAt] DATETIME2,
    [lockEnabled] BIT NOT NULL CONSTRAINT [Patient_lockEnabled_df] DEFAULT 0,
    [loginAttempts] INT,
    [lockedUntil] DATETIME2,
    [refreshToken] NVARCHAR(1000),
    CONSTRAINT [Patient_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Patient_walletAddress_key] UNIQUE NONCLUSTERED ([walletAddress]),
    CONSTRAINT [Patient_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[PatientSession] (
    [id] INT NOT NULL IDENTITY(1,1),
    [message] NVARCHAR(1000) NOT NULL,
    [used] BIT NOT NULL CONSTRAINT [PatientSession_used_df] DEFAULT 0,
    [patientId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [PatientSession_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PatientSession_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[PatientSession] ADD CONSTRAINT [PatientSession_patientId_fkey] FOREIGN KEY ([patientId]) REFERENCES [dbo].[Patient]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
