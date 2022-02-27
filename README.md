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

No generation from librairies is realized in this command, it must be done manually.

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

No generation from librairies is realized in this command, it must be done manually.

### `npm run clean`

Remove all files from `./dist` directory to ensure a clean output.

Should be used with `npm run build`

### `npm test`

Launches the test runner from pre-transpiled code with coverage support.

No generation from librairies is realized in this command, it must be done manually.

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

### Checkpoints report for the project

You **MUST** append a filled copy of this document at the end of your `README.MD`.

This document serves three main purposes:

-   providing you a clear list of my expectations (check each point when done) ;
-   ensuring I do not miss some of your engineering during the review ;
-   asking for additional information that helps me during the review.

#### Notice

Check every applicable checkbox in the above list. For each one, provide the requested additional information.

In your explanation, please provide links (file + line) to relevant parts of your source code and tests if applicable.

##### Caption

🔵 means the checkbox is mandatory. If missing or absolutely not satisfying, it may cost you 0.5 penalty point.

#### Expectations

##### GraphQL API only

-   [ ] Reduce code duplication for the various involved schemas (of the database, of the ORM, of GraphQL...). **[1 point]** 🔵

    > How did you achieve this?

-   [ ] Mitigation(s) against too complex GraphQL queries, arbitrary deep nested object fetching or related DoS. **[1 point per mitigation, up to 2]**

    > Quote and explain each mitigation.

-   [ ] Any security or performance improvement related to your GraphQL implementation, as optionally highlighted in the subject? points]\*\*
    > Explain each improvement.

##### Input validation

-   [x] Strictly and deeply validate the type of every input (`params, querystring, body`) at runtime before any processing. **[1 point]** 🔵

    > How did you achieve this?

    _[`TSOA`](https://github.com/lukeautry/tsoa) generate routes with validations according to in-code TS specifications and so OpenAPI, the generated API doc, schemas. It bases its generation from templates, the validation is done [here](https://github.com/lukeautry/tsoa/blob/60eaac0eb23ee1d0991f82fae45940b009ad7a27/packages/cli/src/routeGeneration/templates/express.hbs#L229)._

-   [x] Ensure the type of every input can be inferred by Typescript at any time and properly propagates across the app. **[1 point]** 🔵

    > How did you achieve this?

    _All collections in the project are based into 3 main code files, including `Collection.ts` with `Collection` the name of the collection, which contains all types definitions for the specific collection. [Here](https://github.com/kritpo/e-calendar/blob/050732b1e54efe0ce0e84def8bbc37d53a30ffcf/src/User/User.ts) for User, [here](https://github.com/kritpo/e-calendar/blob/050732b1e54efe0ce0e84def8bbc37d53a30ffcf/src/Calendar/Calendar.ts) for Calendar and [here](https://github.com/kritpo/e-calendar/blob/050732b1e54efe0ce0e84def8bbc37d53a30ffcf/src/Event/Event.ts) for Event_

-   [x] Ensure the static and runtime input types are always synced. **[1 point]** 🔵

    > How did you achieve this? If extra commands must be run before the typescript checking, how do you ensure there are run?

    _Thanks to [`TSOA`](https://github.com/lukeautry/tsoa), all incoming data are checked and ensured to be strictly compliant with the TS types, as extras params are expected to throw validation error too, as you can see [here](https://github.com/kritpo/e-calendar/blob/050732b1e54efe0ce0e84def8bbc37d53a30ffcf/tsoa.json#L27). As TSOA works as a middleware by generating routes code, it must be executed after each updates and so before launching the app. To ensure that the command is executed, all AIO(All In One) commands includes it: [here](https://github.com/kritpo/e-calendar/blob/050732b1e54efe0ce0e84def8bbc37d53a30ffcf/nodemon.json#L5) for `run dev`, [here](https://github.com/kritpo/e-calendar/blob/050732b1e54efe0ce0e84def8bbc37d53a30ffcf/package.json#L36) for `npm run test-watch` and `npm run full-start`, [here](https://github.com/kritpo/e-calendar/blob/050732b1e54efe0ce0e84def8bbc37d53a30ffcf/Dockerfile#L16) for `docker-compose up`; for the specific commands it is the responsibility of the user to ensure that the specific command is correctly executed as specified above in the README._

##### Authorisation

-   [x] Check the current user is allowed to call this endpoint. **[1 point]** 🔵

    > How did you achieve this?

    _Each paths are protected by an authentication check done by TSOA [here](https://github.com/lukeautry/tsoa/blob/60eaac0eb23ee1d0991f82fae45940b009ad7a27/packages/cli/src/routeGeneration/templates/express.hbs#L120) through our authentication function [here](https://github.com/kritpo/e-calendar/blob/050732b1e54efe0ce0e84def8bbc37d53a30ffcf/src/utils/tsoa/authentification.ts#L25). Then through [our wrapper](https://github.com/kritpo/e-calendar/blob/050732b1e54efe0ce0e84def8bbc37d53a30ffcf/src/utils/response/generateResponse.ts#L29), each endpoint can manage authorizations and also others HTTP errors according to specifications._

-   [x] Check the current user is allowed to perform the action on a specific resource. **[1 point]** 🔵

    > How did you achieve this?

    _The authorization check is done directly in the controller depending on the restriction of each endpoint like [here](https://github.com/kritpo/e-calendar/blob/050732b1e54efe0ce0e84def8bbc37d53a30ffcf/src/Calendar/CalendarController.ts#L148)._

-   [x] Did you build or use an authorisation framework, making the authorisation widely used in your code base? **[1 point]**

    > How did you achieve this?

    _Authorization is based from two different files: [here](https://github.com/kritpo/e-calendar/blob/050732b1e54efe0ce0e84def8bbc37d53a30ffcf/src/utils/security/AuthorizationService.ts) for ressources specific authorizations and [here](https://github.com/kritpo/e-calendar/blob/050732b1e54efe0ce0e84def8bbc37d53a30ffcf/src/utils/response/generateResponse.ts#L29) for managing authorization (and so others errors) in a main component._

-   [ ] Do you have any way to ensure authorisation is checked on every endpoint? **[1 point]**
    > It is pretty easy to forget authorising some action.
    > For obvious reasons, it may lead to security issues and bugs.
    > At work, we use `varvet/pundit` in our `Ruby on Rails` stack. It can raise exception just before answering the client if authorisation is not checked.
    > https://github.com/varvet/pundit#ensuring-policies-and-scopes-are-used
    >
    > How did you achieve this?

##### Secret and configuration management

-   [x] Use a hash for any sensitive data you do not need to store as plain text. 🔵

    > Also check this if you do not store any password or such data (and say it here).

    _Passwords are hashed [here](https://github.com/kritpo/e-calendar/blob/050732b1e54efe0ce0e84def8bbc37d53a30ffcf/src/User/UserService.ts#L48) for creations and [here](https://github.com/kritpo/e-calendar/blob/050732b1e54efe0ce0e84def8bbc37d53a30ffcf/src/User/UserService.ts#L165) for updates._

-   [x] Store your configuration entries in environment variables or outside the git scope. **[1 point]** 🔵

    > How did you achieve this?

    _All `.env` files are loaded through [this file](https://github.com/kritpo/e-calendar/blob/050732b1e54efe0ce0e84def8bbc37d53a30ffcf/src/setupEnv.ts) which is loaded at top of application. For Github CI, all environment variables are loaded [here](https://github.com/kritpo/e-calendar/blob/050732b1e54efe0ce0e84def8bbc37d53a30ffcf/.github/workflows/ci.yml#L16)._

-   [x] Do you provide a way to list every configuration entries (setup instructions, documentation, requireness... are appreciated)? **[1 point]**

    > How did you achieve this?

    _The current README specify the way to configure and launch easily the application with AIO commands._

-   [ ] Do you have a kind of configuration validation with meaningful error messages? **[1 point]**

    > How did you achieve this?

##### Package management

-   [x] Do not use any package with less than 50k downloads a week. 🔵

-   [ ] Did you write some automated tools that check no unpopular dependency was installed? If yes, ensure it runs frequently. **[1 point]**

    > How did you achieve this? A Github Action (or similar) and compliance rule for pull requests are appreciated.

-   [x] Properly use dependencies and devDependencies in your package.json. **[0.5 points]**

    > How did you achieve this?

    _`dependencies` contains only packages that are explicitly imported into production files (aka. not tests files), while `devDependencies` contains all the left over._

##### Automated API generation

-   [x] Do you have automated documentation generation for your API (such as OpenAPI/Swagger...)? **[1 point]** 🔵

    > How did you achieve this?
    > You must link your documentation for review (a Github page, a ZIP archive, an attachment to the release notes...).

    _Through TSOA, the OpenAPI specification is generated too. When launching the application, you could access to the API documentation [here](http://localhost:8080/docs) for `dev mode`. The latest generated OpenAPI specification is accessible [here](https://drive.google.com/file/d/1AGtgzn8JbOtMd4GKdxFa00Xzn9dQxoj6/view?usp=sharing)._

-   [x] In addition to requireness and types, do you provide a comment for every property of your documentation? **[1 point]**

    > How did you achieve this?

    _Thanks to ESLint rules combined with JSDoc plugin, all properties are required to be strictly documented and TSOA can uses theses comments to generate documentation with all description for properties._

-   [x] Do you document the schema of responses (at least for success codes) and provide examples of payloads? **[1 point]**

    > How did you achieve this?

    _As TSOA uses TS types to generate its specification, API responses are also generated and so OpenAPI could generate sample from specifications._

-   [x] Is your documentation automatically built and published when a commit reach the develop or master branches? **[1 point]**

    > How did you achieve this?

    It is built at runtime, and accessible [here](http://localhost:8080/docs) for `dev mode`.

##### Error management

-   [x] Do not expose internal application state or code (no sent stacktrace in production!). **[1 point]** 🔵

    > How did you achieve this?

    _All returned errors are emptied from documentation of backend, just a message corresponding to the error is sent, as you can see [here](https://github.com/kritpo/e-calendar/blob/050732b1e54efe0ce0e84def8bbc37d53a30ffcf/src/utils/response/generateErrorResponse.ts#L21). All codes are remapped to correspond to the correct HTTP code, like [here](https://github.com/kritpo/e-calendar/blob/050732b1e54efe0ce0e84def8bbc37d53a30ffcf/src/utils/response/generateResponse.ts#L38)._

-   [ ] Do you report errors to Sentry, Rollbar, Stackdriver… **[1 point]**

    > How did you achieve this?

##### Log management

-   [x] Mention everything you put in place for a better debugging experience based on the logs collection and analysis. **[3 points]**

    > How did you achieve this?

    _We created a fully functional logger system [here](https://github.com/kritpo/e-calendar/blob/050732b1e54efe0ce0e84def8bbc37d53a30ffcf/src/utils/logging/getLogger.ts) with simply logging for [dev mode](https://github.com/kritpo/e-calendar/blob/050732b1e54efe0ce0e84def8bbc37d53a30ffcf/src/utils/logging/models/DevLogger.ts#L17) with colors to help in debugging, and json formatted logging for [prod mode](https://github.com/kritpo/e-calendar/blob/050732b1e54efe0ce0e84def8bbc37d53a30ffcf/src/utils/logging/models/ProdLogger.ts#L22)._

    _Thanks to `morgan`, we also log request start, request inputs (with password masking) and request end [here](https://github.com/kritpo/e-calendar/blob/050732b1e54efe0ce0e84def8bbc37d53a30ffcf/src/utils/logging/registerRequestLogger.ts)._

-   [x] Mention everything you put in place to ensure no sensitive data were recorded to the log. **[1 point]**

    > How did you achieve this?

    _All time, the only sensitive data which is logged is only the password from user input in `users` collection, all others services only log the id when possible otherwise the name/username, but not sensitive data. To ensure that the input password is masked, it is replaced [here](https://github.com/kritpo/e-calendar/blob/050732b1e54efe0ce0e84def8bbc37d53a30ffcf/src/utils/logging/registerRequestLogger.ts#L15) beforehand by a default value to ensure that sensitive data is not shown._

##### Asynchronous first

-   [x] Always use the async implementations when available. **[1 point]** 🔵

    > List all the functions you call in their async implementation instead of the sync one.
    >
    > Ex: I used `await fs.readFile` in file `folder/xxx.ts:120` instead of `fs.readFileSync`.

    _For all mongoose calls, we use promises instead of callback implementation, like [here](https://github.com/kritpo/e-calendar/blob/050732b1e54efe0ce0e84def8bbc37d53a30ffcf/src/Base/BaseService.ts#L26). Likewise, in tests, we use the promises instead of callback implementation, like [here](https://github.com/kritpo/e-calendar/blob/050732b1e54efe0ce0e84def8bbc37d53a30ffcf/src/User/UserController.spec.ts#L10)._

-   [x] No unhandled promise rejections, no uncaught exceptions… **[1 point]** 🔵

    > For example, how do you ensure every promise rejection is caught and properly handled?
    > Tips: one part of the answer could be the use of a linter.

    _For unhandled promises, we uses the `@typesscript-eslint/no-floating-promises` rule. At the very end, if an uncaught error is thrown, the error catcher [here](https://github.com/kritpo/e-calendar/blob/050732b1e54efe0ce0e84def8bbc37d53a30ffcf/src/app.ts#L77) will take the responsibility of returning an 500 HTTP Error._

##### Code quality

-   [x] Did you put a focus on reducing code duplication? **[1 point]**

    > How did you achieve this?

    _We uses ClodeClimate, accessible [here](https://codeclimate.com/github/kritpo/e-calendar) to ensure no code duplication is done; or at least no avoidable code duplication._

-   [x] Eslint rules are checked for any pushed commit to develop or master branch. **[1 point]**

    > Please provide a link to the sample of Github Action logs (or similar).

    _For Gihub CI, we uses the [full-rebuild](https://github.com/kritpo/e-calendar/blob/050732b1e54efe0ce0e84def8bbc37d53a30ffcf/.github/workflows/ci.yml#L39) command which ensure that the linter is executed [here](https://github.com/kritpo/e-calendar/blob/050732b1e54efe0ce0e84def8bbc37d53a30ffcf/package.json#L36). [Here](https://github.com/kritpo/e-calendar/runs/5344332068?check_suite_focus=true#step:8:17) and example of the latest commit._

##### Automated tests

-   [x] You implemented automated specs. **[1 point]** 🔵

    > Please provide a link to the more complete summary you have.

    _[Here](https://codeclimate.com/github/kritpo/e-calendar/code), the CodeClimate summary of the latest check of code coverage and maintainability._

-   [x] Your test code coverage is 75% or more. **[1 point]** 🔵

    > Please provide a link to the `istanbul` HTML coverage summary (or from a similar tool).

    _When launched, you will could access to the coverage summary at `coverage\lcov-report\index.html` or you could see the CodeClimate [summary](https://codeclimate.com/github/kritpo/e-calendar/code)_

-   [x] Do you run the test on a CD/CI, such as Github Action? **[1 point]**

    > Please provide a link to the latest test summary you have, hosted on Github Action or similar.

    _[Here](https://github.com/kritpo/e-calendar/runs/5344332068?check_suite_focus=true#step:9:1215) the latest tests run on Github Actions._
