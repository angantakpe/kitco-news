# Kitco News Articles Management Platform

## Project Structure

The project is structured as follows:

```
kitco-news/
│-- backend/           # Backend Next.js application (Node.js + Express + Mongoose)
│-- frontend/          # Frontend Next.js application
│-- docker/            # Dockerfiles for backend and frontend
│-- kubernetes/        # Kubernetes deployment manifests
│-- .env.example       # Example environment variables file
│-- Makefile           # Command shortcuts for Docker and Kubernetes
│-- README.md          # Project documentation
```

### Explanation of Directories
- **backend/**: Contains the Next.js backend application using Node.js, Express, and Mongoose.
- **frontend/**: The Next.js frontend application with React components and Chakra UI.
- **docker/**: Stores Dockerfiles used to build the frontend and backend containers.
- **kubernetes/**: Kubernetes manifests to deploy the application in a cluster environment.
- **.env.example**: Template for environment variables to configure the application.
- **Makefile**: Provides command shortcuts for building, running, and deploying the project.

## How to Start the Project

### Prerequisites
Ensure you have the following installed:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)
- [Make](https://www.gnu.org/software/make/)

### Steps to Run the Project

1. **Clone the Repository:**
   ```bash
   git clone git@github.com:angantakpe/kitco-news.git
   cd kitco-news
   ```

2. **Copy Environment Variables Template:**
   ```bash
   cp .env.example .env
   ```

3. **Build the Services:**
   ```bash
   make build
   ```

4. **Start All Services:**
   ```bash
   make up
   ```

5. **Access the Application:**
   - Frontend: [http://localhost:3001](http://localhost:3001)
   - Backend API: [http://localhost:3000](http://localhost:3000)

6. **Stop the Services:**
   ```bash
   make down
   ```

### Explanation of Makefile Commands

```bash
make build           # Builds backend and frontend services
make up              # Starts all services in detached mode
make down            # Stops all running services
make restart         # Restarts the containers
make logs            # Shows logs of running services
make clean           # Stops and removes containers and volumes
make backend-shell   # Opens a shell in the backend container
make frontend-shell  # Opens a shell in the frontend container
make deploy          # Deploy the application to Kubernetes
make delete          # Delete Kubernetes resources
make help            # Displays help information
```

## License

The Kitco News Articles Management Platform is licensed under the terms of the MIT license.

