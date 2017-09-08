const Boom  = require('boom');
const uuid  = require('node-uuid');
const Joi   = require('joi');


exports.register = function(server, options, next) {

    const db = server.app.db;



    var idform = "e142d5e0-932b-11e7-98c8-134629b3a0ca";
    //allformbyidforans (idform);

    function allformbyidforans (id) {




        /*db.forms.aggregate([
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
                reply(docs);
            });*/






















        var formanscomplete = [];
        db.forms.find({_id: idform },function (erro, docs)
            {
                //console.log("Error " + erro);
                if (erro) {
                    return reply(Boom.wrap(erro, 'Internal MongoDB error'));
                }
                formanscomplete = docs; 
                //console.log(formanscomplete[0].questions);
                for (var i = 0; i <= docs[0].questions.length - 1; i++) {
                    //docs.questions[i].answerid id Ans
                    db.answers.find({_id: docs[0].questions[i].answerid },function (err, docss)
                    {
                        //console.log("Error " + err);
                        if (err) {
                            return reply(Boom.wrap(err, 'Internal MongoDB error'));
                        }
                        console.log(docss[0].text);
                        //formanscomplete.push({hola: docss[0].text});
                    })
                }
                console.log('---------');
                console.log(formanscomplete[0]);
            });
    }



    function fillformAnswers(allform){
        var quest = "";
        for (var i = 0; i <= allform[0].questions.length - 1; i++) {
            quest = quest + "<div class=' part" + i + "'><p> [ " + allform[0].all.status + " ] " + allform[0].all.text + "</p>";
            //quest = quest + "<button style='margin: 2px;' type='button' class='btn btn-primary btn-sm' >" + allform[i].res[i].text + "</button>";
            quest = quest + "<hr></div>";
        }
        server.views({
            engines: {
              html: require('handlebars')
            },
            path:'././Pagina/Answers',
            layout:  'answersforms',
            context: {
                    headerAnsa: allform[0].header + "<hr>",
                    questionsAnsdonea: quest,
                    footera: allform[0].footer
            }
        })

        server.route({  
          method: 'GET',
          path: '/justanswers',
          handler: {
            view: 'answersforms'
          }
        })
    
    }











    //PLACEHOLDER
    //--------------------------------------------------------------
    //Here the routes definitions will be inserted in the next steps...

    server.route({
        method: 'GET',
        path: '/answers',
        config:{
            tags: ['api']
        },
        handler: function (request, reply)
        {

            db.answers.find((err, docs) =>
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
        path: '/answersforms/{id}',
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
        method: 'GET',
        path: '/answers/{id}',
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
            console.log('id answer: ---  '+ request.params.id);

            db.answers.find({_id: request.params.id},function (err, docs)
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
        method: 'POST',
        path: '/answers',
        handler: function (request, reply)
        {

            const answers = request.payload;

            //Create an id
            answers._id = uuid.v1();

            db.answers.save(answers, (err, result) =>
            {

                if (err)
                {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                reply(answers);
        });
        },
        config: {
            tags: ['api'],
            validate: {
                payload:
                {
                    text:           Joi.string().required(),
                    value:          Joi.string().required(),
                }
            }
        }
    });

    server.route({
        method: 'PATCH',
        path: '/answers/{id}',
        config:{
            tags: ['api']
        },
        handler: function (request, reply) {

            db.answers.update(
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
                payload: Joi.object({
                    text:           Joi.string().required(),
                    value:          Joi.string().required(),
                }).required().min(1)
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/answers/{id}',
        config:{
            tags: ['api'],
            validate: {
                params: {
                    id: Joi.string().required()
                }
            }
        },
        handler: function (request, reply) {

            db.answers.remove({
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
    name: 'routes-answers'
};
