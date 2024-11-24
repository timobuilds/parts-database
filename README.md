# Parts Database Manager

A web application for managing parts inventory with CSV upload capabilities and database management features.

## Features

- CSV file upload with four columns:
  - Internal Part Number
  - Internal Description
  - Manufacturer Name
  - Manufacturer Part Number
- Edit and modify database entries
- Add comments to parts
- Delete entries

## Prerequisites

- Node.js 16+ 
- PostgreSQL
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your PostgreSQL database and update the `.env` file with your database URL:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/parts_db?schema=public"
   ```

4. Initialize the database:
   ```bash
   npx prisma db push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## CSV File Format

Your CSV file should have the following headers:
- internalPartNumber
- internalDescription
- manufacturerName
- manufacturerPartNumber

Example:
```csv
internalPartNumber,internalDescription,manufacturerName,manufacturerPartNumber
ABC123,Widget A,Acme Corp,ACME-W-123
XYZ789,Widget B,Beta Manufacturing,BM-456-789
```
