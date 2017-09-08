exports.register = function(server) {


	server.views({
	    engines: {
	      html: require('handlebars')
	    },
	    path: __dirname + '././././Pagina',
	    layout:  'index',
	    context: {
	            header: 'My home page'
	    }
	})


	server.route({  
	  method: 'GET',
	  path: '/formasn',
	  handler: {
	    view: 'index'
	  }
	})

};