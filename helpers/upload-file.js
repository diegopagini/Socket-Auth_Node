/** @format */
import { v4 } from 'uuid';

export const uploadFiles = (
	files,
	validExtensions = ['png', 'jpg', 'jpeg', 'gif'],
	folder = ''
) => {
	return new Promise((resolve, reject) => {
		const { file } = files; // Body must have the "file".
		const splitedName = file.name.split('.');
		const fileExtension = splitedName[splitedName.length - 1];

		if (!validExtensions.includes(fileExtension))
			return reject(
				`${fileExtension} is not a valid extension. Valid extensions: ${validExtensions}`
			);

		const temporalName = v4() + '.' + fileExtension;
		const uploadPath = path.join(__dirname, '../uploads/', folder, temporalName);

		// Use the mv() method to place the file somewhere on your server.
		file.mv(uploadPath, (err) => {
			if (err) return reject(err);

			return resolve(temporalName);
		});
	});
};
