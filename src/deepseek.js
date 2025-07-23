import axios from 'axios';

export default async function getDeepseekBookRecommendations(content) {
    console.log('Getting recommendations from Deepseek');
    // Check if API key is set
    if (!process.env.DEEPSEEK_API_KEY) {
        throw new Error('DEEPSEEK_API_KEY environment variable is not set');
    }

    // Call Deepseek API for book recommendations
    const response = await axios.post(
        'https://api.deepseek.com/v1/chat/completions',
        {
            model: "deepseek-chat",
            messages: [
                {
                    role: "system",
                    content: "You're a helpful assistant who can analyze reading preferences and recommend books from a user's existing library. Based on the user's reading history of highly rated books, recommend books from their unread list that they would most likely enjoy. Focus on books that are similar in style, theme, or author to their highest rated books."
                },
                {
                    role: "user",
                    content: content
                }
            ],
            temperature: 0.3
        },
        {
            headers: {
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    );

    return response.data.choices[0].message.content;
}