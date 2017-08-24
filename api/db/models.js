const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.connection);

const Album = sequelize.define('album', {
	name: Sequelize.STRING,
	id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true }
});

const Song = sequelize.define('song', {
	name: Sequelize.STRING,
	id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
	album_id: { type: Sequelize.INTEGER, references: {
			model: Album,
			key: 'id'
		}
	}
});

Album.sync();
Song.sync();

module.exports = { Album, Song };