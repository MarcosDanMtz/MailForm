const Boom  = require('boom');
const uuid  = require('node-uuid');
const Joi   = require('joi');



exports.register = function(server, options, next) {

    const db = server.app.db;



    //Creating js for the view
    // server.route({
    //   method: 'GET',
    //   path: '/admin-question/js/question.js',
    //   handler: function (request, reply) {
    //     // reply.file() expects the file path as parameter
    //     reply.file('././Pagina/admin-questions/admin-questions-js/questAdmin.js')
    //   }
    // })



    //Creating view
    // server.views({
    //         engines: {
    //           html: require('handlebars')
    //         },
    //         path:'././Pagina/admin-questions/',
    //         layout:  'admin-questions',
    //         context: {
    //
    //         }
    //     })
    //
    // server.route({
    //   method: 'GET',
    //   path: '/admin-questions',
    //   handler: {
    //     view: 'admin-questions'
    //   }
    // })

    //PLACEHOLDER
    //--------------------------------------------------------------
    //Here the routes definitions will be inserted in the next steps...


    server.route({
        method: 'GET',
        path: '/forms-answers',
        config:{
            tags: ['api']
        },
        handler: function (request, reply)
        {

            db.formsanswers.find((err, docs) =>
            {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                reply(docs);
        });

        }
    });


    server.route({
        method: 'GET',
        path: '/forms-answers/{id}',
        config:{
            tags: ['api'],
            validate: {
                params: {
                    id: Joi.string().required()
                }
            }
        },
        handler: function (request, reply)
        {
            console.log('id questions: '+request.params.id);

            db.questions.find({_id: request.params.id },function (err, docs)
            {
                console.log(err);

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                reply(docs);
            })


        }
    });

        server.route({
        method: 'PATCH',
        path: '/forms-answers/{id}',
        config:{
            tags: ['api']
        },
        handler: function (request, reply) {

            db.formsanswers.update(
                {
                    _id: request.params.id
                },
                {
                    $set: request.payload
                },
                function (err, result)
                {

                    if (err)
                    {
                        return reply(Boom.wrap(err, 'Internal MongoDB error'));
                    }

                    if (result.n === 0)
                    {
                        return reply(Boom.notFound());
                    }

                    reply().code(204);
                });
        },
        config: {
            tags: ['api'],
            validate: {
                params: {
                    id: Joi.string().required()
                },
                payload:
                {
                  idform:         Joi.string().required(),
                  createdate:     Joi.date().iso().optional(),
                  answers:        Joi.optional()
                }
            }
        }
    });


    server.route({
        method: 'POST',
        path: '/forms-answers',
        handler: function (request, reply)
        {

            const formsanswers = request.payload;

            //Create an id
            formsanswers._id = uuid.v1();
            db.formsanswers.save(formsanswers, (err, result) =>
            {
                if (err)
                {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                reply(formsanswers);
            });
        },
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            tags: ['api'],
            validate: {
                payload:
                {
                    idform:         Joi.string().required(),
                    createdate:     Joi.date().iso().optional(),
                    answers:        Joi.optional()
                }
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/forms-answers/{id}',
        config:{
            tags: ['api'],
            validate: {
                params: {
                    id: Joi.string().required()
                }
            }
        },
        handler: function (request, reply) {

            db.formsanswers.remove({
                _id: request.params.id
            }, function (err, result) {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                if (result.n === 0) {
                    return reply(Boom.notFound());
                }

                reply().code(204);
            });
        }
    });




    return next();
};

exports.register.attributes = {
    name: 'routes-forms-answers'
};
