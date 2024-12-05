# FitFrenzy Frontend

**FitFrenzy is a frontend application designed to manage user authentication, profiles, quotes, and workouts. This application is built with Next.js and TypeScript, and it uses Docker for containerization and Google Cloud Run for deployment.**

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/fit-frenzy-frontend.git
cd fit-frenzy-frontend
```

Install dependencies:

```bash
npm install
```

Set up environment variables: Create a `.env` file in the root directory and add the necessary environment variables as specified in the Environment Variables section.

## Usage

To start the development server, run:

```bash
npm run dev
```

To build the project, run:

```bash
npm run build
```

To start the production server, run:

```bash
npm start
```

## Project Structure

```
.eslintrc.json
.github/
  workflows/
    ci.yaml
.gitignore
.next/
  app-build-manifest.json
  build-manifest.json
  cache/
    .rscinfo
    eslint/
    ...
package.json
react-loadable-manifest.json
server/
static/
trace
types/
app/
  community/
  components/
  context/
  exercise/
  fonts/
  globals.css
  layout.tsx
  login/
  nutrition/
  page.tsx
  profile/
  progress/
  register/
  workout/
Dockerfile
next-env.d.ts
next.config.ts
package.json
postcss.config.mjs
public/
README.md
tailwind.config.ts
tsconfig.json
```

## Environment Variables

The following environment variables need to be set in the `.env` file:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_EDAMAM_API_KEY`
- `NEXT_PUBLIC_EDAMAM_API_ID`
- `NEXT_PUBLIC_YOUTUBE_API_KEY`

## Deployment

The application is deployed using GitHub Actions and Google Cloud Run. The deployment workflow is defined in `ci.yaml`.

To deploy the application, push changes to the `main` branch or manually trigger the workflow using the GitHub Actions interface.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## Tech Stack

- Framework: Next.js with TypeScript
- Containerization: Docker
- Deployment: Google Cloud Run
- Styling: Tailwind CSS
- State Management: React Context API
- Icons: React Icons
- Charts: React Chart.js 2
- Date Picker: React Datepicker
- Video Player: React Player
- Font Management: Next Font
- Environment Variables: Dotenv

## Key Features

- User authentication
  - Sign Up: Allows users to create a new account.
  - Login: Enables users to access their account.
  - Forgot Password: Provides a way to reset the password if forgotten.
- Profile management
  - Users can add or update their personal information.
- Workout logging
  - Users can log, modify, view, and remove their workouts.
  - Users can filter workouts based on various Date Ranges.
  - custom date filters
- Nutrition tracking
  - search and save recipes
- Progress tracking
  - Users can view their weight, workouts over time with charts and statistics.
- Motivational Quotes
  -
- Search Fitness exercise Videos
  - 
