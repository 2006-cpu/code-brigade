Masks Co.

This is an ecommerce site where you can browse a selection of face masks or use the live search bar to narrow down your search. Signing for an account gives you access to to your account page, showing you some of your personal information as well as any current and past orders you have placed. If you see a mask you like you can add it to your shopping cart. Once there, you have the ability to go through the checkout process.

Getting Started

npm i
createdb graceshopper-dev
Run npm run server:dev to start the web server. In a second terminal navigate back to the local repo and run npm run client:dev to start the react server. Run db:build which rebuilds the database, all the tables, and ensures that there is meaningful data present.

Deployed URL

https://code-brigade-graceshopper.herokuapp.com/

Environment Variables

const DB_NAME = 'localhost:5432/graceshopper-dev'
const DB_URL = process.env.DATABASE_URL || `postgres://${ DB_NAME }`;
JWT_SECRET="codebrigaderules"

Tech Stack

Backend: Node.js, Express.js, PostgreSQL

It all starts in the root index.js file. This is the express server. The routing middleware is handled in this file as well.

Frontend: React.js, Stripe, Material-UI

The root React code starts in the src/index.js file.

Project Structure

├── db
│   ├── index.js
│   └── init_db.js
├── index.js
├── package.json
├── public
│   └── index.html
├── routes
│   └── index.js
└── src
    ├── api
    │   └── index.js
    ├── auth
    ├── components
    │   ├── App.js
    │   └── index.js
    └── index.js
Top level index.js is our Express Server. This is responsible for setting up our API, starting our server, and connecting to our database.

Inside /db we have index.js which is responsible for creating all of our database connection functions.

Inside /routes we have index.js which is responsible for building the apiRouter, which is attached in the express server. This will build all routes that our React application will use to send/receive data via JSON.

Lastly /public and /src are the two puzzle pieces for our React front-end. /public contains any static files necessary for our front-end, and /src is our React source code.

Contributors

Tilly Wright, Laurence Reeds, Spencer Sharpe and Zach Garrett. You can see all of their gitHub profiles here: https://github.com/tillyninjaspace 
                      https://github.com/laurencereeds 
                      https://github.com/spencersharpe-dev
                      https://github.com/zachgarrett24
                      
                      
                      