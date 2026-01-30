import ImageKit from 'imagekit';
import dotenv from 'dotenv';
dotenv.config();

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

export const uploadToImageKit = async (file, folder = '/eat-and-out/') => {
    try {
        const result = await imagekit.upload({
            file: file.buffer,
            fileName: file.originalname,
            folder: folder
        });
        return result.url;
    } catch (error) {
        console.error('ImageKit Upload Error:', error);
        throw error;
    }
};

export default imagekit;
