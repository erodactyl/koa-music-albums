const KoaRouter = require('koa-router');
const api = new KoaRouter();
const albums = require('./routers/albums');
const songs = require('./routers/songs');

api
	.use('/albums', albums)
	.use('/songs', songs);

module.exports = api.routes();