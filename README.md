# Ramerame

## 🚀 Features

- **User Authentication & Authorization**
- **Product Management**
  - Create and manage investment products
  - Track product status and expiry dates
  - Monitor investment amounts and durations
- **Certificate System**
  - Generate digital certificates for investments
  - Secure certificate validation system
  - Public certificate verification without login
- **Investment Tracking**
  - Monitor investment duration
  - Track investment amounts
  - View detailed investment reports

## 🛠️ Tech Stack

### Backend

- **PHP** (v8.2+)
- **Laravel** (v10.x)
- **MySQL** (v8.0+)
- **Composer** (v2.x)

### Frontend

- **React** (v18)
- **TypeScript** (v4.x)
- **Tailwind CSS** (v3.x)
- **Shadcn UI**
- **Inertia.js**
- **Lucide Icons**

### Development Environment

- **Node.js** (v16+)
- **npm** (v8+)
- **Laragon/XAMPP**
- **Git**

## 📋 Prerequisites

1. **Required Software**

   - PHP 8.2 or higher
   - Composer 2.x
   - Node.js 16+ and npm
   - MySQL 8.0+
   - Git
   - Laragon (recommended) or XAMPP

2. **Required PHP Extensions**
   - BCMath
   - Ctype
   - Fileinfo
   - JSON
   - Mbstring
   - OpenSSL
   - PDO
   - Tokenizer
   - XML

## 🔧 Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Gusnand/ramerame-new.git
   cd ramerame-new
   ```

2. **Install PHP Dependencies**

   ```bash
   composer install
   ```

3. **Install Node.js Dependencies**

   ```bash
   npm install
   ```

4. **Environment Configuration**

   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Configure Database**
   Update `.env` file with your database credentials:

   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=rameramedb
   DB_USERNAME=root
   DB_PASSWORD=
   ```

6. **Create Database**

   ```sql
   CREATE DATABASE rameramedb;
   ```

7. **Run Migrations and Seeders**

   ```bash
   php artisan migrate
   php artisan db:seed
   ```

8. **Link Storage**
   ```bash
   php artisan storage:link
   ```

## 🚀 Running the Application

### Development Environment

1. **Start Laravel Development Server**

   ```bash
   php artisan serve
   ```

2. **Start Vite Development Server**
   ```bash
   npm run dev
   ```

### Production Environment

1. **Build Frontend Assets**

   ```bash
   npm run build
   ```

2. **Configure Web Server**
   - Set document root to `/public` directory
   - Configure SSL certificate if needed
   - Set up proper permissions

## 🔍 Development with Laragon

1. **Install Laragon**

   - Download from [https://laragon.org](https://laragon.org)
   - Choose full version with PHP 8.2

2. **Project Setup**
   - Place project in: `C:\laragon\www\ramerame-new`
   - Enable auto virtual hosts in Laragon
   - Access via: https://ramerame-new.test

## 📁 Project Structure

```
ramerame-new/
├── app/                    # Laravel application code
│   ├── Http/              # Controllers, Middleware
│   ├── Models/            # Eloquent models
│   └── Providers/         # Service providers
├── resources/
│   ├── js/               # React/TypeScript files
│   │   ├── components/   # Reusable components
│   │   ├── layouts/      # Page layouts
│   │   └── pages/        # Page components
│   └── css/              # Stylesheets
├── routes/                # Application routes
├── database/             # Migrations & seeders
└── public/               # Public assets
```

## 🧪 Testing

```bash
# Run PHP tests
php artisan test

# Run JavaScript tests
npm run test
```

## 🧹 Maintenance

Clear application cache:

```bash
php artisan optimize:clear
```

Update dependencies:

```bash
composer update
npm update
```

## 🔒 Security Features

- CSRF Protection
- XSS Prevention
- SQL Injection Protection
- Secure Certificate Validation
- Rate Limiting
- Password Hashing

## 🔄 Common Issues & Solutions

1. **Storage Permission Issues**

   ```bash
   chmod -R 775 storage bootstrap/cache
   ```

2. **Composer Memory Limit**

   ```bash
   COMPOSER_MEMORY_LIMIT=-1 composer install
   ```

3. **Node.js Memory Issues**
   ```bash
   export NODE_OPTIONS=--max-old-space-size=4096
   ```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Author

- **Gusnand** - [GitHub](https://github.com/Gusnand)

## 🙏 Acknowledgments

- Thanks to all contributors
- Shadcn UI for the component library
- Laravel & React communities

## 📞 Support

For support:

- Create an issue in the GitHub repository
- Contact: [gusnanda1170@gmail.com]

---
