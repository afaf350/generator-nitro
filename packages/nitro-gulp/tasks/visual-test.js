'use strict';

/**
 * run backstop tests and generate report
 */

const backstop = require('backstopjs');
const getPort = require('get-port');
const projectPath = require('../lib/utils').getProjectPath();
const serverPath = require('@nitro/app/app/lib/utils').getServerPath();
let isRunning = false;

module.exports = (gulp, plugins) => {
	return () => {
		return getPort()
			.then((port) => {
				const server = plugins.liveServer(serverPath, {
					env: {
						PORT: port,
						NODE_ENV: 'production',
					},
				}, false);

				return server.start()
					.then(() => {}, () => {}, () => {
						if (!isRunning) {
							isRunning = true;
							return backstop('test', {
								config: require(`${projectPath}tests/backstop/backstop.config.js`)({
									port,
								}),
							})
								.then(() => {
									server.stop();
									return true;
								}).catch(() => {
									server.stop();
									return false;
								});
						}
					});
			});
	};
};
