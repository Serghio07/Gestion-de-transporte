const { Session } = require('../../models');

class SessionRepository {
  async create(data) {
    return await Session.create(data);
  }

  async findByIdAndUserId(sessionId, usuarioId) {
    return await Session.findOne({
      where: {
        id: sessionId,
        usuario_id: usuarioId,
        is_active: true
      }
    });
  }

  async findAllByUserId(usuarioId, includeInactive = false) {
    return await Session.findAll({
      where: {
        usuario_id: usuarioId,
        ...(includeInactive ? {} : { is_active: true })
      },
      order: [['last_activity_at', 'DESC']]
    });
  }

  async findByRefreshTokenHash(tokenHash) {
    return await Session.findOne({
      where: {
        refresh_token_hash: tokenHash,
        is_active: true
      }
    });
  }

  async update(sessionId, data) {
    return await Session.update(data, {
      where: { id: sessionId }
    });
  }

  async deactivate(sessionId) {
    return await Session.update(
      { is_active: false },
      { where: { id: sessionId } }
    );
  }

  async deactivateAllByUserId(usuarioId, exceptSessionId = null) {
    const where = { usuario_id: usuarioId };
    if (exceptSessionId) {
      where.id = { [require('sequelize').Op.ne]: exceptSessionId };
    }
    return await Session.update(
      { is_active: false },
      { where }
    );
  }

  async cleanupExpiredSessions() {
    return await Session.destroy({
      where: {
        expires_at: { [require('sequelize').Op.lt]: new Date() }
      }
    });
  }
}

module.exports = SessionRepository;
