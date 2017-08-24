const KoaRouter = require('koa-router');
const err = require('./errorMsgs');
const router = new KoaRouter();
const { Album, Song } = require('../db/models');

router
	.get('/', async ctx => {
		try {
			const album = await Album.findAll({ attributes: ['name', 'id'] });
			ctx.body = album;
		} catch (e) {
			console.log(e);
			ctx.body = err.simple;
		}
	})
	.get('/:id', async ctx => {
		try {
			const { id } = ctx.params;
			const album = await Album.findById(id, { attributes: ['name', 'id'] });
			ctx.body = album;
		} catch (e) {
			console.log(e);
			ctx.body = err.simple;
		}
	})
	.post('/', async ctx => {
		const { albumName: name } = ctx.request.body;
		if (name) {
			try {
				await Album.create({ name });
				ctx.body = { success: true };
			} catch (e) {
				console.log(e);
				ctx.body = err.simple;
			}
		} else {
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
				ctx.body = { success: true };
			} catch (e) {
				console.log(e);
				ctx.body = err.simple;
			}
		} else {
			ctx.body = err.noName;
		}
	})
	.delete('/:id', async ctx => {
		try {
			const { id } = ctx.params;
			await Album.destroy({ where: { id } })
			ctx.body = { success: true };
		} catch (e) {
			console.log(e);
			ctx.body = err.simple;
		}
	})
	.get('/:id/songs', async ctx => {
		try {
			const { id: album_id } = ctx.params;
			const albumSongs = await Song.findAll({ attributes: ['name', 'id'], where: { album_id } });
			ctx.body = albumSongs;
		} catch (e) {
			console.log(e);
			ctx.body = err.simple;
		}
	});

module.exports = router.routes();