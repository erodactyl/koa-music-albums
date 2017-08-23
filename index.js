const Koa = require('koa');
const KoaRouter = require('koa-router');
const logger = require('koa-logger');
const koaBody = require('koa-body');
require('dotenv').config();
const { Client } = require('pg');
const err = require('./errorMsgs');

const { user, host, database, password, port } = process.env;

const client = new Client({ user, host, database, password, port });
client.connect();

const app = new Koa();
const router = new KoaRouter();

app.use(logger());
app.use(koaBody());

router
	.get('/albums', async ctx => {
		try {
			const albums = await client.query('select * from albums');
			ctx.body = albums.rows;
		} catch (e) {
			console.log(e);
			ctx.body = err.simple;
		}
	})
	.get('/albums/:id', async ctx => {
		try {
			const album = await client.query(`select * from albums where id='${ctx.params.id}'`);
			ctx.body = album.rows[0];
		} catch (e) {
			console.log(e);
			ctx.body = err.simple;
		}
	})
	.post('/albums', async ctx => {
		const { albumName } = ctx.request.body;
		if (albumName) {
			try {
				await client.query(`
					insert into albums (name) values ('${albumName}')
				`);
				ctx.body = { success: true };
			} catch (e) {
				console.log(e);
				ctx.body = err.simple;
			}
		} else {
			ctx.body = err.noName;
		}
	})
	.put('/albums/:id', async ctx => {
		const { albumName } = ctx.request.body;
		if (albumName) {
			try {
				await client.query(`
					update albums set name='${albumName}' where id='${ctx.params.id}'
				`);
				ctx.body = { success: true };
			} catch (e) {
				console.log(e);
				ctx.body = err.simple;
			}
		} else {
			ctx.body = err.noName;
		}
	})
	.delete('/albums/:id', async ctx => {
		try {
			await client.query(`
				delete from albums where id='${ctx.params.id}'
			`);
			ctx.body = { success: true };
		} catch (e) {
			console.log(e);
			ctx.body = err.simple;
		}
	})
	.get('/albums/:id/songs', async ctx => {
		try {
			const albumSongs = await client.query(`
				select * from songs where album_id='${ctx.params.id}'
			`);
			ctx.body = albumSongs.rows;
		} catch (e) {
			console.log(e);
			ctx.body = err.simple;
		}
	})
	.get('/songs', async ctx => {
		try {
			const songs = await client.query('select * from songs');
			ctx.body = songs.rows;
		} catch (e) {
			console.log(e);
			ctx.body = err.simple;
		}
	})
	.get('/songs/:id', async ctx => {
		try {
			const song = await client.query(`select * from songs where id='${ctx.params.id}'`)
			ctx.body = song.rows[0];
		} catch (e) {
			console.log(e);
			ctx.body = err.simple;
		}
	})
	.post('/songs', async ctx => {
		const { songName, albumName } = ctx.request.body;
		if (songName && albumName) {
			try {
				await client.query(`
					insert into songs (name, album_id) values
					('${songName}', (select id from albums where name='${albumName}'));
				`);
				ctx.body = { success: true };
			} catch (e) {
				console.log(e);
				ctx.body = err.simple;
			}
		} else {
			ctx.body = err.noName;
		}
	})
	.put('/songs/:id', async ctx => {
		const { songName, albumName } = ctx.request.body;
		if (songName && albumName) {
			try {
				await client.query(`
					update songs set name='${songName}',
					album_id=(select id from albums where name='${albumName}') where id='${ctx.params.id}'
				`);
				ctx.body = { success: true };
			} catch (e) {
				console.log(e);
				ctx.body = err.simple;
			}
		} else {
			ctx.body = err.noName;
		}
	})
	.delete('/songs/:id', async ctx => {
		try {
			await client.query(`
				delete from songs where id='${ctx.params.id}'
			`);
			ctx.body = { success: true };
		} catch (e) {
			console.log(e);
			ctx.body = err.simple;
		}
	});

app.use(router.routes());

app.listen(8080, () => console.log('Listening on port 8080'));