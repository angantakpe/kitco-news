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

## Frontend Application (Next.js)

The frontend is built with Next.js 13+ and includes the following features:

### Key Features
- **Modern UI**: Built with Chakra UI for a beautiful and responsive design
- **Article Management**: Create, edit, and delete articles
- **AI Integration**: Generate, translate, and summarize articles using AI
- **Multi-language Support**: Support for English and French content
- **Real-time Updates**: Instant updates when articles are modified
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Tech Stack
- Next.js 13+
- React 18
- Chakra UI
- SWR for data fetching
- React Query for server state management
- TypeScript for type safety

### Development Setup

1. **Install Dependencies:**
   ```bash
   cd frontend
   yarn install
   ```

2. **Set Environment Variables:**
   ```bash
   cp .env.example .env.local
   ```
   Configure the following variables:
   - `NEXT_PUBLIC_API_URL`: Backend API URL
   - `NEXT_PUBLIC_AI_API_KEY`: API key for AI services

3. **Run Development Server:**
   ```bash
   yarn dev
   ```
   Access the app at [http://localhost:3001](http://localhost:3001)

4. **Build for Production:**
   ```bash
   yarn build
   yarn start
   ```

### Available Scripts
- `yarn dev`: Start development server
- `yarn build`: Build for production
- `yarn start`: Start production server
- `yarn lint`: Run ESLint
- `yarn test`: Run tests
- `yarn type-check`: Run TypeScript checks

## Backend Application

[Backend documentation remains the same...]

## How to Start the Project

### Prerequisites
Ensure you have the following installed:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)
- [Make](https://www.gnu.org/software/make/)
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Yarn](https://yarnpkg.com/)

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
   - API Documentation: [http://localhost:3000/v1/docs](http://localhost:3000/v1/docs)

6. **Stop the Services:**
   ```bash
   make down
   ```

### Makefile Commands

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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

The Kitco News Articles Management Platform is licensed under the terms of the MIT license.

