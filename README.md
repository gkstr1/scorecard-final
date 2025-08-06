# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/b3865c15-4b7c-4a6e-b91a-b5091e52abf1

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/b3865c15-4b7c-4a6e-b91a-b5091e52abf1) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- LinkedIn API (OAuth 2.0)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/b3865c15-4b7c-4a6e-b91a-b5091e52abf1) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## LinkedIn OAuth Integration

This application features LinkedIn API integration for contact sourcing. To set up the LinkedIn OAuth connection:

### 1. Register a LinkedIn Developer Application

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Click on "Create App" and complete the application information
3. Under Products, select "Sign In with LinkedIn" 
4. Note your Client ID and Client Secret

### 2. Configure OAuth Settings

1. In your LinkedIn app settings, add authorized redirect URLs:
   - For development: `http://localhost:3000/linkedin-callback`
   - For production: `https://your-domain.com/linkedin-callback`

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```sh
   cp .env.example .env
   ```

2. Update the LinkedIn OAuth variables in your `.env` file:
   ```
   REACT_APP_LINKEDIN_CLIENT_ID=your_client_id_here
   REACT_APP_LINKEDIN_CLIENT_SECRET=your_client_secret_here
   REACT_APP_LINKEDIN_REDIRECT_URI=http://localhost:3000/linkedin-callback
   ```

### 4. Security Considerations

For production deployment, it's recommended to implement a backend service to handle the OAuth token exchange step rather than performing it client-side. This prevents exposing your client secret in the frontend code.
