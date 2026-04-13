# PROJECT-1: DevSecOps Starter Project

PROJECT-1 is a beginner-friendly DevSecOps sample application built around a simple 3-tier architecture. It combines a Node.js API, a React frontend, a MySQL database, and a Jenkins pipeline with security checks.

This repository is designed for learning how a basic full-stack application becomes a DevSecOps workflow with automation, static analysis, and security scanning.

## Platform Note

This project is prepared for Ubuntu OS.

If you are on Windows, you can complete the full setup by installing Ubuntu on WSL and following the same steps in this guide.

## Project Highlights

- Node.js backend
- React frontend
- MySQL database
- Jenkins CI pipeline
- SonarQube static analysis
- Gitleaks secret scanning
- Trivy filesystem scanning

## Repository Structure

```text
PROJECT-1/
├── Jenkinsfile_CI
├── README.md
├── today-README.md
├── mysql-setup.md
├── api/
└── client/
```

The folder structure matters because the Jenkins pipeline depends on these paths.

## Application Flow

1. Pull the project from remote to your local machine.
2. Create your own GitHub repository and push your local project.
3. Install Docker on your machine.
4. Start Jenkins and SonarQube with Docker.
5. Complete Jenkins setup (plugins, tools, credentials, SonarQube server, webhook).
6. Prepare and configure MySQL first, then install project dependencies.
7. Review Jenkinsfile stages and run the pipeline.
8. Start and verify the application.

## Prerequisites

This guide is designed for a clean machine setup from scratch.

Install the following prerequisites on your machine (in setup order):

1. Docker
2. Git
3. Node.js 18 or later
4. npm
5. MySQL Server

Optional but recommended for this project:

- SonarScanner
- Gitleaks
- Trivy

## Repository Bootstrap (First Step)

Before any tool setup, bring the project to your local machine and connect it to your own GitHub repository.

### 1. Clone the original repository

```bash
git clone <source-repo-url>
cd DevSecops-Practical-Projects
```

### 2. Create your own empty GitHub repository

Create a new repository from GitHub UI (without README/license/gitignore).

### 3. Point local repo to your own GitHub remote and push

```bash
git remote rename origin upstream
git remote add origin <your-github-repo-url>
git push -u origin main
```

If your default branch is `master`, replace `main` accordingly.

## Docker Installation (Ubuntu / WSL)

If Docker is not installed yet, use the following commands.

### 1. Remove old Docker packages (if any)

```bash
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove -y $pkg; done
```

### 2. Add Docker's official GPG key and repository

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
	"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
	$(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
	sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

### 3. Install Docker Engine and plugins

```bash
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin
```

### 4. Verify installation

```bash
sudo docker --version
sudo docker run hello-world
```

### 5. Optional: run Docker without sudo

```bash
sudo usermod -aG docker $USER
newgrp docker
docker --version
```

After Docker is ready, continue with Jenkins and SonarQube Docker steps below.

## Quick Start (Docker-First)

Use this order if you want the fastest local setup.

1. Clone from remote and push to your own GitHub repository.
2. Install Docker.
3. Start Jenkins with Docker.
4. Start SonarQube LTS with Docker.
5. Configure Jenkins plugins, tools, credentials, and SonarQube webhook.
6. Prepare and configure MySQL first, then install project dependencies.
7. Run Jenkins pipeline and verify localhost pages.

## Jenkins Setup (Docker)

This project uses Jenkins running in Docker.

### 1. Start Jenkins container

If you want to recreate the local Jenkins server with Docker, use:

```bash
docker volume create jenkins_home
docker network create devsecops-net

docker run -d \
	--name jenkins \
	--restart unless-stopped \
	-p 8080:8080 \
	-p 50000:50000 \
	-v jenkins_home:/var/jenkins_home \
	--network devsecops-net \
	jenkins/jenkins:lts-jdk17
```

Open Jenkins at:

```text
http://localhost:8080
```

### 2. First Jenkins login

When Jenkins starts for the first time, it asks for the initial admin password.

You can retrieve it with:

```bash
docker exec -it jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

After login, when Jenkins asks for plugin installation, you can choose:

- Skip and continue as admin

Then do the minimum setup manually:

1. Create your admin user and change the password.
2. Continue to Jenkins dashboard.

### 3. Install required Jenkins plugins

Install these plugins from `Manage Jenkins > Plugins`:

- Git plugin
- Pipeline plugin
- NodeJS plugin
- SonarQube Scanner for Jenkins
- Credentials Binding plugin

Optional but useful:

- Workspace Cleanup
- Timestamper
- Blue Ocean

### 4. Configure Jenkins system tools

Configure these tools from `Manage Jenkins > Tools`:

- NodeJS name: `nodejs23`
- SonarScanner name: `sonar-scanner`

The Jenkinsfile expects these exact names. If you use different names, update the pipeline accordingly.

### 5. Create Jenkins credentials

Create these credentials from `Manage Jenkins > Credentials`:

- `github-token`: GitHub access token or username/password
- `sonar-token`: SonarQube token saved as `Secret text`

### 6. Configure SonarQube server in Jenkins

Go to `Manage Jenkins > System` and configure:

- SonarQube server name: `sonar`
- SonarQube server URL: your local SonarQube address
- SonarQube authentication token: select `sonar-token`

If the pipeline uses `checkout scmGit`, make sure the repository URL and branch name match your actual project.

Add your installation reference links here:

- Jenkins installation link: `<add-link-here>`
- Jenkins plugin guide: `<add-link-here>`

## SonarQube LTS Setup (Docker)

The project uses a local SonarQube instance running in Docker.

### 1. Start SonarQube container

```bash
docker run -d \
	--name sonarqube \
	--restart unless-stopped \
	-p 9000:9000 \
	--network devsecops-net \
	sonarqube:lts-community
```

Open SonarQube at:

```text
http://localhost:9000
```

### 2. First SonarQube login

Default first login:

- Username: `admin`
- Password: `admin`

On first login, SonarQube will ask you to change the default password.

### 3. Create Sonar token for Jenkins

Generate token from `My Account > Security > Generate Tokens` and save it in Jenkins as `sonar-token`.

### 4. Create SonarQube project

Create a new project from `Projects > Create project`.

You can use:

- Project name: `Nodejs-Project`
- Project key: `Nodejs-Project`

Or choose any other name, as long as the Jenkins pipeline and SonarScanner configuration use the same key.

Add your installation reference links here:

- SonarQube installation link: `<add-link-here>`
- SonarQube Docker documentation: `<add-link-here>`

## Source Code Setup

### 0. Create local environment file (security-first)

```bash
cd api
cp .env.example .env
```

Then edit `api/.env` with your own local values.
Do not commit real secrets to GitHub.

### Backend dependencies

```bash
cd api
npm install
```

### Frontend dependencies

```bash
cd ../client
npm install
```

## Running the Application Manually

### Start backend

```bash
cd api
npm start
```

### Start frontend

```bash
cd client
npm start
```

By default, the frontend runs on `http://localhost:3000`.

## Localhost Access Map

Use these URLs after setup:

- Jenkins: `http://localhost:8080`
- SonarQube: `http://localhost:9000`
- Backend API: `http://localhost:5000`
- Frontend App: `http://localhost:3000`

Recommended validation flow:

1. Open Jenkins and confirm pipeline is visible.
2. Open SonarQube and confirm project and token are ready.
3. Start backend and check API health or auth endpoints.
4. Start frontend and open the dashboard/login pages.

## MySQL Setup

The application uses MySQL for user data storage.

Follow the steps in `mysql-setup.md` to:

- install MySQL
- configure the root account
- create the `crud_app` database
- create the `users` table

### Example MySQL commands

```bash
sudo apt update
sudo apt install mysql-server -y
sudo mysql -u root -p   ### password=Aditya
```

Inside MySQL, you can prepare the project database like this:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Aditya';
FLUSH PRIVILEGES;
EXIT;


CREATE DATABASE IF NOT EXISTS crud_app;
USE crud_app;

CREATE TABLE IF NOT EXISTS users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	role ENUM('admin', 'viewer') NOT NULL DEFAULT 'viewer',
	is_active TINYINT(1) DEFAULT 1,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Jenkins Pipeline Overview

The `Jenkinsfile_CI` pipeline includes the following stages:

1. Git Checkout
2. Frontend Compilation
3. Backend Compilation
4. Gitleaks Scan
5. SonarQube Analysis
6. Quality Gate Check
7. Trivy FS Scan
8. Install Dependencies
9. Run Application

### Jenkins configuration values

The pipeline expects these names to exist in Jenkins:

- NodeJS tool: `nodejs23`
- SonarQube server: `sonar`
- SonarScanner tool: `sonar-scanner`
- Git credentials: `github-token`
- Sonar token credentials: `sonar-token`

### SonarQube webhook

For the Quality Gate step to work correctly, SonarQube should send a webhook to Jenkins:

```text
http://JENKINS_URL/sonarqube-webhook/
```

Without this webhook, the Jenkins pipeline may wait indefinitely or fail during the Quality Gate stage.

### Pipeline name alignment

If you create the SonarQube project with a different name, update these values consistently:

- Jenkinsfile SonarScanner project key
- SonarQube project key
- Jenkins job configuration

Keeping the same name across Jenkins and SonarQube avoids analysis and Quality Gate mismatches.

## What This Project Demonstrates

This repository is a practical example of a DevSecOps learning project. It shows how to:

- build a simple full-stack app
- connect the app to a database
- define a CI pipeline
- add security checks into automation
- prepare the project for code quality review

## Suggested Sharing Summary

If you want to share this project on LinkedIn or Medium, you can describe it as:

> A DevSecOps starter project that combines Node.js, React, MySQL, Jenkins, SonarQube, Gitleaks, and Trivy to demonstrate a practical secure CI workflow.



## Notes

This project is intentionally simple so that beginners can focus on the DevSecOps workflow rather than complex application logic.

The main learning goals are:

- understanding project structure
- preparing backend and frontend services
- wiring Jenkins correctly
- validating security and quality gates
