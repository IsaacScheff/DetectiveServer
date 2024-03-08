import 'dotenv/config';
import OpenAI from "openai";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 8000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// OpenAI configuration
const openaiOrg = process.env.OPENAI_ORG;
const openaiApiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
    organization: openaiOrg,
    apiKey: openaiApiKey,
});

// Endpoint to handle chat requests
app.post("/", async (request, response) => {
    const { chats } = request.body;

    try {
        const result = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are a man who has commited a murder being interogated by police.",
              },
              ...chats,
            ],
        });

        // Adjusted response access to match validated structure
        const message = result.choices[0].message;
        response.json({
            output: message, // Assuming you want to send back the message content directly
        });
    } catch (e) {
        console.log('Error:', e);
        response.status(500).json({ error: e.toString() });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
