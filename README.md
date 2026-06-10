Potential Argument

A web app to catalog, manage, and analyze logical arguments by category.

## Tech Stack
- **Frontend:** React, TypeScript, Tailwind CSS, Recharts, Framer Motion
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL, Drizzle ORM
- **Auth:** Passport.js (session-based)

## Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/Monikasakthivel07/Potential-Argument.git
cd Potential-Argument
npm install
```

### 2. Setup Environment
Create a `.env` file:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/argument_retention_db
SESSION_SECRET=your-secret-key
NODE_ENV=development
PORT=5000
```

### 3. Run
```bash
npm run db:push   # Setup database
npm run dev       # Start development server
```

App runs at `http://localhost:5000`


## Features
- Create, filter, search, and delete arguments
- Classify arguments by archetype: Technical, Business, Research, Educational
- Dashboard with stats and recent entries
- Analytics with pie and bar charts


## Author

**MONIKA S**

B.Tech Information Technology

GitHub: https://github.com/Monikasakthivel07

## License

This project is intended for educational and learning purposes. Feel free to use, modify, and extend the project with proper attribution.

*
