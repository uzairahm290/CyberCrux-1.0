# Books Database Setup

This guide will help you set up the books database for the CyberCrux application.

## Prerequisites

1. MySQL/MariaDB database server running
2. Node.js and npm installed
3. Backend dependencies installed (`npm install`)

## Database Configuration

Make sure your `.env` file in the Backend directory has the correct database configuration:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=cybercrux
```

## Setup Steps

### 1. Run the Database Setup Script

Navigate to the Backend directory and run:

```bash
node setup_database.js
```

This script will:
- Connect to your database
- Create the `books` table with all necessary fields
- Insert sample book data
- Create indexes for better performance

### 2. Verify the Setup

You can verify the setup by checking your database:

```sql
-- Check if the table was created
DESCRIBE books;

-- Check if sample data was inserted
SELECT COUNT(*) FROM books;

-- View sample books
SELECT title, author, category, rating FROM books LIMIT 5;
```

## Database Schema

The `books` table includes the following fields:

- `id` - Primary key (auto-increment)
- `title` - Book title
- `description` - Book description
- `category` - Book category (beginner, intermediate, advanced, etc.)
- `author` - Book author
- `cover` - Cover image URL
- `pdf` - PDF file URL
- `rating` - Book rating (0.0 to 5.0)
- `downloads` - Number of downloads
- `read_time` - Estimated reading time
- `pages` - Number of pages
- `published` - Publication year
- `featured` - Whether the book is featured
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## API Endpoints

The backend provides the following API endpoints for books:

- `GET /api/books` - Get all books (with optional search, category, featured, and sort parameters)
- `GET /api/books/:id` - Get a specific book by ID
- `GET /api/books/categories` - Get all book categories with counts
- `POST /api/books` - Create a new book
- `PUT /api/books/:id` - Update an existing book
- `DELETE /api/books/:id` - Delete a book

## Frontend Integration

The frontend BookPage component now:
- Fetches books and categories from the database
- Displays loading and error states
- Supports real-time filtering and sorting
- Maintains the same modern UI design

## Troubleshooting

### Common Issues

1. **Connection Error**: Make sure your database server is running and credentials are correct
2. **Table Already Exists**: The script uses `CREATE TABLE IF NOT EXISTS`, so it's safe to run multiple times
3. **Permission Error**: Ensure your database user has CREATE and INSERT permissions

### Manual Setup

If the script fails, you can manually run the SQL commands from `create_books_table.sql` in your database client.

## Sample Data

The setup includes 12 sample books across different categories:
- Beginner books (Cybersecurity Essentials, Cryptography Fundamentals)
- Intermediate books (Network Security, Web Application Security, etc.)
- Advanced books (Advanced Penetration Testing, Malware Analysis)
- Specialized books (Digital Forensics, IoT Security, Mobile Security)

Each book includes realistic metadata like ratings, download counts, reading times, and page counts. 