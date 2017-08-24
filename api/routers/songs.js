const KoaRouter = require('koa-router');
const err = require('./errorMsgs');
const router = new KoaRouter();
const { Song } = require('../db/models');

router
	.get('/', async ctx => {
		try {
			const songs = await Song.findAll({ attributes: ['name', 'id', 'album_id'] });
			ctx.body = songs;
		} catch (e) {
			console.log(e);
			ctx.body = err.simple;
		}
	})
	.get('/:id', async ctx => {
		try {
			const { id } = ctx.params;
			const song = await Song.findById(id, { attributes: ['name', 'id', 'album_id'] });
			ctx.body = song;
		} catch (e) {
			console.log(e);
			ctx.body = err.simple;
		}
	})
	.post('/', async ctx => {
		const { songName: name, albumId: album_id } = ctx.request.body;
		if (name && album_id) {
			try {
				await Song.create({ name, album_id });
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
		const { songName: name, albumId: album_id } = ctx.request.body;
		if (name && album_id) {
			try {
				const { id } = ctx.params
				await Song.update({ name, album_id },
					{ where: { id } });
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
			await Song.destroy({ where: { id } });
			ctx.body = { success: true };
		} catch (e) {
			console.log(e);
			ctx.body = err.simple;
		}
	});

module.exports = router.routes();