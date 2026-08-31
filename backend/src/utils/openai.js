const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 30000,
});

const callOpenAI = async (prompt, json = false) => {
    const options = {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
    };

    if (json) {
        options.response_format = { type: "json_object" };
    }

    const response = await client.chat.completions.create(options);

    return response.choices[0].message.content;
};

module.exports = {
    callOpenAI,
};