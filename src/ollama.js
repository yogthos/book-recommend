import axios from 'axios';

export default async function getOllamaBookRecommendations(content) {
    console.log('Getting recommendations from Ollama');
    try {
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: 'qwen3:32b',
            prompt: `You're a helpful assistant who can analyze reading preferences and recommend books from a user's existing library. Based on the user's reading history of highly rated books, recommend books from their unread list that they would most likely enjoy. Focus on books that are similar in style, theme, or author to their highest rated books:\n\n${content}`,
            stream: false,
            options: {
                num_ctx: 16384,  // Larger context window
                temperature: 0.3,  // More deterministic output
                top_k: 40,       // Balance between quality and speed
                top_p: 0.9        // Controls diversity of output
            }
        });
        return response.data.response;
    } catch (error) {
        console.error('recommendations error:', error);
        throw error;
    }
}

