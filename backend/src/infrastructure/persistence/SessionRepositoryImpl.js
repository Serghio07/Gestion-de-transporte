const SessionRepository = require('../../domain/repositories/SessionRepository');

class SessionRepositoryImpl extends SessionRepository {
  constructor() {
    super();
  }
}

module.exports = SessionRepositoryImpl;
