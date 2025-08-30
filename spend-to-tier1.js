// spend-to-tier1.js
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: "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", // hardcode temporarily
});

async function spendRemaining() {
  try {
    // 40 requests with ~3000 tokens each ~ $4.88
    const requests = 40;
    for (let i = 0; i < requests; i++) {
      await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Write a small paragraph to spend API credit. Request #${i + 1}`,
          },
        ],
        max_tokens: 3000,
      });
      console.log(`Request ${i + 1} done.`);
    }

    console.log("✅ Done! Roughly $4.88 spent, leaving ~$5 for Tier 1.");
  } catch (err) {
    console.error("Error spending credit:", err);
  }
}

spendRemaining();
