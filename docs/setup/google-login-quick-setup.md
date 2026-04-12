# Google Login Configuration Script

This script helps set up the environment variables required for Google login functionality.

## Prerequisites

Before running this script, you need:

1. Your Firebase project configuration (from Firebase Console)
2. Your Firebase Admin SDK private key (JSON file)

## Setting Up Environment Variables

### For Backend (apps/backend/.env):

1. Open `apps/backend/.env` file
2. Add these variables:

```bash
# Firebase Configuration for Google Login
FIREBASE_PROJECT_ID=your_actual_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email@example.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgAMIIBHwKCAQEA...\n-----END PRIVATE KEY-----"
```

### For Frontend (apps/frontend/.env):

1. Open `apps/frontend/.env` file
2. Add your Firebase web configuration:

```bash
VITE_FIREBASE_API_KEY=your_web_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcde1234567890
```

## How to Get Firebase Credentials

### For Firebase Web Configuration:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on the web icon "</>" to add a web app
4. Register your app with nickname (e.g., "chat-box-ai")
5. Copy the configuration object provided

### For Firebase Admin SDK:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to IAM & Admin → Service Accounts
4. Create a new service account or use an existing one
5. Generate a new key (JSON format)
6. Copy the contents of the downloaded JSON file
7. Format it properly for the environment variable (replace newlines with `\n`)

## Testing the Setup

After configuring the environment variables:

1. Restart your backend server
2. Check the logs for "Firebase Admin SDK initialized successfully"
3. Try the Google login button on the login page
4. Verify that the `/api/auth/google` endpoint is accessible

## Troubleshooting Tips

- Make sure your Firebase project has Google Sign-In enabled in Authentication settings
- Verify that your domain is added to authorized domains in Firebase Console
- Ensure the project IDs match between frontend and backend configurations
- Check that the private key is properly formatted with escaped newlines