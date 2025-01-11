-- Create Database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'EcelabCRM')
BEGIN
    CREATE DATABASE EcelabCRM;
END
GO

USE EcelabCRM;
GO

-- Create Customers Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Customers]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Customers] (
        CustomerID INT IDENTITY(1,1) PRIMARY KEY,
        CustomerCode NVARCHAR(50) NOT NULL UNIQUE,
        CompanyName NVARCHAR(100) NOT NULL,
        Country NVARCHAR(50),
        City NVARCHAR(50),
        ContactName NVARCHAR(100),
        Email NVARCHAR(100),
        Phone NVARCHAR(20),
        Notes NVARCHAR(MAX),
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        UpdatedAt DATETIME2,
        IsActive BIT DEFAULT 1
    );
END
GO

-- Create Products Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Products]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Products] (
        ProductID INT IDENTITY(1,1) PRIMARY KEY,
        Brand NVARCHAR(100) NOT NULL,
        Code NVARCHAR(50) NOT NULL UNIQUE,
        Description NVARCHAR(MAX),
        Stock INT NOT NULL DEFAULT 0,
        Price DECIMAL(18,2) NOT NULL,
        ExpiryDate DATE,
        MinimumStock INT NOT NULL DEFAULT 0,
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        UpdatedAt DATETIME2,
        IsActive BIT DEFAULT 1
    );
END
GO

-- Create Quotations Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Quotations]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Quotations] (
        QuotationID INT IDENTITY(1,1) PRIMARY KEY,
        QuotationNumber NVARCHAR(50) NOT NULL UNIQUE,
        CustomerID INT NOT NULL,
        QuotationDate DATE NOT NULL DEFAULT GETDATE(),
        ValidUntil DATE NOT NULL,
        TotalAmount DECIMAL(18,2) NOT NULL,
        Status NVARCHAR(20) NOT NULL DEFAULT 'Draft' CHECK (Status IN ('Draft', 'Sent', 'Accepted', 'Rejected')),
        Notes NVARCHAR(MAX),
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        UpdatedAt DATETIME2,
        IsActive BIT DEFAULT 1,
        FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
    );
END
GO

-- Create QuotationDetails Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[QuotationDetails]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[QuotationDetails] (
        QuotationDetailID INT IDENTITY(1,1) PRIMARY KEY,
        QuotationID INT NOT NULL,
        ProductID INT NOT NULL,
        Quantity INT NOT NULL,
        UnitPrice DECIMAL(18,2) NOT NULL,
        TotalPrice DECIMAL(18,2) NOT NULL,
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (QuotationID) REFERENCES Quotations(QuotationID),
        FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
    );
END
GO

-- Create Reminders Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Reminders]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Reminders] (
        ReminderID INT IDENTITY(1,1) PRIMARY KEY,
        CustomerID INT NOT NULL,
        Title NVARCHAR(200) NOT NULL,
        Description NVARCHAR(MAX),
        DueDate DATETIME2 NOT NULL,
        IsCompleted BIT DEFAULT 0,
        Priority TINYINT NOT NULL CHECK (Priority IN (1, 2, 3)), -- 1: Yüksek, 2: Orta, 3: Düşük
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        UpdatedAt DATETIME2,
        FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
    );
END
GO

-- Create Indexes
CREATE NONCLUSTERED INDEX IX_Customers_CustomerCode ON Customers(CustomerCode);
CREATE NONCLUSTERED INDEX IX_Products_Code ON Products(Code);
CREATE NONCLUSTERED INDEX IX_Products_ExpiryDate ON Products(ExpiryDate) WHERE ExpiryDate IS NOT NULL;
CREATE NONCLUSTERED INDEX IX_Quotations_CustomerID ON Quotations(CustomerID);
CREATE NONCLUSTERED INDEX IX_Quotations_Status ON Quotations(Status);
CREATE NONCLUSTERED INDEX IX_QuotationDetails_QuotationID ON QuotationDetails(QuotationID);
CREATE NONCLUSTERED INDEX IX_Reminders_CustomerID ON Reminders(CustomerID);
CREATE NONCLUSTERED INDEX IX_Reminders_DueDate ON Reminders(DueDate);
GO

-- Create Triggers for UpdatedAt
CREATE OR ALTER TRIGGER TR_Customers_Update
ON Customers
AFTER UPDATE
AS
BEGIN
    UPDATE Customers
    SET UpdatedAt = GETDATE()
    FROM Customers c
    INNER JOIN inserted i ON c.CustomerID = i.CustomerID;
END;
GO

CREATE OR ALTER TRIGGER TR_Products_Update
ON Products
AFTER UPDATE
AS
BEGIN
    UPDATE Products
    SET UpdatedAt = GETDATE()
    FROM Products p
    INNER JOIN inserted i ON p.ProductID = i.ProductID;
END;
GO

CREATE OR ALTER TRIGGER TR_Quotations_Update
ON Quotations
AFTER UPDATE
AS
BEGIN
    UPDATE Quotations
    SET UpdatedAt = GETDATE()
    FROM Quotations q
    INNER JOIN inserted i ON q.QuotationID = i.QuotationID;
END;
GO

CREATE OR ALTER TRIGGER TR_Reminders_Update
ON Reminders
AFTER UPDATE
AS
BEGIN
    UPDATE Reminders
    SET UpdatedAt = GETDATE()
    FROM Reminders r
    INNER JOIN inserted i ON r.ReminderID = i.ReminderID;
END;
GO
