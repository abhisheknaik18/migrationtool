# Setup Guide

## Quick Start

Follow these steps to get the application running:

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
npm run backend:install
```

### 2. Configure Environment Variables

The `.env` files are already created with default values. For production, you should update:

**Backend** (`backend/.env`):
- Change `JWT_SECRET` to a secure random string
- Add your NovaTab API key to `NOVATAB_API_KEY`

### 3. Initialize Database

```bash
cd backend
npm run db:push
cd ..
```

### 4. Run the Application

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
npm run backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## First Time Usage

1. **Register an Account**
   - Click "Sign up" on the login page
   - Enter your details
   - Click "Create Account"

2. **Configure NovaTab**
   - Click "NovaTab Settings" in the dashboard
   - Create a new configuration with your NovaTab credentials
   - Define field mappings for your data structure

3. **Create Your First Migration**
   - Click "New Migration"
   - Upload a CSV or JSON file
   - Map fields to your NovaTab configuration
   - Execute the migration

## Troubleshooting

### Port Already in Use

If port 3001 is already in use:
1. Edit `backend/.env` and change `PORT=3001` to another port (e.g., `PORT=3002`)
2. Edit `.env` and update `VITE_API_URL` to match the new port

### Database Locked

If you get a database locked error:
1. Stop all running instances
2. Delete `backend/database.sqlite*` files
3. Run `cd backend && npm run db:push` again

### Module Not Found

If you get module not found errors:
1. Delete `node_modules` folders in both root and backend
2. Delete `package-lock.json` files
3. Run installations again

## Production Deployment

### Backend (e.g., Railway, Render)

1. Push the `backend` folder to your hosting service
2. Set environment variables in the hosting dashboard
3. Ensure the build command is: `npm run build`
4. Ensure the start command is: `npm start`

### Frontend (e.g., Vercel, Netlify)

1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Set `VITE_API_URL` to your backend URL

## Security Recommendations

1. **Change JWT_SECRET**: Use a long, random string
2. **Use HTTPS**: In production, always use HTTPS
3. **API Keys**: Never commit real API keys to version control
4. **Database Backups**: Regularly backup your SQLite database
5. **Rate Limiting**: Consider adding rate limiting for production

## Integration with NovaTab

The application is designed to integrate seamlessly with restaurant.novatab.com:

1. **Get API Credentials**: Contact NovaTab to get your API endpoint and key
2. **Configure in App**: Add these in NovaTab Settings
3. **Map Fields**: Define how your data maps to NovaTab's structure
4. **Test Connection**: Use the test button to verify connectivity

## Support

For questions or issues:
- Check the README.md for detailed documentation
- Review error logs in browser console and backend terminal
- Ensure all dependencies are properly installed

