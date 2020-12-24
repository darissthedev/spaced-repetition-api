# Spaced Repetition API!
---------------------------------------------------------------------------------

## Collaborators:
Zeid Diez,
Michelle LaLonde,
Marcus Ridley,
Dariss Harris

---------------------------------------------------------------------------------

## Live Demo:

## Server Repo:

## Client Repo:

---------------------------------------------------------------------------------

## About:

Space Repetition Learning tool

This App uses space repetition method to teach the user a new language. Currently the database is only seeded with Italian words, but can implement with other language by populate it to the database. What is Space Repetition?

Spaced repetition is an evidence-based learning technique that incorporates increasing intervals of time between subsequent review of previously learned material in order to exploit the psychological spacing effect. -- From Wikipedia

---------------------------------------------------------------------------------

## Local dev setup

If using user `dunder-mifflin`:

```bash
mv example.env .env
createdb -U dunder-mifflin spaced-repetition
createdb -U dunder-mifflin spaced-repetition-test
```

If your `dunder-mifflin` user has a password be sure to set it in `.env` for all appropriate fields. Or if using a different user, update appropriately.

```bash
npm install
npm run migrate
env MIGRATION_DB_NAME=spaced-repetition-test npm run migrate
```

And `npm test` should work at this point

---------------------------------------------------------------------------------

## Configuring Postgres

For tests involving time to run properly, configure your Postgres database to run in the UTC timezone.

1. Locate the `postgresql.conf` file for your Postgres installation.
   1. E.g. for an OS X, Homebrew install: `/usr/local/var/postgres/postgresql.conf`
   2. E.g. on Windows, _maybe_: `C:\Program Files\PostgreSQL\11.2\data\postgresql.conf`
   3. E.g  on Ubuntu 18.04 probably: '/etc/postgresql/10/main/postgresql.conf'
2. Find the `timezone` line and set it to `UTC`:

```conf
# - Locale and Formatting -

datestyle = 'iso, mdy'
#intervalstyle = 'postgres'
timezone = 'UTC'
#timezone_abbreviations = 'Default'     # Select the set of available time zone
```
---------------------------------------------------------------------------------

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests mode `npm test`

Run the migrations up `npm run migrate`

Run the migrations down `npm run migrate -- 0`

---------------------------------------------------------------------------------

/api/user

POST calls will register a user and must include a body with 'password', 'username', and 'name' keys.

Passwords must be at least eight characters long and include a symbol, uppercase letter, lowercase letter, and number.

sample request:

fetch(`${config.API_ENDPOINT}/user`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        name: 'name',
        username: 'username',
        password: [valid password],
      }),

/api/auth

POST calls will log in a user and must include a body with 'username' and 'password' keys.

This endpoint will return a jwt token which authorizes the user to ender the /api/language endpoint.

sample request:

fetch(`${config.API_ENDPOINT}/auth/token`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ 
        username: 'username', 
        password: [valid password] 
      })

/api/language

A GET call to this endpoint, when logged in, will return an object with the language and an array of the user's words. The request must have an 'Authorization' header with the value 'Bearer' and the token returned by entering a username and password at the /api/auth endpoint.

sample request:

fetch(`${config.API_ENDPOINT}/language`, {
      headers: {
        'Authorization': `Bearer ` + [token]
      }

sample return {
    language: 'French',
    words: [
        {
            id: 1,
            language_id: 1,
            original: 'original 1',
            translation: 'translation 1',
            next: '2',
            memory_value: 1,
            correct_count: 0,
            incorrect_count: 0,
        }, {
            id: 2,
            language_id: 1,
            original: 'original 2',
            translation: 'translation 2',
            next: null,
            memory_value: 1,
            correct_count: 0,
            incorrect_count: 0,
        }
    ],
}

api/language/head

A GET call to this endpoint will return the first word for the user to translate, the user's total score, the number of times the user has gotten the word correct, and the number of times the user has gotten the word incorrect.

The request must have an 'Authorization' header with the value 'Bearer' and the token returned by entering a username and password at the /api/auth endpoint.

sample request:

fetch(`${config.API_ENDPOINT}/language/head`, {
      headers: {
        'Authorization': `Bearer ` + [token]
      }

sample return {
    nextWord: 'original 1',
    totalScore: 0,
    wordCorrectCount: 0,
    wordIncorrectCount: 0,
}

api/language/guess

A POST call to this endpoint must include a body with a 'guess' key.

The endpoint will return the user's total score, the next word, the correct and incorrect counts for the next word, the answer for the guessed word, and whether that answer is correct or incorrect.

sample request:

fetch(`${config.API_ENDPOINT}/language/guess`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ` + [token]
      },
      body: JSON.stringify({
          guess: 'original 1'
      })

sample return {
    nextWord: 'original 2',
    totalScore: 1,
    wordCorrectCount: 0,
    wordIncorrectCount: 0,
    answer: 'original 1',
    isCorrect: true,
}

Technology
Back End

    Express
    knex
    underscore
    cors
    helmet
    bcrypt
    jsonWebToken

Testing

    Mocha
    nodemon

Production

    Deployed via Heroku
