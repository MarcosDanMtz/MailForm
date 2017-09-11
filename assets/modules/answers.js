const Boom  = require('boom');
const uuid  = require('node-uuid');
const Joi   = require('joi');
var moment = require('moment');


exports.register = function(server, options, next) {

    const db = server.app.db;



    var idform = "53375f30-9738-11e7-88d9-1113c020cefd";
    //allformbyidforans (idform);

    function allformbyidforans (id) {
        console.log('rs');
        var anstext = [];
        var anstosend = [];
        db.forms.aggregate([
                {
                    $lookup:
                    {
                        from: "questions",
                        localField: "questions.idquestion",
                        foreignField: "_id",
                        as: "allquestions"
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
                for (var i = 0; i <= docs[0].questions.length - 1; i++) {
                    //docs.questions[i].answerid id Ans
                    db.answers.find({_id: docs[0].questions[i].answerid },function (err, docss)
                    {
                        //console.log("Error " + err);
                        if (err) {
                            return reply(Boom.wrap(err, 'Internal MongoDB error'));
                        }

                        if (!docss == [])
                        {
                            anstext.push(docss[0].text);
                            console.log(docss[0].text);
                            console.log(anstext.length);
                            if (anstext.length ==  docs[0].questions.length){
                                console.log("Estoy dentro");
                                fillformAnswers(docs, anstext);
                            }
                        }
                        
                    });
                }                
            });

        /*var formanscomplete = [];
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
            });*/
    }



    function fillformAnswers(form, ans){
        console.log(ans);

        var d = new Date();
        var saludo;

        var curr_date = d.getDate();
        var curr_month = d.getMonth() + 1; //Months are zero based
        var curr_year = d.getFullYear();
        var dia= curr_date + "-" + curr_month + "-" + curr_year;
        var quest = "";

        if (d.getHours()>=12){
            saludo = "Good Afternoon"
        }else {
            saludo = "Good Morning"
        }

        for (var i = 0; i <= form[0].questions.length - 1; i++) {
            quest = quest + "<div class=' part" + i + "'><p>  [ " + form[0].allquestions[i].status + " ] " + form[0].allquestions[i].text + "</p>";
            if (form[0].questions[i].answerid=="278ac4e0-96f1-11e7-a1a3-7fbc3871829a")
            {
                quest = quest + "<textarea disabled>" + form[0].questions[i].answer + "</textarea>";
                quest = quest + "<hr></div>";
            }else{
                quest = quest + "<button style='margin: 2px;' type='button' class='btn btn-primary btn-sm' >" + ans[i] + "</button>";
                quest = quest + "<hr></div>";
            }
        }
        server.views({
            engines: {
              html: require('handlebars')
            },
            path:'././Pagina/Answers',
            layout:  'answersforms',
            context: {
                    Good: saludo,
                    datenow: moment().format("MMM Do YY"),
                    headerAns: form[0].header + "<hr>",
                    questionsAnsdone: quest,
                    footer: form[0].footer
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
                        as: "allquestions"
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
