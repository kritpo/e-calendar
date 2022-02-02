<div align="center">
	<a href="https://github.com/kritpo/e-calendar">
		<h1>E-Calendar</h1>
	</a>

Fully functional calendar API in Express.

![Continuous Integration](https://github.com/kritpo/e-calendar/actions/workflows/ci.yml/badge.svg?branch=main)
[![Test Coverage](https://api.codeclimate.com/v1/badges/161c5976566eadcb9893/test_coverage)](https://codeclimate.com/github/kritpo/e-calendar/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/161c5976566eadcb9893/maintainability)](https://codeclimate.com/github/kritpo/e-calendar/maintainability)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

## Getting Started

Follow these steps to run the application without any difficulties.

### `Clone Project`

Clone with `HTTPS`:

```sh
git clone https://github.com/kritpo/e-calendar.git
```

Clone with `SSH`:

```sh
git clone git@github.com:kritpo/e-calendar.git
```

### `Create .env files`

**_To use it with Docker, you only need to set-up the `production` file and skip to `Start Application` > `Start in production mode with Docker` part_**

Create for `development` in `.env`:

```env
### MongoDB ###
MONGODB_USERNAME=root
MONGODB_PASSWORD=p455w0rd
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_DATABASE=e_calendar

### E-Calendar ###
PORT=8080
SEED={a random seed}
ACCESS_TOKEN_EXPIRES_MINUTES=10
REFRESH_TOKEN_EXPIRES_MINUTES=60
```

Create for `test` in `.env.test`:

```env
### MongoDB ###
MONGODB_USERNAME=root
MONGODB_PASSWORD=p455w0rd
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_DATABASE=e_calendar_test

### E-Calendar ###
PORT=8081
SEED={a random seed}
ACCESS_TOKEN_EXPIRES_MINUTES=10
REFRESH_TOKEN_EXPIRES_MINUTES=60
```

Create for `production` in `.env.production`:

```env
### MongoDB ###
MONGODB_USERNAME=root
MONGODB_PASSWORD=p455w0rd
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_DATABASE=e_calendar

### E-Calendar ###
PORT=8090
SEED={a random seed}
ACCESS_TOKEN_EXPIRES_MINUTES=10
REFRESH_TOKEN_EXPIRES_MINUTES=60
```

### `Install Dependencies`

```sh
npm install
```

### `Start Dependencies Containers`

```sh
cd ./resources
docker-compose --env-file ../.env up

# the rest of commands need to be executed in the root directory
cd ..
```

### `Start Application`

Start in dev mode with hot-reload:

```sh
npm run dev
```

Start in test mode with hot-reload:

```sh
npm run test-watch
```

Start in production mode:

```sh
npm run full-start
```

Start in production mode with Docker:

```sh
docker-compose up
```

## Available Scripts

In the root directory, you can run:

### `npm start`

Runs the pre-transpiled application.\
Open [http://localhost:8080](http://localhost:8080) to view it in your browser.

No transpilation from `Typescript` to `Javascript` is realized in this command, it must be done manually.

### `npm run ts-start`

Runs the application in the dev mode.\
Open [http://localhost:8080](http://localhost:8080) to view it in your browser.

No generation from librairies is realized in this command, it must be done manually.

### `npm run lint`

Check and fix all `Typescript` errors in the code.

### `npm run tsoa`

Generate all necessary files of `TSOA`.\
It mainly generate documentation and routes specification.

All generated files are directly put into subfolders of `./src` directory.

### `npm run build`

Transpiled `Typescript` source code into `Javascript` code.

All transpiled files are directly put into `./dist` directory.

### `npm run clean`

Remove all files from `./dist` directory to ensure a clean output.

Should be used with `npm run build`

### `npm test`

Launches the test runner from pre-transpiled code with coverage support.

No transpilation from `Typescript` to `Javascript` is realized in this command, it must be done manually.

### `npm run copyfiles`

Copy all not `*.ts*` files into `./dist` directory.

### `npm run full-rebuild`

Generate a fully functional `Javascript` code into `./dist` directory.

Will take care of cleaning, librairies generations and `Typescript` to `Javascript` transpilation.

### `npm run full-start`

Runs the fully functional application in the production mode.\
Open [http://localhost:8090](http://localhost:8090) to view it in your browser.

Will take care of transpilation and application starting.

### `npm run test-watch`

Launches the test runner with coverage support and hot-reload.

Will take care of transpilation and tests starting.

### `npm run dev`

Runs the application in the development mode.\
Open [http://localhost:8080](http://localhost:8080) to view it in your browser.

Will take care of libraries generations and application starting.

## ST2EAP - Event-Driven Asynchronous Programming

### `RESTful API`

**_TODO_**

### `Input validation`

**_TODO_**

### `Authorisation`

**_TODO_**

### `Secret management`

**_TODO_**

### `Package management`

**_TODO_**

### `Documentation`

**_TODO_**

### `Error management`

**_TODO_**

### `Log management`

**_TODO_**

### `Asynchronous first`

**_TODO_**

### `DRY & code consistency`

**_TODO_**

### `Typescript + eslint`

**_TODO_**
