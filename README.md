Kitco News Articles Management Platform

Technology Stack and Features

⚡ Node.js with Express for the backend API.

🧰 Mongoose for MongoDB interactions.

💾 MongoDB as the NoSQL database.

🚀 Next.js for the frontend.

💃 Using TypeScript, hooks, Vite, and other parts of a modern frontend stack.

🎨 Chakra UI for the frontend components.

🤖 An automatically generated frontend client.

🧪 Playwright for End-to-End testing.

🦇 Dark mode support.

🐋 Docker Compose for development and production.

🔒 Secure password hashing by default.

🔑 JWT (JSON Web Token) authentication.

📫 Email-based password recovery.

✅ Tests with Jest.

📞 Traefik as a reverse proxy / load balancer.

🚢 Deployment instructions using Docker Compose, including how to set up a frontend Traefik proxy to handle automatic HTTPS certificates.

🏭 CI (continuous integration) and CD (continuous deployment) based on GitHub Actions.

☸️ Kubernetes deployment with manifests for scalable and flexible deployments.

Project Structure

kitco-news/
│-- backend/          # Backend Node.js application
│-- frontend/         # Frontend Next.js application
│-- docker/           # Dockerfiles for backend and frontend
│-- kubernetes/       # Kubernetes deployment manifests
│-- .env.example      # Environment variables example
│-- Makefile          # Command shortcuts
│-- README.md         # Project documentation

Dashboard Login



Dashboard - Create User



Dashboard - Articles



Interactive API Documentation



How To Use It

You can just fork or clone this repository and use it as is.

✨ It just works. ✨

How to Use a Private Repository

If you want to have a private repository, GitHub won't allow you to simply fork it as it doesn't allow changing the visibility of forks.

But you can do the following:

Create a new GitHub repo, for example kitco-news.

Clone this repository manually, set the name with the name of the project you want to use, for example kitco-news:

git clone git@github.com:angantakpe/kitco-news.git kitco-news

Enter into the new directory:

cd kitconews

Explanation of Makefile Commands

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

License

The Full Stack Node.js Template is licensed under the terms of the MIT license.

