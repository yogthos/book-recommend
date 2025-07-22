import fs from 'fs';
import csv from 'csv-parser';

export function parseGoodreadsCSV(inputFile) {
    return new Promise((resolve, reject) => {
        const books = [];

        fs.createReadStream(inputFile)
            .pipe(csv())
            .on('data', (row) => {
                // Extract relevant fields with fallbacks for different CSV formats
                const book = {
                    title: row['Title'] || row['title'],
                    author: row['Author'] || row['author'],
                    isbn: row['ISBN'] || row['isbn'],
                    rating: parseFloat(row['My Rating'] || row['Rating'] || row['rating']) || 0,
                    dateRead: row['Date Read'] || row['date_read'],
                    shelves: row['Bookshelves'] || row['Shelves'] || row['shelves'] || '',
                    readStatus: row['Exclusive Shelf'] || row['Read Status'] || row['read_status'] || '',
                    dateAdded: row['Date Added'] || row['date_added']
                };

                // Determine if book is read based on Goodreads CSV structure
                // A book is read if:
                // 1. It has a Date Read (not empty) AND the read status is not "to-read"
                // 2. OR it has "read" in Exclusive Shelf
                // 3. OR it has a rating > 0 (indicating it was read and rated)
                const hasDateRead = book.dateRead && book.dateRead.trim() !== '';
                const isInReadShelf = book.readStatus === 'read';
                const isInToReadShelf = book.readStatus === 'to-read';
                const hasRating = book.rating > 0;

                // A book is read if it has a read date AND is not marked as to-read
                // OR if it's explicitly marked as read
                // OR if it has a rating (indicating it was read)
                book.isRead = (hasDateRead && !isInToReadShelf) || isInReadShelf || hasRating;

                // Clean up shelves
                book.shelves = book.shelves ? book.shelves.split(',').map(s => s.trim()).filter(s => s) : [];

                books.push(book);
            })
            .on('end', () => {
                console.log(`Successfully parsed ${books.length} books from CSV`);
                resolve(books);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}
