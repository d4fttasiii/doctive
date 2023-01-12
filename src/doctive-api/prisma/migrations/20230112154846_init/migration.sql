BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Patient] (
    [id] INT NOT NULL IDENTITY(1,1),
    [patientHomeAddressId] INT,
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

-- CreateTable
CREATE TABLE [dbo].[PatientHomeAddress] (
    [id] INT NOT NULL IDENTITY(1,1),
    [countryId] INT NOT NULL,
    [city] NVARCHAR(1000) NOT NULL,
    [zip] NVARCHAR(1000) NOT NULL,
    [street] NVARCHAR(1000) NOT NULL,
    [streetNr] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [PatientHomeAddress_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Country] (
    [id] INT NOT NULL IDENTITY(1,1),
    [iso2] NVARCHAR(2) NOT NULL,
    [iso3] NVARCHAR(3) NOT NULL,
    [deName] NVARCHAR(1000) NOT NULL,
    [enName] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Country_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Patient] ADD CONSTRAINT [Patient_patientHomeAddressId_fkey] FOREIGN KEY ([patientHomeAddressId]) REFERENCES [dbo].[PatientHomeAddress]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PatientSession] ADD CONSTRAINT [PatientSession_patientId_fkey] FOREIGN KEY ([patientId]) REFERENCES [dbo].[Patient]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PatientHomeAddress] ADD CONSTRAINT [PatientHomeAddress_countryId_fkey] FOREIGN KEY ([countryId]) REFERENCES [dbo].[Country]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
