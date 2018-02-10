module.exports.home = function(application, req, res){
	res.render('index', {validacao : {}, dadosForm : {}, mensagem : {}});
}

module.exports.autenticar = function(application, req, res){
	
	var dadosForm = req.body;

	req.assert('usuario', 'Usuario não pode ser vazio').notEmpty();
	req.assert('senha', 'Senha não pode ser vazio').notEmpty();

	var erros = req.getValidationResult();

	 erros.then(function(result) {
    	if (!result.isEmpty()) {
    		res.render("index", {validacao : result.array(), dadosForm : dadosForm, mensagem : {}});
      		return;	
    	}

    	var connection = application.config.dbConnection;
    	var UsuariosDAO = new application.app.models.UsuariosDAO(connection);

    	UsuariosDAO.autenticar(dadosForm, req, res);

    });

}