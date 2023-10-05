# Northcoders News API

An API created for the purpose of accessing application news data including articles, comments, topics and user data programmatically. The intention here is to mimic the building of a real world backend service (such as Reddit) which provides this information to the front end architecture.

Link to hosted version:
https://ldev-news-api-project.onrender.com

Instructions for setup:

Clone the following gitHub repository -
https://github.com/northcoders/be-nc-news

Dev Depencies -

To create your package.json file:

◇ npm install

For your testing suite, you will need to install Jest and Supertest using

◇ npm install jest -D
◇ npm install supertest -D

To ensure we are not committing broken code, this project makes use of git hooks. Git hooks are scripts triggered during certain events in the git lifecycle. Husky is a popular package that allows us to set up and maintain these scripts.
To initialise the project with Husky and install you can use:

◇ npx husky-init && npm install

You will need two environment files:

◇ .env.development - Containing environment variables for the development database.

◇ .env.test - Containing environment variables for the testing database.

The minimum versions of Node.js and Postgres needed to run this project are

◇ Node.js: v20.3.1
◇ Postgres 14.9
