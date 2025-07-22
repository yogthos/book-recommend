import fs from 'fs';
import axios from 'axios';
import { parseGoodreadsCSV } from './parse_goodreads.js';

async function getBookRecommendations(csvFilePath) {
    try {
        // Check if API key is set
        if (!process.env.DEEPSEEK_API_KEY) {
            throw new Error('DEEPSEEK_API_KEY environment variable is not set');
        }

        // Parse the CSV file
        const books = await parseGoodreadsCSV(csvFilePath);

        // Categorize books
        const readBooks = books.filter(book => book.isRead);
        const unreadBooks = books.filter(book => !book.isRead);

        console.log(`Found ${readBooks.length} read books and ${unreadBooks.length} unread books`);

        // Get highly rated read books (4+ stars)
        const highlyRatedReadBooks = readBooks.filter(book => book.rating >= 4);
        const topReadBooks = highlyRatedReadBooks.slice(0, 10); // Top 10 highly rated read books

        if (topReadBooks.length === 0) {
            throw new Error('No highly rated read books found. Please read and rate some books first.');
        }

        if (unreadBooks.length === 0) {
            throw new Error('No unread books found in your library. Please add some books to your "to-read" shelf.');
        }

        // Create reading history summary
        const readingHistory = topReadBooks.map(book =>
            `"${book.title}" by ${book.author} (Rating: ${book.rating}/5)`
        ).join('\n');

        // Create unread books list for recommendations
        const unreadBooksList = unreadBooks.slice(0, 50).map(book =>
            `"${book.title}" by ${book.author}`
        ).join('\n');

        const content = `Based on my reading history of highly rated books:\n\n${readingHistory}\n\nI have these unread books in my library:\n\n${unreadBooksList}\n\nPlease recommend 5 books from my unread list that I would most likely enjoy based on my reading preferences. For each recommendation, explain why it matches my taste based on my highly rated books.`;

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
    } catch (error) {
        console.error('Failed to get book recommendations:', error.message);
        throw error;
    }
}

// Usage: node src/index.js <csv-file> <output-file>
async function main() {
    if (process.argv.length < 4) {
        console.log('Usage: node src/index.js <csv-file> <output-file>');
        console.log('Example: node src/index.js goodreads_library_export-2025.csv recommendations.txt');
        process.exit(1);
    }

    const csvFile = process.argv[2];
    const outputFile = process.argv[3];

    try {
        const recommendations = await getBookRecommendations(csvFile);
        fs.writeFileSync(outputFile, recommendations);
        console.log(`Book recommendations saved to ${outputFile}`);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();
