import { is } from '@electron-toolkit/utils';

export const installExtensions = async () => {
	if (!is.dev) return;

	const installer = require('electron-devtools-installer');
	console.log(`Extensions loading... START`);
	const listExtensions = [
		installer.REACT_DEVELOPER_TOOLS,
		installer.REDUX_DEVTOOLS,
		installer.MOBX_DEVTOOLS,
	];
	installer
		.installExtension(listExtensions, {
			loadExtensionOptions: { allowFileAccess: true },
			forceDownload: !!process.env.UPGRADE_EXTENSIONS,
		})
		.then(([...addedExtensions]) => {
			console.log(`[INFO] Added Extensions:`);
			addedExtensions.forEach((item) => {
				console.log(`> ${item.name}, id = ${item.id}`);
				console.log(`\t${item.path}`);
				console.log(`\t${item.url}`);
			});
		})
		.catch((err) => console.info('[WARN] An error occurred while trying to add extensions:\n', err))
		.finally(() => console.log(`Extensions loading... END`));
};
