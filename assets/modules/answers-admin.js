const Boom  = require('boom');
const uuid  = require('node-uuid');
const Joi   = require('joi');
var moment = require('moment');


exports.register = function(server, options, next) {

    const db = server.app.db;

    //Creating js for the view
    server.route({  
      method: 'GET',
      path: '/admin-ans/js/ans.js',
      handler: function (request, reply) {
        // reply.file() expects the file path as parameter
        reply.file('././Pagina/admin-answers/admin-ans-js/admin-ans.js')
      }
    })



    //Creating view
    server.views({
            engines: {
              html: require('handlebars')
            },
            path:'././Pagina/admin-answers/',
            layout:  'admin-answers',
            context: {
                    
            }
        })

    server.route({  
      method: 'GET',
      path: '/admin-answers',
      handler: {
        view: 'admin-answers'
      }
    })




    //--------------JS que usa la pagina
    //---js de index



    return next();
};

exports.register.attributes = {
    name: 'answers-admin'
};
