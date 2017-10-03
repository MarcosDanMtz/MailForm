'use strict';

const Hapi          = require('hapi');
const Inert         = require('inert');
const Vision        = require('vision');
const mongojs       = require('mongojs');
const HapiSwagger   = require('hapi-swagger');
const db            = require('./assets/config/database');
/*var express         = require('express');
var app             = express();
var path            = require('path');*/

const server        = new Hapi.Server();
var port            = process.env.PORT || 3000;


const optionsSwager =
{
    info: {
        'title': 'Feedback API Documentation',
        'version': '0.0.1',
    }
};

server.connection({ port: port});
//server.connection({ routes: { cors: true } });

server.app.db = db.db;
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

/*server.route({
    method: 'GET',
    path: '/{name}',
    handler: function (request, reply) {
        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
});*/

//Load plugins and start server
server.register(
    [
        Inert,
        Vision,
        {
            'register': HapiSwagger,
            'options': optionsSwager
        },
        //require('hapi-cors'),
        require('./assets/modules/mailforms'),
        require('./assets/modules/answers'),
        require('./assets/modules/questions'),
        //require('./Pagina/js/ConectServices.js'),
        require('./assets/modules/answers-admin.js'),
        require('./assets/modules/admin-forms.js')
        //require('./assets/gastos'),
        //require('./assets/gastosTipo'),
        //require('./assets/usuarios'),
    ],
    (err) =>{
        if(err)
        {
            throw err;
        }

        // Start the server
        server.start((err) =>{
            console.log('Server running at:', server.info.uri);
        });
    });
