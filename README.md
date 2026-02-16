# Brain Rot Web App

A survey application for collecting research data on video content and cognitive load.

## Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd brain-rot-web-app
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file in the root directory and add your MongoDB credentials:
```env
MONGODB_URI=your_mongodb_connection_string_here
MONGODB_DB_NAME=brain-rot-study
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app/survey` - Survey flow and data collection
- `/components/survey` - Survey step components
- `/app/api` - API routes for survey submission and video management

## Tech Stack

- Next.js 16
- React 19
- MongoDB
- TypeScript
- Tailwind CSS
