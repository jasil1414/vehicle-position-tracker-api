import express from 'express';
import bodyParser from 'body-parser';
import config from './config';
import routes from './routers/';
const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

routes.map(({method, path, handler, middlewares=[]}) => app[method](path, middlewares, handler));

const port = config.port || 3000;
const server = app.listen(port);


console.log(`Running Environment: ${config.env}`);
console.log(`Port: ${port}`);


export {port, server};