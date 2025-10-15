# AICC - AI Credit Card Recommendation System

AICC is an intelligent credit card recommendation system that helps users find the perfect credit card based on their spending patterns and preferences.

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (version 18 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/aicc-mswe/aicc-frontend.git
cd aicc-frontend
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

#### Development Mode

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

The dev server features:
- Hot Module Replacement (HMR) - changes appear instantly
- Fast refresh for React components

#### Production Build

Build the application for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality


## 🗂️ Project Structure

```
aicc-frontend/
├── public/          # Static assets
├── src/
│   ├── assets/      # Images and icons
│   ├── pages/       # Page components
│   ├── App.jsx      # Main application component
│   └── main.jsx     # Application entry point
├── package.json
└── vite.config.js
```
