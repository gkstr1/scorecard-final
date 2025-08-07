# Scorecard - AI-Powered Recruitment Suite

> Smart Hiring Platform with LinkedIn Integration and Advanced Candidate Sourcing

## 🚀 Overview

Scorecard is a comprehensive AI-powered recruitment platform designed to streamline the hiring process. It combines intelligent candidate sourcing, LinkedIn integration, and advanced analytics to help recruiters find and connect with the best talent efficiently.

### Key Features

- **🎯 Smart Candidate Sourcing**: AI-powered candidate discovery and filtering
- **🔗 LinkedIn Integration**: OAuth 2.0 authentication with profile data sync
- **📊 Advanced Analytics**: Real-time insights and recruitment metrics
- **💬 Contact Management**: Streamlined candidate communication tools
- **🎨 Modern UI/UX**: Clean, responsive design with shadcn-ui components
- **⚡ Real-time Updates**: Live data synchronization and notifications

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn-ui
- **Authentication**: LinkedIn OAuth 2.0
- **Backend**: Supabase
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **State Management**: React Hooks + Context API

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- LinkedIn Developer Account (for OAuth integration)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gkstr1/scorecard-final.git
   cd scorecard-final
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   REACT_APP_LINKEDIN_CLIENT_ID=your_linkedin_client_id
   REACT_APP_LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
   REACT_APP_LINKEDIN_REDIRECT_URI=http://localhost:5173/linkedin/callback
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## 🔐 LinkedIn OAuth Setup

### 1. Create LinkedIn App

1. Visit [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Create a new app for your organization
3. Add the following redirect URLs:
   - `http://localhost:5173/linkedin/callback` (development)
   - `https://yourdomain.com/linkedin/callback` (production)

### 2. Configure OAuth Settings

- **Scopes Required**: `r_liteprofile`, `r_emailaddress`
- **OAuth 2.0 settings**: Enable Authorization Code Flow
- **Redirect URLs**: Must match your environment configuration

### 3. Security Considerations

- Never commit your `.env` file to version control
- Use environment-specific client secrets
- Implement proper token refresh logic for production
- Consider using a backend proxy for token exchange in production

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── LinkedInConnectButton.tsx
│   ├── LinkedInProfilePreview.tsx
│   ├── LinkedInDetailedProfile.tsx
│   └── ContactModal.tsx
├── hooks/              # Custom React hooks
│   └── useLinkedIn.ts
├── pages/              # Page components
│   ├── Index.tsx
│   ├── Sourcing.tsx
│   └── LinkedInCallback.tsx
├── services/           # API services
│   └── linkedinService.ts
├── lib/               # Utility functions
└── types/             # TypeScript type definitions
```

## 🔄 Development Workflow

### Branch Strategy

- `main`: Production-ready code
- `feature/*`: New features (e.g., `feature/linkedin-integration`)
- `fix/*`: Bug fixes
- `docs/*`: Documentation updates

### Commit Convention

```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
Example: feat(linkedin): implement OAuth 2.0 authentication flow
```

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint
```

## 📚 Documentation

- [LinkedIn Integration Guide](./docs-linkedin-integration.md)
- [API Documentation](./docs/api.md)
- [Component Library](./docs/components.md)
- [Deployment Guide](./docs/deployment.md)

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Environment Variables (Production)

```env
REACT_APP_LINKEDIN_CLIENT_ID=prod_client_id
REACT_APP_LINKEDIN_CLIENT_SECRET=prod_client_secret
REACT_APP_LINKEDIN_REDIRECT_URI=https://yourdomain.com/linkedin/callback
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in this repository
- Contact the development team
- Check the documentation in the `/docs` folder

---

**Built with ❤️ for modern recruitment teams**
