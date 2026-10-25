# NEXORA Java Backend (Spring Boot + MySQL)

This is a Java REST backend intended to connect to the existing React + TypeScript + Vite frontend from the AI Studio ZIP. It preserves the frontend's `/api/...` routes and JSON field names for the main student, faculty, and HOD screens.

## Technology
- Java 17+
- Spring Boot 3.4.5
- Spring Web (REST API)
- Spring Data JPA
- MySQL 8+

## Important scope notes
- The supplied student records are demo/seed data copied from the AI Studio project. Do not treat them as real institutional records.
- Passwords are demo-only and intentionally match the frontend project's demo login flow. Do not deploy this as a real college authentication system without replacing it with secure password hashing/identity verification and session expiry.
- The LeetCode endpoint saves the entered username but does not fetch live LeetCode statistics.
- AI insight currently returns the same rule-based fallback style as the existing frontend backend when no generative AI provider is configured. The placement-readiness calculation is a demo estimate, not validated placement prediction.
- Auth sessions are held in memory and are cleared when the backend restarts. Student profile data is persisted in MySQL.

## 1. Install prerequisites
1. Install JDK 17 or newer.
2. Install Maven 3.9+.
3. Install MySQL 8 and make sure the MySQL service is running.
4. Open this folder in VS Code and install the Java Extension Pack if needed.

## 2. Create database
Open MySQL Workbench or a MySQL terminal and run:

```sql
CREATE DATABASE nexora_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Edit `src/main/resources/application.properties` or set environment variables:
- `DB_URL` (default: `jdbc:mysql://localhost:3306/nexora_db?...`)
- `DB_USERNAME` (default: `root`)
- `DB_PASSWORD` (set your own MySQL password)

Example PowerShell terminal, for this terminal session only:

```powershell
$env:DB_USERNAME="root"
$env:DB_PASSWORD="YOUR_MYSQL_PASSWORD"
```

Hibernate creates/updates the `student_records` table on startup. If the table is empty, the backend imports the bundled 100 demo student profiles. Each profile is stored as JSON plus searchable student columns.

## 3. Start the Java backend
From this folder:

```powershell
mvn spring-boot:run
```

Backend base URL: `http://localhost:8080`
Health check: `http://localhost:8080/api/regression/model`

If you use the VS Code terminal, run commands from the folder containing `pom.xml`.

## 4. Connect the existing frontend
Keep your original AI Studio frontend folder separate. In its `vite.config.ts`, add a proxy under `server` while preserving the existing plugins, aliases, and watch/HMR settings:

```ts
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
  },
},
```

For example, the existing `server` object should contain both its current `hmr` and `watch` settings and the new `proxy` property. Then in the frontend folder run:

```powershell
npm install
npm run dev
```

Open the Vite URL printed in the terminal, normally `http://localhost:5173`. The frontend's relative `/api/...` requests will be forwarded to the Java backend. Run the backend and frontend in two separate terminals.

## 5. Demo login accounts
Use an account from the seed data. Example accounts:

- HOD: `hod.aids@eec.srmrmp.edu.in`, role `HOD`, demo password `password`
- Faculty: `sarah.jenkins@eec.srmrmp.edu.in`, role `Faculty`, demo password `password`
- Student: choose a seeded student's register number and matching email, e.g. `310625243001` and `310625243001@eec.srmrmp.edu.in`, role `Student`, demo password `password`

These are for local demonstration only. They are not real institutional accounts.

## API routes implemented
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/student/me`
- `POST /api/student/me/leetcode`
- `GET /api/student/me/rank`
- `GET /api/student/me/readiness`
- `GET /api/student/me/ai-insight`
- `GET /api/faculty/dashboard`
- `GET /api/faculty/students?year=ALL&section=ALL&q=`
- `GET /api/faculty/class-progress`
- `GET /api/hod/department-overview`
- `GET /api/hod/comparison`
- `GET /api/hod/reports`
- `GET /api/regression/model`
- `GET /api/regression/predict?totalSolved=100`

## Troubleshooting
- `Communications link failure`: ensure MySQL is running and `DB_PASSWORD` is correct.
- `Access denied for user`: update DB username/password in the environment or properties.
- Frontend shows API errors: verify backend runs on port 8080 and the Vite proxy was added, then restart `npm run dev`.
- Port 8080 already in use: change `server.port` in `application.properties` and update the Vite proxy target.
- Login sessions reset after backend restart: expected in this demo implementation.

## Academic OOP concepts to explain
- Encapsulation: `StudentRecord` keeps fields private and exposes getters/setters.
- Abstraction: controller endpoints hide database and data-processing details from the frontend.
- Separation of concerns: controller, service, repository, and entity classes each have a focused responsibility.
- Interface-based programming: `StudentRecordRepository` extends Spring Data JPA's repository interface.

Do not claim the project uses inheritance/polymorphism as a major domain feature unless you add and demonstrate a specific example; Spring itself uses inheritance/interfaces internally, but your report should describe what your code actually implements.
