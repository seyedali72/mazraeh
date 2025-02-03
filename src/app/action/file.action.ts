'use server';

import File from '@/models/File';
import sharp from 'sharp';
import { existsSync, mkdirSync, unlink } from 'fs';
import path, { join, parse } from 'path';
import { writeFile } from 'fs/promises';
// @ts-ignore
import ffmpeg from 'fluent-ffmpeg';
import connect from '../lib/db';
import { BASE_URL, buildQuery, findDir } from '../utils/helpers';
// import ffmpegPath from "@ffmpeg-installer/ffmpeg";
// ffmpeg.setFfmpegPath(ffmpegPath.path);

export const getFilesList = async (search?: any) => {
    await connect();

    try {
        const allFiles = await File.find(buildQuery(search, true))
            .skip(search?.skip ? search?.skip : 0)
            .limit(search?.limit ? search?.limit : 0)
            .sort({ createdAt: -1 })
            .lean();

        return JSON.parse(JSON.stringify(allFiles));
    } catch (error) {
        console.log(error);
        return { error: 'خطا در دریافت فایل' };
    }
};

export const saveImage = async (file: any) => {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    let targetDir: any = join(findDir(import.meta.url), '../../../public/uploads');
    let finalName = parse(file.name).name.replaceAll(' ', '-')
    let targetName = `${Date.now().toString().slice(-7)}-${finalName}.webp`;
    let targetPath = join(targetDir, targetName);

    mkdirSync(targetDir, { recursive: true });

    return new Promise((resolve, reject) =>
        sharp(buffer)
            .webp({ quality: 90 })
            .toFile(targetPath, (err: any) => {
                if (err) {
                    reject('خطا در تبدیل فایل');
                }
                resolve({ file, targetPath, targetName });
            })
    );
};

export const saveVideo = async (file: File, videoOptions: any) => {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    let dest = path.resolve(process.cwd());

    let stream1 = () => {
        switch (videoOptions.fileFormat) {
            case 'mp4':
                return ffmpeg(buffer).outputOptions([
                    '-c:v libx264',
                    '-crf 25',
                    '-preset fast',
                    '-b:v 64k',
                    '-c:a aac',
                    '-b:a 96k',
                ]);
            default:
                return ffmpeg(buffer);
        }
    };

    await new Promise((resolve, reject) => {
        ffmpeg(dest).takeScreenshots(
            {
                count: 1,
                timemarks: ['00:00:10.000'],
                size: '800x400',
                filename: `%f`,
            },
            `public/uploads`
        );

        stream1().save(dest)
            .on('error', (err: any) => console.log('stream', err))
            .on('end', resolve);
    });
};

export const saveDoc = async (file: any) => {
    const bytes = await file.arrayBuffer();
    const buffer:any = Buffer.from(bytes);
    let targetDir: any = join(findDir(import.meta.url), '../../../public/uploads');
    let targetName = `${Date.now().toString().slice(-7)}-${file.name}`;
    let finalName = targetName.replace(' ', '-')
    let targetPath = join(targetDir, finalName);

    mkdirSync(targetDir, { recursive: true });

    try {
        await writeFile(targetPath, buffer);
        return { targetPath, targetName };
    } catch (error: any) {
        return { error: 'خطا در نوشتن فایل' };
    }
};

export const deleteFile = async (data: [{ id: string; address: string }]) => {
    await connect();

    try {
        // for loop
        for (let file of data) {
            // delete from db
            await File.findByIdAndDelete(file.id);

            // delete from disk
            const diskAddress = join(process.cwd(), 'public', 'uploads', parse(file.address).base);
            if (existsSync(diskAddress)) {
                unlink(diskAddress, (err) => {
                    if (err) return { error: 'خطا در عملیات' };
                });
            } else {
                return { error: 'آدرس فایل صحیح نیست' };
            }
        }

        return { success: true };
    } catch (error) {
        console.log(error);
        return { error: 'خطا در حذف فایل' };
    }
};

export const editFile = async (id: string, body: any) => {
    await connect()
    try {
        let updatedFile = await File.findByIdAndUpdate(id, body, { new: true })
        return JSON.parse(JSON.stringify(updatedFile))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}

export const uploadFileToDoc = async (data: FormData,name:any) => {
    const file: File | null = data.get('file') as unknown as File;
    const isDoc = !file.type?.includes('image');
    if (!file) {
        return { error: 'فایلی وجود ندارد!' };
    }
console.log(file)
    const result: any = isDoc ? await saveDoc(file) : await saveImage(file);

    // add file to db
    await connect();
     try {
        const newFile = await File.create({
            fileName: name,
            fileAddress: BASE_URL + '/api/check?filename=' + result.targetName,
            fileSize: (file.size / 1024).toFixed(2),
            altText: '',
            mimeType: isDoc ? file.type : 'image/webp',
            thumbnails: [],
        });

        return { _id: newFile._id.toString(), address: newFile.fileAddress };
    } catch (error) {
        console.log(error);
        return { error: 'خطا در ثبت فایل' };
    }
};