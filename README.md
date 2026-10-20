# 🌌 Star Wars Character Gallery

A responsive Star Wars character gallery built with **Next.js 16**, **React 19**, and **TypeScript**. Character data is provided by the [Star Wars API (SWAPI)](https://swapi.dev/).

The app lets you browse characters, search by name, filter the current results by gender and homeworld, and open a detailed view for each character. Character portraits are served from the repository's local `public/people` directory.

## Features

- Browse Star Wars characters from SWAPI.
- Search characters by name.
- Filter the characters on the current page by gender and homeworld.
- Navigate between result pages with pagination.
- Open a modal with additional character details, including homeworld, films, species, starships, and vehicles.
- Display local character portraits with Next.js `Image`.
- Run production builds with Next.js standalone output.
- Build and run the production app in Docker.

## Tech stack

- [Next.js 16](https://nextjs.org/)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [SWAPI](https://swapi.dev/)
- [react-paginate](https://github.com/AdeleD/react-paginate)
- ESLint flat config with `@eslint/js`, `typescript-eslint`, and `globals`
- Docker multi-stage build with Node.js 22 Alpine

Versions and scripts are defined in `package.json`.

## Requirements

For local development, install:

- [Node.js 22](https://nodejs.org/) (recommended to match the Docker image)
- npm
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) if you want to use Docker

## Getting started

Clone the repository and install dependencies:

```bash
git clone https://github.com/Deniel11/star-wars.git
cd star-wars
npm ci
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create a production build using webpack and prepare the standalone output. |
| `npm run start` | Run the generated standalone production server. |
| `npm run lint` | Run ESLint. |
| `npm run typecheck` | Check TypeScript types without emitting files. |

For a production run outside Docker, build first:

```bash
npm run build
npm run start
```

The standalone launcher binds to `0.0.0.0` and prints a local URL (`http://localhost:3000`) and a LAN URL when a non-internal IPv4 address is available. The port can be overridden with the `PORT` environment variable.

## Docker

The repository includes a multi-stage `Dockerfile` and a `.dockerignore` file. The image builds the application and runs the Next.js standalone server as the non-root `node` user.

### Build the image

Run this command from the repository root, where `Dockerfile` and `package-lock.json` are located:

```bash
docker build -t star-wars:latest .
```

### Run the container

The current `Dockerfile` configures the app to listen on port **18240** inside the container:

```bash
docker run --name star-wars-app --rm -p 18240:18240 star-wars:latest
```

Open [http://localhost:18240](http://localhost:18240).

To use a different host port while keeping the container's port unchanged, map for example host port `3000` to container port `18240`:

```bash
docker run --name star-wars-app --rm -p 3000:18240 star-wars:latest
```

Then open [http://localhost:3000](http://localhost:3000).

Stop the running container with `Ctrl+C` in the terminal. Since `--rm` is used, Docker removes the container when it stops.

> **Note:** The Docker port is configured separately from the local `npm run start` default. If you change `PORT` or the `EXPOSE` value in the Dockerfile, keep the port inside the `docker run -p HOST_PORT:CONTAINER_PORT` mapping consistent.

## How to use the gallery

- **Search:** enter a character name in the search field. The app requests matching results from SWAPI.
- **Filter:** choose a gender or homeworld to narrow the characters shown on the current API page.
- **Pagination:** use the previous/next controls to navigate between pages.
- **Character details:** select a character to open the detail modal with more information from SWAPI.

## Project structure

```text
.
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
│   └── people/              # Local character portraits
├── scripts/
│   ├── prepare-standalone.mjs
│   └── start-standalone.mjs
├── Dockerfile
├── .dockerignore
├── eslint.config.mjs
├── next.config.mjs
├── package.json
├── package-lock.json
└── tsconfig.json
```

## API

Character information is fetched from [SWAPI](https://swapi.dev/). The application makes additional requests for related homeworld, film, species, starship, and vehicle details. Internet access is required for those API requests to work.

## Recent maintenance

The current codebase includes these updates:

- Upgraded the app to Next.js 16 and React 19.
- Updated ESLint to use a flat configuration with explicit JavaScript and TypeScript rules.
- Replaced untyped `any` values in the character list and pagination handling with explicit TypeScript types.
- Switched character portraits to `next/image`.
- Enabled Next.js standalone output and added scripts to prepare and launch it.
- Added a multi-stage Docker image and Docker build exclusions.
- Renamed the default Git branch to `main`.

## License

No license is specified in this repository. Contact the repository owner before redistributing the project or its assets.
