import rateLimit from 'express-rate-limit';

// Create a rate limiter for AI requests
const aiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute window
    max: 2, // limit each IP to 2 requests per windowMs
    message: {
        error: 'Rate limit exceeded',
        details: 'Please wait 60 seconds before making another request.',
        retryAfter: 60
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => false, // Don't skip any requests
    handler: (req, res) => {
        res.status(429).json({
            error: 'Rate limit exceeded',
            details: 'Please wait 60 seconds before making another request.',
            retryAfter: 60
        });
    }
});

export default aiLimiter;