var crypto = require("crypto");

function UsuariosDAO(connection){
	this._connection = connection();
}

UsuariosDAO.prototype.inserirUsuario = function(usuario, res){
	this._connection.open(function(erro, mongocliente){
		mongocliente.collection("usuarios", function(erro, collection){	
			var senha_criptografada = crypto.createHash("md5").update(usuario.senha).digest("hex");
			usuario.senha = senha_criptografada;

			collection.insert(usuario, {w: 1}, function(err, records){
    			if(err) {
    				var mensagem = 1;
        			res.render('cadastro', {validacao: {}, dadosForm: usuario, mensagem: mensagem});
    				return;
    			}
    			res.render('cadastrar');
			});
	
			mongocliente.close();		
		});
	});
};

UsuariosDAO.prototype.autenticar = function(usuario, req, res){
	this._connection.open(function(erro, mongocliente){
		mongocliente.collection("usuarios", function(erro, collection){

			var senha_criptografada = crypto.createHash("md5").update(usuario.senha).digest("hex");
			usuario.senha = senha_criptografada;
			
			collection.find(usuario).toArray(function(erro, result){
				
				if (result[0] != undefined){
					req.session.autorizado = true;

					req.session.usuario = result[0].usuario;
					req.session.casa = result[0].casa;
				}

				if (req.session.autorizado){
					res.redirect('jogo');
				} else {
					var mensagem;
					res.render('index', {validacao : {}, dadosForm : usuario, mensagem : 1});
				}

			});
			mongocliente.close();
		});
	});
}

module.exports = function(){
	return UsuariosDAO;
}



