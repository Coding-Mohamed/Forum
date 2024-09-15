# Discussion Hub

Discussion Hub is a full-stack forum application built using Next.js, Convex, and Clerk for secure user authentication. Users can create, comment on, upvote, and downvote threads. The platform offers a responsive and engaging user experience, designed for seamless discussions and real-time updates.

## Features

- **User Authentication**: Secure signup and login using Clerk.
- **Thread Creation**: Users can create new discussion threads.
- **Commenting**: Add comments to existing threads and engage with other users.
- **Upvote/Downvote System**: Users can upvote or downvote threads to express opinions.
- **Real-Time Updates**: Discussions, comments, and votes update instantly.
- **Responsive Design**: Optimized for both mobile and desktop devices.

## Technologies

### Frontend

- **Next.js**: A powerful React-based framework for server-side rendering, static site generation, and routing.
- **Tailwind CSS**: A utility-first CSS framework for building responsive and highly customizable user interfaces.
- **TypeScript**: A typed superset of JavaScript that enhances code reliability and developer productivity.

### Backend

- **Convex**: A fully-managed backend service for data storage, server-side logic, and real-time updates.
- **Clerk**: A secure user authentication and session management service that simplifies user identity handling.
- **Next.js API Routes**: Built-in API routes in Next.js, allowing server-side logic and API handling without additional backend frameworks.

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Coding-Mohamed/Forum.git
cd Forum
```

```
cd forum
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and add your Convex and Clerk configuration:

```
# .env.local is used for local development

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Deployment used by `npx convex dev`
CONVEX_DEPLOYMENT=your_convex_deployment

NEXT_PUBLIC_CONVEX_URL=your_convex_url
```

### 4. Run the application

```bash
npm run dev
```

### Note

Excited to share my Fullstack Forum inspired by Reddit! This project is a work in progress, and I look forward to adding more features and improvements. Stay tuned for updates!
