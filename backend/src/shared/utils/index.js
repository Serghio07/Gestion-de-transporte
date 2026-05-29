// Shared utilities - Logger, pagination, response helpers, validators

const logger = {
  info: (message, data) => {
    const log = `[${new Date().toISOString()}] [INFO] ${message}`;
    console.log(log, data || '');
  },
  warn: (message, data) => {
    const log = `[${new Date().toISOString()}] [WARN] ${message}`;
    console.warn(log, data || '');
  },
  error: (message, data) => {
    const log = `[${new Date().toISOString()}] [ERROR] ${message}`;
    console.error(log, data?.message || data || '');
  },
  debug: (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      const log = `[${new Date().toISOString()}] [DEBUG] ${message}`;
      console.log(log, data || '');
    }
  }
};

const pagination = (page = 1, limit = 10, total) => {
  page = Math.max(1, parseInt(page));
  limit = Math.max(1, Math.min(100, parseInt(limit)));
  
  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    hasMore: page < Math.ceil(total / limit)
  };
};

const formatResponse = (success, message, data = null, pagination = null) => {
  const response = {
    success,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) response.data = data;
  if (pagination) response.pagination = pagination;

  return response;
};

const validators = {
  isValidEmail: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  },
  
  isValidPassword: (password) => {
    return password && password.length >= 6;
  },

  isValidId: (id) => {
    return id && !isNaN(id) && id > 0;
  },

  isValidPhone: (phone) => {
    const re = /^[0-9]{7,15}$/;
    return re.test(String(phone).replace(/[^\d]/g, ''));
  }
};

const sanitizers = {
  trimString: (str) => {
    return typeof str === 'string' ? str.trim() : str;
  },

  removeNullValues: (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined)
    );
  },

  sanitizeEmail: (email) => {
    return String(email).toLowerCase().trim();
  }
};

module.exports = {
  logger,
  pagination,
  formatResponse,
  validators,
  sanitizers
};
