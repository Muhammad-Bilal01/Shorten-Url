const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { nanoid } = require('nanoid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Temporary in-memory database
const urlDatabase = new Map(); // shortCode -> { originalUrl, createdAt, visitCount }
const urlToCodeMap = new Map(); // originalUrl -> shortCode (for deduplication)

// Utility functions
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function generateShortCode() {
  return nanoid(8); // Generate 8-character short code
}

// Routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    totalUrls: urlDatabase.size 
  });
});

// Create shortened URL
app.post('/api/shorten', (req, res) => {
  try {
    const { url } = req.body;

    // Validation
    if (!url) {
      return res.status(400).json({ 
        error: 'URL is required',
        message: 'Please provide a valid URL to shorten'
      });
    }

    if (!isValidUrl(url)) {
      return res.status(400).json({ 
        error: 'Invalid URL',
        message: 'Please provide a valid HTTP or HTTPS URL'
      });
    }

    // Check if URL already exists
    if (urlToCodeMap.has(url)) {
      const existingCode = urlToCodeMap.get(url);
      const existingData = urlDatabase.get(existingCode);
      
      return res.json({
        success: true,
        shortUrl: `${req.protocol}://${req.get('host')}/${existingCode}`,
        originalUrl: url,
        shortCode: existingCode,
        visitCount: existingData.visitCount,
        createdAt: existingData.createdAt,
        message: 'URL already shortened'
      });
    }

    // Generate unique short code
    let shortCode;
    do {
      shortCode = generateShortCode();
    } while (urlDatabase.has(shortCode));

    // Store in database
    const urlData = {
      originalUrl: url,
      createdAt: new Date().toISOString(),
      visitCount: 0
    };

    urlDatabase.set(shortCode, urlData);
    urlToCodeMap.set(url, shortCode);

    res.status(201).json({
      success: true,
      shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}`,
      originalUrl: url,
      shortCode: shortCode,
      visitCount: 0,
      createdAt: urlData.createdAt,
      message: 'URL shortened successfully'
    });

  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to shorten URL'
    });
  }
});

// Redirect to original URL
app.get('/:shortCode', (req, res) => {
  try {
    const { shortCode } = req.params;

    if (!urlDatabase.has(shortCode)) {
      return res.status(404).json({ 
        error: 'Short URL not found',
        message: 'The requested short URL does not exist'
      });
    }

    const urlData = urlDatabase.get(shortCode);
    
    // Increment visit count
    urlData.visitCount += 1;
    urlDatabase.set(shortCode, urlData);

    // Redirect to original URL
    res.redirect(302, urlData.originalUrl);

  } catch (error) {
    console.error('Error redirecting URL:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to redirect to URL'
    });
  }
});

// Get analytics for a short URL
app.get('/api/analytics/:shortCode', (req, res) => {
  try {
    const { shortCode } = req.params;

    if (!urlDatabase.has(shortCode)) {
      return res.status(404).json({ 
        error: 'Short URL not found',
        message: 'The requested short URL does not exist'
      });
    }

    const urlData = urlDatabase.get(shortCode);

    res.json({
      success: true,
      shortCode: shortCode,
      originalUrl: urlData.originalUrl,
      shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}`,
      visitCount: urlData.visitCount,
      createdAt: urlData.createdAt,
      lastAccessed: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to get analytics'
    });
  }
});

// Get all URLs (for debugging/admin purposes)
app.get('/api/urls', (req, res) => {
  try {
    const urls = Array.from(urlDatabase.entries()).map(([shortCode, data]) => ({
      shortCode,
      originalUrl: data.originalUrl,
      shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}`,
      visitCount: data.visitCount,
      createdAt: data.createdAt
    }));

    res.json({
      success: true,
      totalUrls: urls.length,
      urls: urls
    });

  } catch (error) {
    console.error('Error getting all URLs:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to get URLs'
    });
  }
});

// Delete a short URL
app.delete('/api/urls/:shortCode', (req, res) => {
  try {
    const { shortCode } = req.params;

    if (!urlDatabase.has(shortCode)) {
      return res.status(404).json({ 
        error: 'Short URL not found',
        message: 'The requested short URL does not exist'
      });
    }

    const urlData = urlDatabase.get(shortCode);
    
    // Remove from both maps
    urlDatabase.delete(shortCode);
    urlToCodeMap.delete(urlData.originalUrl);

    res.json({
      success: true,
      message: 'Short URL deleted successfully',
      deletedUrl: urlData.originalUrl
    });

  } catch (error) {
    console.error('Error deleting URL:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to delete URL'
    });
  }
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: 'The requested endpoint does not exist'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 URL Shortener server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📝 API Documentation:`);
  console.log(`   POST /api/shorten - Create short URL`);
  console.log(`   GET /:shortCode - Redirect to original URL`);
  console.log(`   GET /api/analytics/:shortCode - Get URL analytics`);
  console.log(`   GET /api/urls - Get all URLs`);
  console.log(`   DELETE /api/urls/:shortCode - Delete short URL`);
});

module.exports = app;
