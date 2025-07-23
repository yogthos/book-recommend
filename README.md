# Book Recommendations

A book recommendation system that analyzes your Goodreads/Bookwyrm library export and uses DeepSeek to suggest books from your unread list based on your reading preferences.

## Features

- **Goodreads/Bookwyrm Integration**: Works with standard book library CSV exports
- **Highly Rated Focus**: Prioritizes recommendations based on your 4+ star rated books
- **Detailed Explanations**: Provides reasoning for each recommendation

## How It Works

1. **Parses your CSV export** to extract your reading history
2. **Identifies your highly rated books** (4+ stars) as preference indicators
3. **Analyzes your unread books** from your "to-read" shelf
4. **Uses DeepSeek to match** your reading preferences with unread books
5. **Generates personalized recommendations** with explanations

## Prerequisites

- Node.js (v14 or higher)
- A Goodreads/Bookwyrm library export (CSV format)
- Either:
  - A DeepSeek API key, OR
  - Ollama installed locally with a compatible model

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Setup

### Option 1: Using DeepSeek (Cloud-based)

1. **Get a DeepSeek API Key**:
   - Sign up at [DeepSeek](https://platform.deepseek.com/)
   - Generate an API key from your dashboard

2. **Export your Goodreads library**:
   - Go to
     - Goodreads → My Books → Import/Export
     - Bookwyrm → Profile → Settings → Export Book List
   - Download your library as CSV

3. **Set your API key**:
   ```bash
   export DEEPSEEK_API_KEY="<your-api-key-here>"
   ```

### Option 2: Using Ollama (Local)

1. **Install Ollama**:
   - Visit [Ollama.ai](https://ollama.ai/) and follow the installation instructions
   - Pull a compatible model (recommended: `qwen3:32b`):
     ```bash
     ollama pull qwen3:32b
     ```

2. **Export your Goodreads library** (same as above):
   - Go to
     - Goodreads → My Books → Import/Export
     - Bookwyrm → Profile → Settings → Export Book List
   - Download your library as CSV

3. **Enable Ollama mode**:
   ```bash
   export USE_OLLAMA=true
   ```

## Usage

Run the recommendation generator:

```bash
node src/index.js <goodreads-export.csv> <output-file.txt>
```

### Examples

**Using DeepSeek (default):**
```bash
node src/index.js goodreads_library_export-2025.csv recommendations.txt
```

**Using Ollama:**
```bash
export USE_OLLAMA=true
node src/index.js goodreads_library_export-2025.csv recommendations.txt
```

## Input Format

The tool expects a Goodreads CSV export with these columns:
- `Title` | `title` - Book title
- `Author` | `author_text` - Book author
- `My Rating` | `rating` - Your rating (1-5 stars)
- `Date Read` - When you finished the book
- `Exclusive Shelf` | `shelf` - Read status (read, to-read, etc.)

## Output

The tool generates recommendations including:
- 5 personalized book recommendations from your unread list
- Explanations for why each book matches your preferences
- References to your highly rated books that influenced the choice
- Honorable mentions for additional options

## Example Output

```
Based on your highly rated books—which include epic fantasy (John Gwynne, Adrian Tchaikovsky), thought-provoking sci-fi (Adrian Tchaikovsky, Blake Crouch), and political/social nonfiction (John M. Ross)—here are five strong recommendations from your unread list:

### 1. Bee Speaker (Dogs of War, #3) – Adrian Tchaikovsky
Why? You've rated Shroud (5/5) and City of Last Chances (4/5) highly, both by Tchaikovsky, who excels in blending deep worldbuilding with philosophical and political themes...
```

## Troubleshooting

**"No highly rated read books found"**
- Make sure you have books rated 4+ stars in your Goodreads library
- Check that your CSV export includes the rating column

**"No unread books found"**
- Ensure you have books in your "to-read" shelf on Goodreads
- Verify the CSV export includes the correct shelf information

**API Key Error (DeepSeek)**
- Make sure `DEEPSEEK_API_KEY` environment variable is set
- Verify your API key is valid and has sufficient credits

**Ollama Connection Error**
- Ensure Ollama is running: `ollama serve`
- Verify the model is installed: `ollama list`
- Check that Ollama is accessible at `http://localhost:11434`

## Dependencies

- `axios` - HTTP client for API calls
- `csv-parser` - CSV file parsing
- `deepseek` - DeepSeek AI API integration (when using DeepSeek)
- Ollama (when using local models)

## License

MIT

## Contributing

Feel free to submit issues or pull requests to improve the recommendation algorithm or add support for other book platforms.