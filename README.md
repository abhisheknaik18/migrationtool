# Data Migration Application

A comprehensive web application for migrating data from various sources to NovaTab (restaurant.novatab.com). Built with React, TypeScript, and Node.js.

## Features

- 🔐 **User Authentication**: Secure login and registration system
- 📊 **Data Import**: Support for CSV and JSON file uploads
- 🔄 **Field Mapping**: Flexible field mapping configuration
- 🎯 **NovaTab Integration**: Direct integration with NovaTab API
- 📈 **Job Tracking**: Monitor migration progress and status
- ⚙️ **Configuration Management**: Save and reuse NovaTab configurations

## Tech Stack

### Frontend
- React 19+ with TypeScript
- Zustand for state management
- Axios for API calls
- PapaParse for CSV parsing
- Lucide React for icons
- Vite for build tooling

### Backend
- Node.js with Express
- TypeScript
- Better-sqlite3 for database
- JWT for authentication
- Bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
cd migrationrecord
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
npm run backend:install
```

4. **Configure environment variables**

Frontend (.env):
```
VITE_API_URL=http://localhost:3001/api
```

Backend (backend/.env):
```
PORT=3001
JWT_SECRET=your-secret-key-here
DATABASE_PATH=./database.sqlite
NODE_ENV=development
NOVATAB_API_URL=https://restaurant.novatab.com/api
NOVATAB_API_KEY=your-novatab-api-key
```

5. **Initialize the database**
```bash
cd backend
npm run db:push
cd ..
```

### Running the Application

1. **Start the backend server** (in one terminal):
```bash
npm run backend
```

2. **Start the frontend** (in another terminal):
```bash
npm run dev
```

3. **Open your browser** and navigate to:
```
http://localhost:5173
```

## Usage Guide

### 1. Authentication

- **Register**: Create a new account with your email, name, and optional company
- **Login**: Sign in with your credentials

### 2. NovaTab Configuration

1. Click "NovaTab Settings" in the dashboard
2. Create a new configuration:
   - Configuration Name: A friendly name for this setup
   - API Endpoint: Your NovaTab API endpoint (default: https://restaurant.novatab.com/api)
   - API Key: Your NovaTab API key
   - Field Mappings: Map NovaTab fields to your source data fields

### 3. Creating a Migration

1. Click "New Migration" on the dashboard
2. **Step 1**: Enter a migration name
3. **Step 2**: Upload your CSV or JSON file
4. **Step 3**: 
   - Select a NovaTab configuration
   - Review and adjust field mappings
   - Click "Create Migration"

### 4. Executing Migrations

1. Find your migration in the dashboard
2. Click the "Play" button to execute
3. Monitor the progress and view results

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Migrations
- `POST /api/migration/jobs` - Create migration job
- `GET /api/migration/jobs` - Get all jobs
- `GET /api/migration/jobs/:id` - Get specific job
- `POST /api/migration/jobs/:id/execute` - Execute migration
- `DELETE /api/migration/jobs/:id` - Delete job

### NovaTab Configurations
- `POST /api/novatab/configs` - Create configuration
- `GET /api/novatab/configs` - Get all configurations
- `GET /api/novatab/configs/:id` - Get specific configuration
- `PUT /api/novatab/configs/:id` - Update configuration
- `DELETE /api/novatab/configs/:id` - Delete configuration
- `POST /api/novatab/configs/:id/test` - Test connection

## Database Schema

### Users Table
- `id`: Unique identifier
- `email`: User email (unique)
- `password`: Hashed password
- `full_name`: User's full name
- `company`: Optional company name
- `created_at`: Account creation timestamp

### Migration Jobs Table
- `id`: Unique identifier
- `user_id`: Foreign key to users
- `name`: Migration name
- `source_type`: Type of source data
- `source_data`: JSON blob of source data
- `destination_config`: NovaTab configuration
- `mapping_config`: Field mapping configuration
- `status`: Job status (pending, processing, completed, failed)
- `total_records`: Total number of records
- `processed_records`: Successfully processed
- `failed_records`: Failed to process
- `error_log`: Error messages
- `created_at`: Job creation timestamp
- `completed_at`: Job completion timestamp

### NovaTab Configs Table
- `id`: Unique identifier
- `user_id`: Foreign key to users
- `config_name`: Configuration name
- `api_endpoint`: NovaTab API endpoint
- `api_key`: API authentication key
- `field_mappings`: JSON field mapping configuration
- `is_active`: Configuration status
- `created_at`: Configuration creation timestamp

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- Input validation with Zod
- Secure token storage

## Development

### Project Structure

```
migrationrecord/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── database.ts
│   │   │   └── migrate.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── migration.ts
│   │   │   └── novatab.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── NewMigration.tsx
│   │   └── NovaTabSettings.tsx
│   ├── lib/
│   │   └── api.ts
│   ├── store/
│   │   └── authStore.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── package.json
└── README.md
```

### Adding New Features

1. **New API Endpoint**: Add route in `backend/src/routes/`
2. **New Component**: Create in `src/components/`
3. **New API Function**: Add to `src/lib/api.ts`
4. **New Type**: Define in `src/types/index.ts`

## Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service

### Backend Deployment (Heroku/Railway/Render)

1. Ensure all environment variables are set
2. Deploy the `backend` folder
3. Update the frontend `VITE_API_URL` to point to your deployed backend

## Troubleshooting

### Database Issues
- Delete `backend/database.sqlite` and run `npm run db:push` again

### Port Conflicts
- Change `PORT` in backend `.env` file
- Update `VITE_API_URL` in frontend `.env` file

### CORS Issues
- Ensure backend CORS is configured correctly
- Check that API URL matches in frontend configuration

## Support

For issues and questions:
- Create an issue in the repository
- Contact: support@example.com

## License

MIT License - feel free to use this project for your needs.

## Contributors

Built with ❤️ for efficient data migration to NovaTab.
