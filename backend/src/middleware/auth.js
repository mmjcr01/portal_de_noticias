/**
 * Middleware de Autenticação e Autorização
 * Verifica se o usuário está logado e tem permissões adequadas.
 */

/**
 * Middleware para verificar se o usuário está logado.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next(); // Usuário logado, continua
  }
  res.status(401).json({ error: 'Acesso negado. Faça login primeiro.' });
  // Ou redirecione: res.redirect('/login');
};

/**
 * Middleware para verificar se o usuário é administrador (admin_usuario === 2).
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.admin_usuario === 1) {
    return next(); // É admin, continua
  }
  res.status(403).json({ error: 'Acesso negado. Você não tem permissões de administrador.' });
  // Ou redirecione/renderize uma página: res.render('acesso-negado');
};


exports.isAuthenticatedAndAdmin = [exports.isAuthenticated, exports.isAdmin];