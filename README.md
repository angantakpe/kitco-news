# Kitco News Articles Management Platform


## Technology Stack and Features

- ⚡ [**FastAPI**](https://fastapi.tiangolo.com) for the Python backend API.
    - 🧰 [SQLModel](https://sqlmodel.tiangolo.com) for the Python SQL database interactions (ORM).
    - 🔍 [Pydantic](https://docs.pydantic.dev), used by FastAPI, for the data validation and settings management.
    - 💾 [PostgreSQL](https://www.postgresql.org) as the SQL database.
- 🚀 [React](https://react.dev) for the frontend.
    - 💃 Using TypeScript, hooks, Vite, and other parts of a modern frontend stack.
    - 🎨 [Chakra UI](https://chakra-ui.com) for the frontend components.
    - 🤖 An automatically generated frontend client.
    - 🧪 [Playwright](https://playwright.dev) for End-to-End testing.
    - 🦇 Dark mode support.
- 🐋 [Docker Compose](https://www.docker.com) for development and production.
- 🔒 Secure password hashing by default.
- 🔑 JWT (JSON Web Token) authentication.
- 📫 Email based password recovery.
- ✅ Tests with [Pytest](https://pytest.org).
- 📞 [Traefik](https://traefik.io) as a reverse proxy / load balancer.
- 🚢 Deployment instructions using Docker Compose, including how to set up a frontend Traefik proxy to handle automatic HTTPS certificates.
- 🏭 CI (continuous integration) and CD (continuous deployment) based on GitHub Actions.

### Dashboard Login

[![API docs](img/login.png)](https://github.com/angantakpe/kitco-news)

### Dashboard - Create User

[![API docs](img/dashboard-create.png)](https://github.com/angantakpe/kitco-news)

### Dashboard - Articles

[![API docs](img/dashboard-articles.png)](https://github.com/angantakpe/kitco-news)

### Interactive API Documentation

[![API docs](img/docs.png)](https://github.com/angantakpe/kitco-news)

## How To Use It

You can **just fork or clone** this repository and use it as is.

✨ It just works. ✨

### How to Use a Private Repository

If you want to have a private repository, GitHub won't allow you to simply fork it as it doesn't allow changing the visibility of forks.

But you can do the following:

- Create a new GitHub repo, for example `my-full-stack`.
- Clone this repository manually, set the name with the name of the project you want to use, for example `my-full-stack`:

```bash
git clone git@github.com:kitconews/kitconews.git kitconews
```

- Enter into the new directory:

```bash
cd kitconews

Explanation of Makefile Commands:
make build – Builds backend and frontend services.
make up – Starts all services in detached mode.
make down – Stops all running services.
make restart – Restarts the containers.
make logs – Shows logs of running services.
make clean – Stops and removes containers and volumes.
make backend-shell – Opens a shell in the backend container.
make frontend-shell – Opens a shell in the frontend container.
make help – Displays help information.
```

## License

The Full Stack FastAPI Template is licensed under the terms of the MIT license.
