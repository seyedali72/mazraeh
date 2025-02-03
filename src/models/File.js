import mongoose, { Schema, model } from 'mongoose';

const fileSchema = new Schema(
	{
		fileName: {
			type: String,
			trim: true,
			maxLength: [200, 'نام فایل باید حداکثر 200 کاراکتر باشد'],
			required: [true, 'نام فایل الزامی است'],
		},
		fileAddress: {
			type: String,
			trim: true,
			required: [true, 'آدرس فایل الزامی است'],
		},
		fileSize: { type: String },
		altText: { type: String },
		mimeType: { type: String, trim: true, lowercase: true },
		thumbnails: [
			{
				url: { type: String, trim: true },
				size: {
					type: String,
					enum: { values: ['md', 'sm'] },
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

const File = mongoose.models.File || model('File', fileSchema);
export default File;
