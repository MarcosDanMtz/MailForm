const Boom  = require('boom');
const uuid  = require('node-uuid');
const Joi   = require('joi');
var moment = require('moment');


exports.register = function(server, options, next) {

    const db = server.app.db;

    //Creating js for the view
    server.route({  
      method: 'GET',
      path: '/admin-forms/js/admin-fomrs.js',
      handler: function (request, reply) {
        // reply.file() expects the file path as parameter
        reply.file('././Pagina/admin-forms/admin-forms-js/admin-forms.js')
      }
    })



    //Creating view
    server.views({
            engines: {
              html: require('handlebars')
            },
            path:'././Pagina/admin-forms/',
            layout:  'admin-forms',
            context: {
                    
            }
        })

    server.route({  
      method: 'GET',
      path: '/admin-forms',
      handler: {
        view: 'admin-forms'
      }
    })




    //--------------JS que usa la pagina
    //---js de index



    return next();
};

exports.register.attributes = {
    name: 'answers-forms'
};
