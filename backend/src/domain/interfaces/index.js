// Domain interfaces (Ports)

class IRepository {
  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findAll(options = {}) {
    throw new Error('Method not implemented');
  }

  async create(data) {
    throw new Error('Method not implemented');
  }

  async update(id, data) {
    throw new Error('Method not implemented');
  }

  async delete(id) {
    throw new Error('Method not implemented');
  }
}

class IAuthService {
  async generateTokens(user) {
    throw new Error('Method not implemented');
  }

  async verifyToken(token) {
    throw new Error('Method not implemented');
  }

  async hashPassword(password) {
    throw new Error('Method not implemented');
  }

  async comparePassword(password, hash) {
    throw new Error('Method not implemented');
  }
}

class IEmailService {
  async send(to, subject, content) {
    throw new Error('Method not implemented');
  }
}

class ICacheService {
  async get(key) {
    throw new Error('Method not implemented');
  }

  async set(key, value, ttl) {
    throw new Error('Method not implemented');
  }

  async delete(key) {
    throw new Error('Method not implemented');
  }
}

module.exports = {
  IRepository,
  IAuthService,
  IEmailService,
  ICacheService
};
