# CampusDesk — Student Record Management (React)

## Features
- Admin/student demo role selection
- Add, search, and delete student records
- Attendance marking by class, section, batch, subject, and date
- PDF assignment upload, viewing, and student submission
- Responsive dashboard UI
- Demo data saved in browser localStorage

## Run locally
1. Install Node.js (LTS).
2. Extract this ZIP and open the project folder in VS Code.
3. In a terminal, run:
   ```bash
   npm install
   npm run dev
   ```
4. Open the local URL printed by Vite.

## Important limitations
This is a frontend-only prototype. Login is a role selector, not secure authentication. Data is stored in the current browser's localStorage; PDF data URLs are also stored there, so this is suitable only for small demos. A production app needs a backend, database, real authentication/authorization, and file storage.
