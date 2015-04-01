var mysql = require('./mysql.js')
    users = require('./users.js')
    http = require('http')
    express = require('express')
    session = require('express-session')
    bodyParser = require('body-parser')
    jade = require('jade')
    server = express()
    ConfigurationData = require('../ConfigurationData.json').Server

    _array = {"server":{"theme":"rows"}, "page":{"index":{"title":"Bienvenid@"}}};
    user = {};

    function Main() {
    	mysql.getConnection(function(error, getConnection) {
    		console.log('[Main] -> Starting mysql connection...');
    		if (error)
    			throw error;
    		else {
    			console.log('[Main] -> Mysql connection started!');
    			getConnection.query("SELECT * FROM Rows_settings", function(error, dRows) {
    				if (error)
    					console.log(error);
    				else {
    					for (var i in dRows) {
                var key = dRows[i].key;
                var value = dRows[i].value;
                _array.server.key = value;
                //console.log(dRows + " = " + key + " = " + _array.server.key);
    					}
    					Server();
    				}
            getConnection.release();
    			});
    		}
    	});
    }
    module.exports._array = _array;
    module.exports.user = user;
    module.exports.Main = Main;

    function Server() {
    	server.set('port', ConfigurationData.port);
    	server.set('views', _array.server.dir + '/public_theme/' + _array.server.theme + '/');
    	server.set('view engine', 'jade');
      //server.use(express.favicon());
    	server.use(bodyParser.json());
  		server.use(bodyParser.urlencoded({extended:true}));
  		server.use(session({resave:true, saveUninitialized:true, secret:"h6wXy@{QhFAK"}));
  		server.use(express.static(_array.server.dir + '/public_theme/' + _array.server.theme + '/gallery/styles')); //Public styles
  		server.use(express.static(_array.server.dir + '/public_theme/' + _array.server.theme + '/gallery/images')); //Public images
  		server.use(function(req, res, next) {
        if(_array.server.maintenance == true)
          res.render('maintenance');
        next();
      });
      Pages();
  		http.createServer(server).listen(ConfigurationData.port, function(){
    		console.log('[Main] -> Server started in the port ' + ConfigurationData.port);
  		});
    }

    function Pages() {
    	/* Paginas principales */
  		server.get('', function(req, res) {
  			res.render('index', {"s":_array.server});
  		});
  		server.get('/:page', function(req, res) {
        if(req.params.page == "logout")
          users.Logout(req, res);
        else if(req.params.page == "me" || req.params.page == "comunidad" || req.params.page == "client") {
          if(req.session.user == null)
            res.redirect('/index');
          else
            res.render(req.params.page, {"s":_array.server,"u":user[req.session.user]});
        }
        else
          res.render(req.params.page, {"s":_array.server});
  		});
      server.post('/account-submit', function(req, res) {
        users.Login({"username":req.body.email,"password":req.body.password}, req, res);
      });
      server.post('/registration', function(req, res) {
        
      });

  		/* Panel de administración */
      server.get('/asset', function(req, res) {
        res.render('asset/index');
      });
      server.get('/asset/:page', function(req, res) {
        res.render('asset/' + req.params.page);
      });
      server.post('/asset/submit', function(req, res) {
        
      });
    }