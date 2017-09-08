const Boom  = require('boom');
const uuid  = require('node-uuid');
const Joi   = require('joi');


exports.register = function(server, options, next) {

    const db = server.app.db;
    var idform = "511f09b0-94cb-11e7-a3a0-639f6a998573";
    //Modifical id para nuevo form
    
    allformbyid (idform);
    


    //----------------------------------------------------------------------
    //PLACEHOLDER
    //--------------------------------------------------------------
    //Here the routes definitions will be inserted in the next steps...


//--------------JS que usa la pagina
//---js de index
    server.route({  
      method: 'GET',
      path: '/files/js/ConectServices.js',
      handler: function (request, reply) {
        // reply.file() expects the file path as parameter
        reply.file('././Pagina/js/ConectServices.js')
      }
    })
//----------------



    function allformbyid (id){
            db.forms.aggregate([
                {
                    $lookup:
                    {
                        from: "questions",
                        localField: "questions.idquestion",
                        foreignField: "_id",
                        as: "all"
                    }
                },
                {
                    $unwind: "$all"
                },
                {
                    $lookup:
                    {
                        from: "answers",
                        localField: "all.answers.id_answer",
                        foreignField: "_id",
                        as: "allanswers"
                    }
                },
                {
                    $unwind: "$all"
                },
                {
                    $lookup:
                    {
                        from: "answers",
                        localField: "questions.answerid",
                        foreignField: "_id",
                        as: "res"
                    }
                },
                {
                    $match : { _id: id }
                }
            ]).toArray(function (err, docs)
            {
                if (err)
                {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }
                fillform(docs);
            });
    }



    
    





    //-----------------------------------------


    server.route({
        method: 'GET',
        path: '/forms',
        config:{
            tags: ['api']
        },
        handler: function (request, reply)
        {

            db.forms.find((err, docs) =>
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
        path: '/formsid/{id}',
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
            console.log('id forms: '+request.params.id);

            db.forms.find({_id: request.params.id },function (err, docs)
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
        method: 'GET',
        path: '/forms/{id}',
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
            console.log('id '+request.params.id);

            db.forms.aggregate([
                {
                    $lookup:
                    {
                        from: "questions",
                        localField: "questions.idquestion",
                        foreignField: "_id",
                        as: "all"
                    }
                },
                {
                    $unwind: "$all"
                },
                {
                    $lookup:
                    {
                        from: "answers",
                        localField: "all.answers.id_answer",
                        foreignField: "_id",
                        as: "allanswers"
                    }
                },
                {
                    $unwind: "$all"
                },
                {
                    $lookup:
                    {
                        from: "answers",
                        localField: "questions.answerid",
                        foreignField: "_id",
                        as: "res"
                    }
                },
                {
                    $match : { _id: request.params.id }
                }
            ]).toArray(function (err, docs)
            {
                if (err)
                {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }
                reply(docs);
            });
            /*
            db.gastos.find({id_user: request.params.id }).toArray(function (err, docs)
            {
                console.log(err);
                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }
                reply(docs);
            });
            */
        }
    });

    server.route({
        method: 'POST',
        path: '/forms',
        handler: function (request, reply)
        {

            const forms = request.payload;

            //Create an id
            forms._id = uuid.v1();

            db.forms.save(forms, (err, result) =>
            {
                if (err)
                {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                reply(forms);
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
                    header:         Joi.string().required(),
                    footer:         Joi.string().required(),
                    dateanswer:     Joi.optional(),
                    questions:      Joi.optional()
                }
            }
        }
    });

    server.route({
        method: 'PATCH',
        path: '/forms/{id}',
        config:{
            tags: ['api']
        },
        handler: function (request, reply) {

            db.forms.update(
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
                    header:         Joi.string().required(),
                    footer:         Joi.string().required(),
                    dateanswer:     Joi.optional(),
                    questions:      Joi.optional()
                }
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/forms/{id}',
        config:{
            tags: ['api'],
            validate: {
                params: {
                    id: Joi.string().required()
                }
            }
        },
        handler: function (request, reply) {

            db.forms.remove({
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


//----------------------------Vistas
//--------------Formulario

    function fillform(allform){
        var quest = "";
        var d = new Date();
        var saludo;

        var curr_date = d.getDate();
        var curr_month = d.getMonth() + 1; //Months are zero based
        var curr_year = d.getFullYear();

        var dia= curr_date + "-" + curr_month + "-" + curr_year;
        for (var i = 0; i <= allform[0].questions.length - 1; i++) {
            quest = quest + "<div><p> <strong>[ " + allform[0].all.status + " ]</strong> " + allform[0].all.text + "</p>";
            for (var z = 0; z <= allform[i].all.answers.length - 1; z++) {
                quest = quest + "<button id='" + allform[i].allanswers[z]._id + "' style='margin: 2px;' type='button' class='btn btn-default btn-sm part" + i + "' value= '" + i + " " + allform[i].allanswers[z]._id + "' onclick='sendinfo(value)'>" + allform[i].allanswers[z].text + "</button>";
            }
            quest = quest + "<hr></div>";
        }
        if (d.getHours()>=12){
            saludo = "Good Afternoon"
        }else {
            saludo = "Good Morning"
        }
        server.views({
            engines: {
              html: require('handlebars')
            },
            path:'././Pagina',
            layout:  'index',
            context: {
                    Good: saludo,
                    datenow: dia,
                    header: allform[0].header + "<hr>",
                    questionsAns: quest,
                    footer: allform[0].footer
            },
            helpersPath: '././Pagina/js'
        })

        server.route({  
          method: 'GET',
          path: '/formasn',
          handler: {
            view: 'index'
          }
        })
    }

//------------Respuestas



    return next();
};

exports.register.attributes = {
    name: 'routes-mailforms'
};
