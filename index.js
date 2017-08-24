const Koa = require('koa');
const KoaRouter = require('koa-router');
const logger = require('koa-logger');
const koaBody = require('koa-body');
require('dotenv').config();
require('./api/db/models');
const router = require('./api/api');

const app = new Koa();

app.use(logger());
app.use(koaBody());
app.use(router);

app.listen(8080, () => console.log('Listening on port 8080'));