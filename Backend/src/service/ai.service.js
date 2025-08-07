const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");

dotenv.config();
// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});


async function generateCaption(base64ImageFile) {
    const contents = [
        {
            inlineData: {
                mimeType: "image/jpeg",
                data: base64ImageFile,
            },
        },
        { text: "Caption this image." },
    ];
    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: contents,
        config: {
            systemInstruction: ` 
            You are an expert in generating caption for images.
             You generate single caption for the image.
             Your caption should be short and concise. 
             You use hashtags and emojis in the caption.
             The image is connected to me so make the caption for posts not like comment
             `
        }
    });
    return response.text;
}
module.exports = generateCaption