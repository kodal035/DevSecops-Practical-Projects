# Project 01: Node + React + MySQL DevSecOps

This project is a practical DevSecOps learning example built with:

- Node.js API (`api`)
- React client (`client`)
- MySQL database
- Jenkins CI pipeline
- SonarQube code analysis
- Gitleaks secret scan
- Trivy filesystem scan

## Current Repository Structure

```text
Project-01-node-react-mysql-devsecops/
├── Jenkinsfile_CI
├── README.md
├── mysql-setup.md
├── api/
├── client/
└── pictures/
```

## Prerequisites

- Ubuntu or WSL2 Ubuntu
- Git
- Node.js (18+ recommended)
- npm
- MySQL Server
- Docker (for Jenkins and SonarQube)

Optional local tools if you run outside Jenkins:

- SonarScanner
- Gitleaks
- Trivy

## Quick Start

1. Clone repository.
2. Configure MySQL using `mysql-setup.md`.
3. Install backend dependencies.
4. Install frontend dependencies.
5. Start backend and frontend.

```bash
# from project root
cd api
npm install
npm start
```

```bash
# new terminal
cd client
npm install
npm start
```

Default local endpoints:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## Test Commands

### Frontend

```bash
cd client
CI=true npm test -- --coverage --runInBand
```

### Backend

```bash
cd api
npm test -- --coverage
```

## Jenkins Pipeline (Current)

Pipeline file: `Jenkinsfile_CI`

Current stage flow:

1. Git Checkout
2. Frontend Compilation (`node --check`)
3. Backend Compilation (`node --check`)
4. GitLeaks Scan
5. SonarQube Analysis
6. Quality Gate Check
7. Trivy FS Scan

### Jenkins Tools and Credentials

Configure these names in Jenkins:

- NodeJS tool: `nodejs23`
- SonarScanner tool: `sonar-scanner`
- SonarQube server name: `sonar`
- Sonar token credential id: `sonar-token`

## SonarQube Setup Notes

- Run SonarQube container on port `9000`.
- Set Jenkins SonarQube server name to `sonar`.
- Configure Sonar webhook:

```text
http://<jenkins-host>/sonarqube-webhook/
```

## Frontend Testing Note (Jest + Axios)

The client uses this Jest config in `client/package.json` to avoid Axios ESM transform issues in CRA/Jest:

```json
"jest": {
  "transformIgnorePatterns": [
    "node_modules/(?!(axios)/)"
  ]
}
```

## Implemented Unit Tests

- Frontend route guard test: `client/src/AlwaysPass.test.js`
- Backend auth middleware test: `api/middleware/auth.test.js`

## MySQL Setup

Use `mysql-setup.md` for SQL and setup steps.

Key DB objects:

- Database: `crud_app`
- Table: `users`

## Screenshots

Project screenshots are under `pictures/`.

### Main Page

![Main Page](pictures/main_page.png)

### Frontend - Login/Register View 1

![Frontend View 1](pictures/screencapture-localhost-3000-2026-04-13-20_50_40.png)

### Frontend - Login/Register View 2

![Frontend View 2](pictures/screencapture-localhost-3000-2026-04-13-20_51_38.png)

### Frontend - Dashboard

![Frontend Dashboard](pictures/screencapture-localhost-3000-dashboard-2026-04-13-20_52_23.png)

### Jenkins Pipeline

![Jenkins Pipeline](pictures/screencapture-localhost-8080-job-pipe1-2026-04-13-21_06_55.png)

### Jenkins Console Output

![Jenkins Console](pictures/screencapture-localhost-8080-job-pipe1-6-console-2026-04-13-20_11_05.png)

### SonarQube Webhook Settings

![SonarQube Webhooks](pictures/screencapture-localhost-9000-admin-webhooks-2026-04-13-21_07_24.png)

### SonarQube Dashboard

![SonarQube Dashboard](pictures/screencapture-localhost-9000-dashboard-2026-04-14-00_48_09.png)

### SonarQube Projects

![SonarQube Projects](pictures/screencapture-localhost-9000-projects-2026-04-13-21_07_44.png)

## Notes

- Keep secrets out of git (`.env`, tokens, passwords).
- If `git status` shows incorrect ahead/behind after push, run:

```bash
git fetch origin
git status
```
