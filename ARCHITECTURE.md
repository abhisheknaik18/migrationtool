# Architecture Documentation

## System Overview

This is a full-stack data migration application built to transfer data from various sources to NovaTab (restaurant.novatab.com). The application follows a modern client-server architecture with React frontend and Node.js backend.

## Technology Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **State Management**: Zustand
- **HTTP Client**: Axios
- **File Parsing**: PapaParse (CSV), Native JSON
- **Icons**: Lucide React
- **Styling**: Custom CSS with modern design

### Backend
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: SQLite with better-sqlite3
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: Zod

## Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              React Frontend (Port 5173)               │  │
│  │  ┌─────────┐  ┌──────────┐  ┌───────────────────┐   │  │
│  │  │  Auth   │  │Dashboard │  │ Migration Wizard  │   │  │
│  │  │Components  │   UI     │  │   & Settings      │   │  │
│  │  └─────────┘  └──────────┘  └───────────────────┘   │  │
│  │         │           │                  │              │  │
│  │         └───────────┴──────────────────┘              │  │
│  │                     │                                  │  │
│  │            ┌────────▼────────┐                        │  │
│  │            │   Zustand Store  │                       │  │
│  │            └────────┬────────┘                        │  │
│  │                     │                                  │  │
│  │            ┌────────▼────────┐                        │  │
│  │            │   Axios Client   │                       │  │
│  │            └────────┬────────┘                        │  │
│  └─────────────────────┼─────────────────────────────────┘  │
└────────────────────────┼────────────────────────────────────┘
                         │ HTTP/REST
                         │ (JSON)
┌────────────────────────▼────────────────────────────────────┐
│              Node.js Backend (Port 3001)                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   Express Server                       │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │  │
│  │  │   Auth   │  │Migration │  │     NovaTab      │   │  │
│  │  │  Routes  │  │  Routes  │  │     Routes       │   │  │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────────────┘   │  │
│  │       │             │              │                  │  │
│  │       └─────────────┴──────────────┘                  │  │
│  │                     │                                  │  │
│  │          ┌──────────▼──────────┐                      │  │
│  │          │ Auth Middleware     │                      │  │
│  │          └──────────┬──────────┘                      │  │
│  │                     │                                  │  │
│  │          ┌──────────▼──────────┐                      │  │
│  │          │  Database Layer     │                      │  │
│  │          │  (better-sqlite3)   │                      │  │
│  │          └──────────┬──────────┘                      │  │
│  └─────────────────────┼─────────────────────────────────┘  │
└────────────────────────┼────────────────────────────────────┘
                         │
                ┌────────▼────────┐
                │  database.sqlite │
                │   ┌──────────┐   │
                │   │  users   │   │
                │   ├──────────┤   │
                │   │migration │   │
                │   │  _jobs   │   │
                │   ├──────────┤   │
                │   │migration │   │
                │   │  _logs   │   │
                │   ├──────────┤   │
                │   │ novatab  │   │
                │   │ _configs │   │
                │   └──────────┘   │
                └──────────────────┘

External Integration:
┌────────────────────────┐
│  restaurant.novatab.com │ ◄── Data pushed during migration
│   (NovaTab API)         │
└─────────────────────────┘
```

## Data Flow

### 1. Authentication Flow

```
User Registration/Login
    ↓
Frontend sends credentials
    ↓
Backend validates & hashes password (bcrypt)
    ↓
JWT token generated
    ↓
Token sent to frontend
    ↓
Stored in localStorage
    ↓
Included in subsequent API requests (Authorization header)
```

### 2. Migration Flow

```
User uploads CSV/JSON
    ↓
Frontend parses file (PapaParse/JSON.parse)
    ↓
User selects NovaTab configuration
    ↓
User maps source fields to destination fields
    ↓
Frontend sends job creation request
    ↓
Backend stores job in database (status: pending)
    ↓
User triggers execution
    ↓
Backend processes each record:
  - Apply field mappings
  - Transform data
  - Send to NovaTab API
  - Log success/failure
    ↓
Update job status (completed/failed)
    ↓
Frontend displays results
```

## Database Schema

### users
```sql
id TEXT PRIMARY KEY              -- UUID
email TEXT UNIQUE NOT NULL       -- User email
password TEXT NOT NULL           -- Bcrypt hashed
full_name TEXT NOT NULL          -- Display name
company TEXT                     -- Optional company
created_at DATETIME             -- Registration timestamp
updated_at DATETIME             -- Last update
```

### migration_jobs
```sql
id TEXT PRIMARY KEY              -- UUID
user_id TEXT → users(id)        -- Owner
name TEXT NOT NULL               -- Job name
source_type TEXT NOT NULL        -- CSV/JSON/etc
source_data TEXT NOT NULL        -- JSON blob of data
destination_config TEXT          -- NovaTab config (JSON)
mapping_config TEXT              -- Field mappings (JSON)
status TEXT                      -- pending/processing/completed/failed
total_records INTEGER            -- Count
processed_records INTEGER        -- Success count
failed_records INTEGER           -- Failure count
error_log TEXT                   -- Error details (JSON)
created_at DATETIME
completed_at DATETIME
```

### migration_logs
```sql
id TEXT PRIMARY KEY              -- UUID
job_id TEXT → migration_jobs(id) -- Parent job
record_index INTEGER             -- Which record
status TEXT                      -- success/failed
error_message TEXT               -- If failed
created_at DATETIME
```

### novatab_configs
```sql
id TEXT PRIMARY KEY              -- UUID
user_id TEXT → users(id)        -- Owner
config_name TEXT NOT NULL        -- Friendly name
api_endpoint TEXT NOT NULL       -- NovaTab URL
api_key TEXT NOT NULL            -- Auth key
field_mappings TEXT NOT NULL     -- Mappings (JSON)
is_active BOOLEAN                -- Status
created_at DATETIME
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Create new user
- `POST /login` - Authenticate user
- `GET /me` - Get current user (requires auth)

### Migrations (`/api/migration`)
- `POST /jobs` - Create migration job
- `GET /jobs` - List user's jobs
- `GET /jobs/:id` - Get specific job
- `POST /jobs/:id/execute` - Run migration
- `DELETE /jobs/:id` - Delete job

### NovaTab (`/api/novatab`)
- `POST /configs` - Create configuration
- `GET /configs` - List configurations
- `GET /configs/:id` - Get specific config
- `PUT /configs/:id` - Update config
- `DELETE /configs/:id` - Delete config
- `POST /configs/:id/test` - Test connection

## Security Features

### Authentication
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with configurable expiry (default: 7 days)
- Secure token validation middleware
- Protected routes require valid JWT

### Input Validation
- Zod schema validation on all inputs
- Type-safe request/response handling
- SQL injection prevention via prepared statements
- XSS prevention via proper escaping

### Authorization
- All migration endpoints require authentication
- Users can only access their own data
- Row-level security via user_id checks

## Frontend Architecture

### Component Structure
```
App.tsx (Root)
├── Login.tsx (Auth)
├── Register.tsx (Auth)
└── Dashboard.tsx (Main)
    ├── NewMigration.tsx (Wizard)
    │   ├── Step 1: Basic Info
    │   ├── Step 2: Upload Data
    │   └── Step 3: Field Mapping
    └── NovaTabSettings.tsx (Config)
        ├── Config List
        └── Config Form
```

### State Management (Zustand)
- **authStore**: User authentication state
  - user: Current user object
  - token: JWT token
  - login/logout/register methods
  - checkAuth: Validate existing token

### API Layer
- Centralized API client (Axios)
- Automatic token injection
- Type-safe API functions
- Error handling

## File Structure

```
migrationrecord/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── database.ts      # DB initialization
│   │   │   └── migrate.ts       # Migration script
│   │   ├── middleware/
│   │   │   └── auth.ts          # JWT validation
│   │   ├── routes/
│   │   │   ├── auth.ts          # Auth endpoints
│   │   │   ├── migration.ts     # Migration endpoints
│   │   │   └── novatab.ts       # NovaTab endpoints
│   │   └── server.ts            # Express app
│   ├── package.json
│   └── tsconfig.json
├── src/
│   ├── components/              # React components
│   ├── lib/
│   │   └── api.ts              # API client
│   ├── store/
│   │   └── authStore.ts        # State management
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   ├── App.tsx                 # Root component
│   ├── App.css                 # Styles
│   └── main.tsx                # Entry point
├── README.md                    # User documentation
├── SETUP.md                     # Setup instructions
├── ARCHITECTURE.md              # This file
└── package.json                 # Frontend deps
```

## Deployment Considerations

### Environment Variables

**Development**:
- Frontend runs on localhost:5173
- Backend runs on localhost:3001
- SQLite database in local file

**Production**:
- Update VITE_API_URL to production backend
- Use strong JWT_SECRET
- Add real NovaTab API credentials
- Consider PostgreSQL instead of SQLite
- Enable HTTPS
- Add rate limiting
- Set up monitoring/logging

### Scaling

For high-volume migrations:
1. **Queue System**: Add Bull/BullMQ for job processing
2. **Worker Processes**: Separate migration execution from API
3. **Database**: Migrate to PostgreSQL
4. **Caching**: Add Redis for session management
5. **Load Balancing**: Multiple backend instances
6. **File Storage**: S3 for large file uploads

## NovaTab Integration

The application is designed for seamless integration with restaurant.novatab.com:

### Configuration
- API endpoint URL
- Authentication key
- Field mapping definitions

### Data Transformation
- Source fields mapped to NovaTab fields
- Data validation before sending
- Batch processing for efficiency
- Error handling with detailed logs

### Connection Testing
- Test endpoint to verify connectivity
- Validate credentials before migration
- Pre-flight data validation

## Future Enhancements

1. **Data Sources**:
   - Excel file support
   - Database direct connection
   - API imports

2. **Scheduling**:
   - Recurring migrations
   - Cron job support

3. **Transformations**:
   - Custom transformation rules
   - Data cleansing
   - Conditional logic

4. **Monitoring**:
   - Real-time progress tracking
   - Email notifications
   - Webhooks for completion

5. **Audit**:
   - Detailed audit logs
   - Data lineage tracking
   - Rollback capability

## Contributing

When adding features:
1. Follow TypeScript strict mode
2. Add proper error handling
3. Validate all inputs with Zod
4. Write clear comments
5. Update this documentation

