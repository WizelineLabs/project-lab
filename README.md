# Project Lab (WizeLabs)

Based on the [The Remix Indie Stack](https://remix.run/stacks).

## What's in the stack

- [Lightsail app deployment](https://aws.amazon.com/lightsail/)
- Production-ready [Postgres Database](https://postgresql.org)
- [GitHub Actions](https://github.com/features/actions) for deploy on merge to production and staging environments
- Auth0 Authentication with [cookie-based sessions](https://remix.run/docs/en/v1/api/remix#createcookiesessionstorage)
- Database ORM with [Prisma](https://prisma.io)
- End-to-end testing with [Cypress](https://cypress.io)
- Local third party request mocking with [MSW](https://mswjs.io)
- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

## Requirements

First you should install postgres **14** on your computer. For MacOS an easy method is to use [Postgres.app](https://postgresapp.com/downloads.html). If you have an M1 chip, the lastest version has support for it without Rossetta. As documented in their [page](https://postgresapp.com/documentation/cli-tools.html), you can add postgresql tools to your path using:

```
sudo mkdir -p /etc/paths.d &&
echo /Applications/Postgres.app/Contents/Versions/latest/bin | sudo tee /etc/paths.d/postgresapp
```

After that you can create a DB using this commands on the terminal:

```
createdb projectlabR
```

For Windows you can install postgres from [here](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) and you can follow [this](https://www.prisma.io/dataguide/postgresql/setting-up-a-local-postgresql-database#setting-up-postgresql-on-windows) easy setup (this also works for MacOS)

Then open the SQL Shell and write this commands for creating a DB:

```
CREATE DATABASE projectlabR;
```

## Getting Started

### Environment Variables

1. In root, create `.env` file with the following:

```
DATABASE_URL=postgresql://[username]@localhost:5432/projectlabR
SESSION_SECRET=
# Auth0 credentials
AUTH0_CLIENT_ID=
AUTH0_DOMAIN=
AUTH0_CLIENT_SECRET=
BASE_URL=
GOOGLE_APPLICATION_CREDENTIALS=
```

If you set a password in the installation of postgres, you should use this format for the DATABASE_URL:

```
DATABASE_URL=postgresql://[username]:[password]@localhost:5432/[database]?schema=public
```

2. Join [Keybase](https://keybase.io/) if you dont have an account yet.

3. Ask in `#team-wizelabs-io` channel on _Slack_ to join the keybase team to access the `.env (remix)` file with the environment values for `.env`.

For the `GOOGLE_APPLICATION_CREDENTIALS=` there will be a file named `wizelake-prod-wizelabs.json` in the files of the keybase team, you need to save it (outside of the project) and use it's absolute path as your `GOOGLE_APPLICATION_CREDENTIALS=`. There's a example of how to do this in `.env.example`.

4. Edit `prisma/seeds.ts` file and add your user at the very bottom, make sure to replace with your data:

```
  await db.profiles.upsert({
    where: { email: "[YOUR_WIZELINE_EMAIL]" },
    update: {},
    create: {
      email: "[YOUR_WIZELINE_EMAIL]",
      firstName: "[YOUR_FIRNAME]",
      lastName: "[YOUR_LASTNAME]",
      department: "[YOUR_DEPARTMENT]",
      preferredName: "[YOUR_PREFERED_NAME]"
    },
  })
```

5. (Only dev environment) Set the project's node version (see "engines" > "node" in "package.json") with NVM. If you don't have NVM installed read the [documentation](https://github.com/nvm-sh/nvm):

```
nvm use [NODE VERSION TO USE]
```

## Development

- Install dependencies

  ```sh
  npm install
  ```

- Initial database setup:

  ```sh
  npx prisma migrate reset
  ```

- Start dev server:

  ```sh
  npm run dev
  ```

This starts your app in development mode, rebuilding assets on file changes.

The database seed script creates a new user with some data you can use to get started, now you can login with your gmail user from wizeline that you added on the seeds file.

### Database

If you pull code changes that affect the schema (a new migration), you will need to run:

```sh
npx prisma migrate deploy # run any pending migrations
npx prisma generate # update your prisma client code with any changes to the schema
npm run kysely-codegen # update your kysely client code with any changes to the schema
```

To reset your database run

```sh
npx prisma migrate reset
```

To add a new migration update the `prisma/schema.prisma` file with the new tables and columns. Then run:

```sh
npx prisma migrate dev --create-only
```

**IMPORTANT**
The previous script will generate a new file in the `prisma/migrations` folder with the name you provided. It will contain the migration instructions for the database but it will include a few additional lines that you will need to remove:

```
-- AlterTable
ALTER TABLE "Profiles" ALTER COLUMN "searchCol" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Projects" ALTER COLUMN "tsColumn" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "profiles_search_col_idx" ON "Profiles" USING GIN ("searchCol" gin_trgm_ops);
```

Please, remove these lines and then run:

```sh
npx prisma migrate deploy # run any pending migrations
npx prisma generate # update your prisma client code with any changes to the schema
npm run kysely-codegen # update your kysely client code with any changes to the schema
```

### Relevant code:

This is a pretty simple note-taking app, but it's a good example of how you can build a full stack app with Prisma and Remix. The main functionality is creating projects, logging in and out.

- creating users, and logging in and out [./app/models/user.server.ts](./app/models/user.server.ts)
- user sessions, and verifying them [./app/session.server.ts](./app/session.server.ts)
- creating, and deleting projects [./app/models/project.server.ts](./app/models/project.server.ts)

## Deployment

This Remix Stack comes with two GitHub Actions that handle automatically deploying your app to production and staging environments.

Prior to your first deployment, you'll need to do a few things:

- [Install Fly](https://fly.io/docs/getting-started/installing-flyctl/)

- Sign up and log in to Fly

  ```sh
  fly auth signup
  ```

  > **Note:** If you have more than one Fly account, ensure that you are signed into the same account in the Fly CLI as you are in the browser. In your terminal, run `fly auth whoami` and ensure the email matches the Fly account signed into the browser.

- Create two apps on Fly, one for staging and one for production:

  ```sh
  fly create remix-project-lab-3569
  fly create remix-project-lab-3569-staging
  ```

  - Initialize Git.

  ```sh
  git init
  ```

- Create a new [GitHub Repository](https://repo.new), and then add it as the remote for your project. **Do not push your app yet!**

  ```sh
  git remote add origin <ORIGIN_URL>
  ```

- Add a `FLY_API_TOKEN` to your GitHub repo. To do this, go to your user settings on Fly and create a new [token](https://web.fly.io/user/personal_access_tokens/new), then add it to [your repo secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) with the name `FLY_API_TOKEN`.

- Add a `SESSION_SECRET` to your fly app secrets, to do this you can run the following commands:

  ```sh
  fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app remix-project-lab-3569
  fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app remix-project-lab-3569-staging
  ```

  If you don't have openssl installed, you can also use [1password](https://1password.com/password-generator/) to generate a random secret, just replace `$(openssl rand -hex 32)` with the generated secret.

- Create a persistent volume for the sqlite database for both your staging and production environments. Run the following:

  ```sh
  fly volumes create data --size 1 --app remix-project-lab-3569
  fly volumes create data --size 1 --app remix-project-lab-3569-staging
  ```

Now that everything is set up you can commit and push your changes to your repo. Every commit to your `main` branch will trigger a deployment to your production environment, and every commit to your `dev` branch will trigger a deployment to your staging environment.

### Connecting to your database

The sqlite database lives at `/data/sqlite.db` in your deployed application. You can connect to the live database by running `fly ssh console -C database-cli`.

### Getting Help with Deployment

If you run into any issues deploying to Fly, make sure you've followed all of the steps above and if you have, then post as many details about your deployment (including your app name) to [the Fly support community](https://community.fly.io). They're normally pretty responsive over there and hopefully can help resolve any of your deployment issues and questions.

## GitHub Actions

We use GitHub Actions for continuous integration and deployment. Anything that gets into the `main` branch will be deployed to production after running tests/build/etc. Anything in the `dev` branch will be deployed to staging.

## Testing

### Cypress

We use Cypress for our End-to-End tests in this project. You'll find those in the `cypress` directory. As you make changes, add to an existing file or create a new file in the `cypress/e2e` directory to test your changes.

We use [`@testing-library/cypress`](https://testing-library.com/cypress) for selecting elements on the page semantically.

To run these tests in development, run `npm run test:e2e:dev` which will start the dev server for the app as well as the Cypress client. Make sure the database is running in docker as described above.

We have a utility for testing authenticated features without having to go through the login flow:

```ts
cy.login();
// you are now logged in as a new user
```

We also have a utility to auto-delete the user at the end of your test. Just make sure to add this in each test file:

```ts
afterEach(() => {
  cy.cleanupUser();
});
```

That way, we can keep your local db clean and keep your tests isolated from one another.

### Vitest

For lower level tests of utilities and individual components, we use `vitest`. We have DOM-specific assertion helpers via [`@testing-library/jest-dom`](https://testing-library.com/jest-dom).

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.
