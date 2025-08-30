// test-image-tier1.js
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: "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", // hardcode temporarily
});

async function testImage() {
  try {
    const image = await client.images.generate({
      model: "dall-e-3",
      prompt: "A cute cartoon pancake with syrup and butter",
      n: 1,
      size: "1024x1024", // valid size for DALL·E 3
    });

    console.log("✅ Image generation successful!");
    console.log("Image URL:", image.data[0].url);
  } catch (err) {
    console.error("Error generating image:", err);
  }
}

testImage();
