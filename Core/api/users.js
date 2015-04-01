var mysql = require('./mysql.js')
	users = require('./users.js');

function Login(data, req, res) {
	if(req.session.user == null) {
		if(data.username != "" && data.password != "") {
			mysql.getConnection(function(error, getConnection) {
				if(error)
					console.log(error);
				else {
					getConnection.query({
						sql: "SELECT * users WHERE (username = ? OR mail = ?) AND password = ?",
						values: [data.username, data.username, data.password]
					}, function(error, dRow) {
						if(error)
							console.log(error);
						else {
							req.session.user = dRow.id;
							//users.user[dRow.id] = {"username":dRow.username,"email":dRow.mail,"ticket":dRow.ticket,"mision":dRow.motto,"look":dRow.look,"credits":dRow.credits,"duckets":dRow.money};
						}
					});
				}
				getConnection.release();
			});
		} else {
			console.log("no paso");
		}
	} else {
		res.redirect('/me');
	}
}

function Registration(data, req, res) {
	if(req.session.user == null) {
	} else {
		res.redirect('/me');
	}
}

function Logout(req, res) {
	if(req.session.user != null) {
		req.session.destroy(function(error) {
			//Error
		});
		res.redirect('/index');
	} else {
		res.redirect('/index');
	}
}

module.exports.Login = Login;
module.exports.Registration = Registration;
module.exports.Logout = Logout;