const KoaRouter = require('koa-router');
const err = require('./errorMsgs');
const router = new KoaRouter();
const { Album, Song } = require('../db/models');

router
	.get('/', async ctx => {
		try {
			const album = await Album.findAll({ attributes: ['name', 'id'] });
			ctx.response.status = 200;
			ctx.body = album;
		} catch (e) {
			console.log(e);
			ctx.response.status = 500;
			ctx.body = err.simple;
		}
	})
	.get('/:id', async ctx => {
		try {
			const { id } = ctx.params;
			const album = await Album.findById(id, { attributes: ['name', 'id'] });
			ctx.response.status = 200;
			ctx.body = album;
		} catch (e) {
			console.log(e);
			ctx.response.status = 500;
			ctx.body = err.simple;
		}
	})
	.post('/', async ctx => {
		const { albumName: name } = ctx.request.body;
		if (name) {
			try {
				await Album.create({ name });
				ctx.response.status = 201;
				ctx.body = { success: true };
			} catch (e) {
				console.log(e);
				ctx.response.status = 500;
				ctx.body = err.simple;
			}
		} else {
			ctx.response.status = 417;
			ctx.body = err.noName;
		}
	})
	.put('/:id', async ctx => {
		const { albumName: name } = ctx.request.body;
		if (name) {
			try {
				const { id } = ctx.params;
				await Album.update({ name },
					{	where: { id } });
				ctx.response.status = 200;
				ctx.body = { success: true };
			} catch (e) {
				console.log(e);
				ctx.response.status = 500;
				ctx.body = err.simple;
			}
		} else {
			ctx.response.status = 417;
			ctx.body = err.noName;
		}
	})
	.delete('/:id', async ctx => {
		try {
			const { id } = ctx.params;
			await Album.destroy({ where: { id } });
			ctx.response.status = 200;
			ctx.body = { success: true };
		} catch (e) {
			console.log(e);
			ctx.response.status = 500;
			ctx.body = err.simple;
		}
	})
	.get('/:id/songs', async ctx => {
		try {
			const { id: album_id } = ctx.params;
			const albumSongs = await Song.findAll({ attributes: ['name', 'id'], where: { album_id } });
			ctx.response.status = 200;
			ctx.body = albumSongs;
		} catch (e) {
			console.log(e);
			ctx.response.status = 500;
			ctx.body = err.simple;
		}
	});

module.exports = router.routes();