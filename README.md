This is a project built in conjunction with emotion researcher Maria Gendron to measure how accurately people can infer other people's emotions. Maria is a Yale professor and Northeastern alumna who has been featured in TIME, NPR, and BBC. The Sandbox team at Northeastern University built an online experiment that simultaneously plays videos and collects data from participants.

# Running in Development

In development, there are two servers running: one for the React frontend and one for the Node/Express backend. By default, React will send AJAX requests to the server it's hosted at (the React development server), not the Node server. We use the `proxy` field inside the frontend's package.json to tell React to send the requests to Node at port 3001 instead.

`npm run dev` at the root folder will run the nodejs backend and reactjs frontend in development mode. Both will automatically reload when files are edited. Within the backend or frontend folders, `npm run dev` will start up the development server for just the backend or frontend.

# Testing

`npm test` at the root folder should test both, but we still need to set up testing... **TODO**

# Deployment

Pushing to GitHub deploys the app to [Zeit Now](https://zeit.co/now). The master branch is production. Zeit builds the app with now.json, which uses the `now-build` script inside package.json to build the React app for production. Zeit handles routing by hosting static files at `/static/` and then routes every other url to React's compiled index.html.

# Code notes

## Prop Types

We use the `prop-types` package to validate props coming into React components. Custom types are declared in `types.js` - see `VideoQuestion.js` for an example of the types in use.


Empathic Accuracy is a [Sandbox](https://sandboxneu.com) project.
