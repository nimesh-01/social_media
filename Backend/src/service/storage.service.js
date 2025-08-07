const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINTS,
});

const uploadFile = async (fileBuffer, originalname = "image.jpg") => {
    return new Promise((resolve, reject) => {
        imagekit.upload(
            {
                file: fileBuffer,             // ✅ pass the buffer directly
                fileName: originalname,
                folder: "posts"
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
    });
};
const uploadProfile = async (fileBuffer, originalname = "image.jpg") => {
    return new Promise((resolve, reject) => {
        console.log("In uploadProfile");

        imagekit.upload(
            {
                file: fileBuffer,
                fileName: originalname,
                folder: "Profile"
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
    });
};
const deleteProfileImage = async (fileId) => {
    return new Promise((resolve, reject) => {
        imagekit.deleteFile(fileId, (error, result) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
};
const deletePost = async (fileId) => {
    return new Promise((resolve, reject) => {
        imagekit.deleteFile(fileId, (error, result) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
};
module.exports = { uploadProfile, uploadFile, deleteProfileImage ,deletePost};

