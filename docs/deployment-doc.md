# Deployment Kılavuzu

## Gereksinimler

### Sunucu Gereksinimleri
- Node.js 18+
- HTTPS için SSL sertifikası
- PM2 (process manager)
- Nginx (web sunucusu)

### Domain ve SSL
- Domain adı (örn: ecelabcrm.com)
- SSL sertifikası (Let's Encrypt önerilen)

## Deployment Adımları

### 1. Sunucu Hazırlığı

```bash
# Sistem güncellemesi
sudo apt update
sudo apt upgrade

# Node.js kurulumu
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Nginx kurulumu
sudo apt install nginx

# PM2 kurulumu
sudo npm install -g pm2
```

### 2. Frontend Build ve Deployment

```bash
# Frontend projesine git
cd frontend

# Bağımlılıkları yükle
npm install

# Production build
npm run build

# Build dosyalarını Nginx dizinine kopyala
sudo cp -r dist/* /var/www/html/
```

### 3. Backend Deployment

```bash
# Backend projesine git
cd backend

# Bağımlılıkları yükle
npm install

# TypeScript build
npm run build

# PM2 ile başlat
pm2 start dist/index.js --name ecelabcrm-api
```

### 4. Nginx Konfigürasyonu

```nginx
# /etc/nginx/sites-available/ecelabcrm
server {
    listen 80;
    server_name ecelabcrm.com www.ecelabcrm.com;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. SSL Sertifikası Kurulumu

```bash
# Certbot kurulumu
sudo apt install certbot python3-certbot-nginx

# SSL sertifikası alma
sudo certbot --nginx -d ecelabcrm.com -d www.ecelabcrm.com
```

### 6. Environment Variables

```bash
# Backend .env dosyası
NODE_ENV=production
PORT=3000
DB_CONNECTION_STRING=Server=ECELABCRM.mssql.somee.com;Database=ECELABCRM;User Id=arelbebek_SQLLogin_1;Password=73i5tzc1hv;TrustServerCertificate=True;
```

## Monitoring ve Log Yönetimi

### PM2 Monitoring
```bash
# Status kontrolü
pm2 status

# Log izleme
pm2 logs ecelabcrm-api

# Performance monitoring
pm2 monit
```

### Nginx Logs
```bash
# Access logs
tail -f /var/log/nginx/access.log

# Error logs
tail -f /var/log/nginx/error.log
```

## Backup Stratejisi

### Veritabanı Backup
```sql
-- Günlük tam yedek
BACKUP DATABASE ECELABCRM
TO DISK = '/backup/ECELABCRM_FULL_$(date +%Y%m%d).bak'
WITH FORMAT, COMPRESSION;
```

### Dosya Sistemi Backup
```bash
# Frontend dosyaları
tar -czf /backup/frontend_$(date +%Y%m%d).tar.gz /var/www/html/

# Backend dosyaları
tar -czf /backup/backend_$(date +%Y%m%d).tar.gz /opt/ecelabcrm/backend/
```

## Güvenlik Önlemleri

### Firewall Konfigürasyonu
```bash
# Sadece gerekli portları aç
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw enable
```

### SSL/TLS Ayarları
```nginx
# /etc/nginx/sites-available/ecelabcrm
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
```

## Güncelleme Prosedürü

### Frontend Güncelleme
```bash
# Yeni kodu çek
git pull origin main

# Bağımlılıkları güncelle
npm install

# Yeni build al
npm run build

# Dosyaları kopyala
sudo cp -r dist/* /var/www/html/
```

### Backend Güncelleme
```bash
# Yeni kodu çek
git pull origin main

# Bağımlılıkları güncelle
npm install

# Yeni build al
npm run build

# PM2'yi yeniden başlat
pm2 restart ecelabcrm-api
```

## Sorun Giderme

### Yaygın Sorunlar ve Çözümleri

1. 502 Bad Gateway
```bash
# Nginx ve PM2 durumunu kontrol et
sudo systemctl status nginx
pm2 status

# Nginx'i yeniden başlat
sudo systemctl restart nginx
```

2. Database Bağlantı Hatası
```bash
# Environment variables kontrol
pm2 env ecelabcrm-api

# Bağlantıyı test et
telnet ECELABCRM.mssql.somee.com 1433
```

3. SSL Sertifika Sorunları
```bash
# Sertifika durumunu kontrol et
sudo certbot certificates

# Sertifikayı yenile
sudo certbot renew --dry-run
```
