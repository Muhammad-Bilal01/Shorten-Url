# URL Shortener Service

A complete URL shortening service built with Express.js that provides URL shortening, redirection, and analytics tracking.

## Features

- ✅ **URL Shortening**: Convert long URLs into short, shareable links
- ✅ **Visit Tracking**: Track total visits for each shortened URL
- ✅ **Analytics**: Get detailed analytics for any short URL
- ✅ **Deduplication**: Same URLs get the same short code
- ✅ **Rate Limiting**: Prevent abuse with request rate limiting
- ✅ **Security**: Helmet.js for security headers
- ✅ **CORS Support**: Cross-origin resource sharing enabled
- ✅ **Input Validation**: Comprehensive URL validation
- ✅ **Error Handling**: Robust error handling and responses

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### 1. Health Check
```http
GET /health
```
Returns server status and total URLs count.

### 2. Create Short URL
```http
POST /api/shorten
Content-Type: application/json

{
  "url": "https://example.com/very/long/url"
}
```

**Response:**
```json
{
  "success": true,
  "shortUrl": "http://localhost:3000/abc12345",
  "originalUrl": "https://example.com/very/long/url",
  "shortCode": "abc12345",
  "visitCount": 0,
  "createdAt": "2024-01-01T12:00:00.000Z",
  "message": "URL shortened successfully"
}
```

### 3. Redirect to Original URL
```http
GET /:shortCode
```
Redirects to the original URL and increments visit count.

### 4. Get Analytics
```http
GET /api/analytics/:shortCode
```

**Response:**
```json
{
  "success": true,
  "shortCode": "abc12345",
  "originalUrl": "https://example.com/very/long/url",
  "shortUrl": "http://localhost:3000/abc12345",
  "visitCount": 42,
  "createdAt": "2024-01-01T12:00:00.000Z",
  "lastAccessed": "2024-01-01T15:30:00.000Z"
}
```

### 5. Get All URLs
```http
GET /api/urls
```
Returns all shortened URLs (useful for debugging).

### 6. Delete Short URL
```http
DELETE /api/urls/:shortCode
```
Deletes a specific short URL.

## Usage Examples

### Using curl:

1. **Create a short URL:**
```bash
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.google.com"}'
```

2. **Get analytics:**
```bash
curl http://localhost:3000/api/analytics/abc12345
```

3. **Visit the short URL:**
```bash
curl -L http://localhost:3000/abc12345
```

### Using JavaScript (fetch):

```javascript
// Create short URL
const response = await fetch('http://localhost:3000/api/shorten', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://www.example.com/very/long/url'
  })
});

const data = await response.json();
console.log('Short URL:', data.shortUrl);

// Get analytics
const analytics = await fetch(`http://localhost:3000/api/analytics/${data.shortCode}`);
const analyticsData = await analytics.json();
console.log('Visit count:', analyticsData.visitCount);
```

## Database

This service uses an **in-memory database** (JavaScript Map) for temporary storage. This means:

- ✅ **Fast**: No database setup required
- ✅ **Simple**: Perfect for development and testing
- ⚠️ **Temporary**: Data is lost when server restarts
- ⚠️ **Memory**: Limited by available RAM

For production use, consider integrating with:
- MongoDB
- PostgreSQL
- Redis
- SQLite

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Helmet.js**: Security headers
- **Input Validation**: URL validation
- **CORS**: Cross-origin resource sharing
- **Error Handling**: No sensitive information in errors

## Environment Variables

- `PORT`: Server port (default: 3000)

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error type",
  "message": "Human-readable error message"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error

## Development

The server includes:
- **Nodemon**: Auto-restart on file changes
- **Comprehensive logging**: Console output for debugging
- **Error tracking**: Detailed error logging

## License

ISC
