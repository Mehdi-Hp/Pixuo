const sharp = require('sharp');
const debug = require('debug')('development');
const chalk = require('chalk');

module.exports = (backdropPath, backdropName) => {
	return new Promise((mainResolve, mainReject) => {
		debug('Generating backdrop from original file...');
		const jpegSmall = new Promise((resolve, reject) => {
			sharp(backdropPath)
				.resize(null, 400)
				.jpeg()
				.toFile(`${backdropPath}--small.jpeg`, () => {
					resolve(`${backdropPath}--small.jpeg`);
					debug(chalk.green('Backdrop--small generated.'));
				});
		});
		const jpegMedium = new Promise((resolve, reject) => {
			sharp(backdropPath)
				.resize(null, 760)
				.jpeg()
				.toFile(`${backdropPath}--medium.jpeg`, () => {
					resolve(`${backdropPath}--medium.jpeg`);
					debug(chalk.green('Backdrop--medium generated.'));
				});
		});
		const jpegBig = new Promise((resolve, reject) => {
			sharp(backdropPath)
				.resize(null, 1080)
				.jpeg()
				.toFile(`${backdropPath}--big.jpeg`, () => {
					resolve(`${backdropPath}--big.jpeg`);
					debug(chalk.green('Backdrop--big generated.'));
				});
		});
		Promise.all([jpegSmall, jpegMedium, jpegBig]).then((backdropsPath) => {
			mainResolve({
				small: backdropsPath[0],
				medium: backdropsPath[1],
				big: backdropsPath[2]
			});
		});
	});
};
