# Google Login Setup Guide

## Overview
This guide explains how to set up Google authentication in the Chat Box AI application. Google login uses Firebase Authentication for the frontend and Firebase Admin SDK for the backend verification.

## Prerequisites

1. A Google Cloud Project with Firebase enabled
2. Firebase Web SDK configuration for the frontend
3. Firebase Admin SDK service account key for the backend

## Frontend Configuration

### 1. Get Firebase Web Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select or create a project
3. Navigate to Project Settings → General
4. Scroll down to "Your apps" section
5. Copy the Firebase configuration object

### 2. Configure Environment Variables
Add the following to your `apps/frontend/.env` file:

```bash
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

### 3. Enable Google Sign-In in Firebase
1. In Firebase Console, go to Authentication → Sign-in method
2. Enable the "Google" provider
3. Add your domain to authorized domains (e.g., localhost:5173 for development)

## Backend Configuration

### 1. Create a Service Account
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to IAM & Admin → Service Accounts
4. Click "Create Service Account"
5. Give it a name (e.g., "firebase-admin")
6. Grant "Firebase Admin" role or "Firebase Authentication Admin" role

### 2. Generate Private Key
1. In the service account details, go to Keys tab
2. Click "Add Key" → "Create new key"
3. Select JSON format
4. Download the key file

### 3. Configure Environment Variables
Add the following to your `apps/backend/.env` file:

```bash
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_content\n-----END PRIVATE KEY-----"
```

**Note**: Make sure to properly escape newlines in the private key. Replace actual newlines with `\n` in the environment variable.

## Testing Google Login

1. Ensure both frontend and backend servers are running
2. Visit the login page
3. Click "Continue with Google"
4. Complete the Google authentication flow
5. The backend should verify the token and create/return a user record

## Troubleshooting

### Common Issues

1. **404 Error on `/api/auth/google`**: 
   - Make sure the backend server is running on the correct port (default 3000)
   - Check that the route exists in `auth.controller.ts`

2. **Firebase not configured error**:
   - Verify all three Firebase environment variables are set in the backend
   - Check that the private key is properly formatted with escaped newlines

3. **UnauthorizedException: Invalid Firebase token**:
   - Ensure the Firebase project IDs match between frontend and backend
   - Verify the token being sent from frontend is valid

4. **CORS issues**:
   - Make sure `FRONTEND_URL` in backend .env matches your frontend URL
   - Check that CORS is properly configured

### Verification Steps

1. Check backend logs for "Firebase Admin SDK initialized successfully"
2. Verify the `/api/auth/google` endpoint is accessible via POST
3. Confirm Firebase Admin SDK can verify tokens by checking the auth service logs

## Security Notes

- Never commit Firebase private keys to version control
- Use environment variables for all sensitive configuration
- Rotate service account keys periodically
- Implement proper rate limiting for authentication endpoints