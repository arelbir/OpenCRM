# Veritabanı Şeması ve Yapısı

## Bağlantı Bilgileri
```
Server: ECELABCRM.mssql.somee.com
Database: ECELABCRM
User: arelbebek_SQLLogin_1
Password: 73i5tzc1hv
```

## Tablo Yapıları

### 1. Müşteriler (Customers)
```sql
CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY IDENTITY(1,1),
    CustomerCode NVARCHAR(20),           -- Müşteri No
    CompanyName NVARCHAR(200) NOT NULL,  -- Firma Adı
    Country NVARCHAR(100),               -- Ülke
    City NVARCHAR(100),                  -- Şehir
    ContactName NVARCHAR(100),           -- İletişim Kişisi
    Email NVARCHAR(100),                 -- E-posta
    Phone NVARCHAR(20),                  -- Telefon
    Notes NTEXT,                         -- Notlar
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME,
    IsActive BIT DEFAULT 1
)

-- İndeks oluşturma
CREATE INDEX IX_Customers_CustomerCode ON Customers(CustomerCode)
CREATE INDEX IX_Customers_CompanyName ON Customers(CompanyName)
```

### 2. Ürünler (Products)
```sql
CREATE TABLE Products (
    ProductID INT PRIMARY KEY IDENTITY(1,1),
    Brand NVARCHAR(50),                  -- Marka (Roche, Abbott, vb.)
    Code NVARCHAR(50) UNIQUE,            -- Ürün Kodu
    Description NVARCHAR(200),           -- Ürün Açıklaması
    Stock INT DEFAULT 0,                 -- Stok Miktarı
    Price DECIMAL(18,2),                 -- Birim Fiyat
    ExpiryDate DATE,                     -- Son Kullanma Tarihi
    MinimumStock INT DEFAULT 0,          -- Minimum Stok Seviyesi
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME,
    IsActive BIT DEFAULT 1
)

-- İndeks oluşturma
CREATE INDEX IX_Products_Brand ON Products(Brand)
CREATE INDEX IX_Products_Code ON Products(Code)
CREATE INDEX IX_Products_ExpiryDate ON Products(ExpiryDate)
```

### 3. Hatırlatmalar (Reminders)
```sql
CREATE TABLE Reminders (
    ReminderID INT PRIMARY KEY IDENTITY(1,1),
    CustomerID INT FOREIGN KEY REFERENCES Customers(CustomerID),
    Title NVARCHAR(200),                 -- Hatırlatma Başlığı
    Description NTEXT,                   -- Açıklama
    DueDate DATETIME,                    -- Son Tarih
    IsCompleted BIT DEFAULT 0,           -- Tamamlandı mı?
    Priority INT DEFAULT 2,              -- Öncelik (1: Yüksek, 2: Orta, 3: Düşük)
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME
)

-- İndeks oluşturma
CREATE INDEX IX_Reminders_DueDate ON Reminders(DueDate)
CREATE INDEX IX_Reminders_CustomerID ON Reminders(CustomerID)
```

### 4. Teklifler (Quotations)
```sql
CREATE TABLE Quotations (
    QuotationID INT PRIMARY KEY IDENTITY(1,1),
    QuotationNumber NVARCHAR(50) UNIQUE, -- Teklif Numarası
    CustomerID INT FOREIGN KEY REFERENCES Customers(CustomerID),
    QuotationDate DATETIME DEFAULT GETDATE(),
    ValidUntil DATETIME,                 -- Geçerlilik Tarihi
    TotalAmount DECIMAL(18,2),           -- Toplam Tutar
    Status NVARCHAR(20),                 -- Durum (Draft, Sent, Accepted, Rejected)
    Notes NTEXT,                         -- Notlar
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME
)

-- Teklif Detayları
CREATE TABLE QuotationDetails (
    QuotationDetailID INT PRIMARY KEY IDENTITY(1,1),
    QuotationID INT FOREIGN KEY REFERENCES Quotations(QuotationID),
    ProductID INT FOREIGN KEY REFERENCES Products(ProductID),
    Quantity INT,                        -- Miktar
    UnitPrice DECIMAL(18,2),             -- Birim Fiyat
    TotalPrice DECIMAL(18,2),            -- Toplam Fiyat
    CreatedAt DATETIME DEFAULT GETDATE()
)

-- İndeksler
CREATE INDEX IX_Quotations_CustomerID ON Quotations(CustomerID)
CREATE INDEX IX_Quotations_QuotationNumber ON Quotations(QuotationNumber)
```

## Stored Procedures

### 1. Müşteri İşlemleri
```sql
-- Yeni müşteri ekleme
CREATE PROCEDURE sp_CreateCustomer
    @CustomerCode NVARCHAR(20),
    @CompanyName NVARCHAR(200),
    @Country NVARCHAR(100),
    @ContactName NVARCHAR(100),
    @Email NVARCHAR(100),
    @Phone NVARCHAR(20),
    @Notes NTEXT
AS
BEGIN
    INSERT INTO Customers (CustomerCode, CompanyName, Country, ContactName, Email, Phone, Notes)
    VALUES (@CustomerCode, @CompanyName, @Country, @ContactName, @Email, @Phone, @Notes)
    
    SELECT SCOPE_IDENTITY() as CustomerID
END

-- Müşteri güncelleme
CREATE PROCEDURE sp_UpdateCustomer
    @CustomerID INT,
    @CompanyName NVARCHAR(200),
    @Country NVARCHAR(100),
    @ContactName NVARCHAR(100),
    @Email NVARCHAR(100),
    @Phone NVARCHAR(20),
    @Notes NTEXT
AS
BEGIN
    UPDATE Customers 
    SET CompanyName = @CompanyName,
        Country = @Country,
        ContactName = @ContactName,
        Email = @Email,
        Phone = @Phone,
        Notes = @Notes,
        UpdatedAt = GETDATE()
    WHERE CustomerID = @CustomerID
END
```

### 2. Stok İşlemleri
```sql
-- Stok güncelleme
CREATE PROCEDURE sp_UpdateStock
    @ProductID INT,
    @Quantity INT,
    @ExpiryDate DATE = NULL
AS
BEGIN
    UPDATE Products
    SET Stock = Stock + @Quantity,
        ExpiryDate = ISNULL(@ExpiryDate, ExpiryDate),
        UpdatedAt = GETDATE()
    WHERE ProductID = @ProductID
END

-- Son kullanma tarihi yaklaşan ürünleri listele
CREATE PROCEDURE sp_GetExpiringProducts
    @DayThreshold INT = 90
AS
BEGIN
    SELECT 
        Brand,
        Code,
        Description,
        Stock,
        ExpiryDate,
        DATEDIFF(DAY, GETDATE(), ExpiryDate) as DaysUntilExpiry
    FROM Products
    WHERE ExpiryDate <= DATEADD(DAY, @DayThreshold, GETDATE())
        AND Stock > 0
    ORDER BY ExpiryDate ASC
END
```

## Veritabanı Bakımı

### Yedekleme
```sql
-- Tam yedek alma
BACKUP DATABASE ECELABCRM
TO DISK = 'C:\Backups\ECELABCRM_Full.bak'
WITH FORMAT, COMPRESSION
```

### İndeks Bakımı
```sql
-- İndeks bakımı
ALTER INDEX ALL ON Customers REBUILD
ALTER INDEX ALL ON Products REBUILD
ALTER INDEX ALL ON Reminders REBUILD
ALTER INDEX ALL ON Quotations REBUILD
```

### İstatistik Güncelleme
```sql
-- İstatistikleri güncelle
UPDATE STATISTICS Customers WITH FULLSCAN
UPDATE STATISTICS Products WITH FULLSCAN
UPDATE STATISTICS Reminders WITH FULLSCAN
UPDATE STATISTICS Quotations WITH FULLSCAN
```
