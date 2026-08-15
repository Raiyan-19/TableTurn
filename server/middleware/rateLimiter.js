// In-memory Rate Limiter Middleware for API Protection (VAPT-08)
const rateMap = new Map();

/**
 * Creates a rate limiting middleware function
 * @param {Object} options - Configuration options
 * @param {number} options.windowMs - Time window in milliseconds (default: 15 minutes)
 * @param {number} options.max - Maximum requests allowed per window per IP (default: 100)
 * @param {string} options.message - Custom error message
 */
const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 100,
  message = 'Too many requests from this IP. Please try again later.',
} = {}) => {
  // Cleanup stale entries every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of rateMap.entries()) {
      if (now > data.resetTime) {
        rateMap.delete(ip);
      }
    }
  }, 5 * 60 * 1000).unref();

  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();

    const record = rateMap.get(ip) || { count: 0, resetTime: now + windowMs };

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
    } else {
      record.count++;
    }

    rateMap.set(ip, record);

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - record.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

    if (record.count > max) {
      return res.status(429).json({
        success: false,
        message,
      });
    }

    next();
  };
};

// Specific limiters for different sensitive endpoints
const isProd = process.env.NODE_ENV === 'production';

const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: isProd ? 30 : 500, // Generous threshold in development
  message: 'Too many authentication attempts. Please try again after 15 minutes.',
});

const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: isProd ? 300 : 2000,
  message: 'Too many requests to the API. Please slow down.',
});

module.exports = {
  createRateLimiter,
  authLimiter,
  apiLimiter,
};

