const Boom  = require('boom');
const uuid  = require('node-uuid');
const Joi   = require('joi');
var moment = require('moment');


exports.register = function(server, options, next) {

    const db = server.app.db;
    //54f79290-9684-11e7-bc74-23c934c137bf testing
    //53375f30-9738-11e7-88d9-1113c020cefd  real
    var idform = "53375f30-9738-11e7-88d9-1113c020cefd";
    //Modifical id para nuevo form
    var version = 13;
    
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
//---imageicon send
    server.route({  
      method: 'GET',
      path: '/img/send.png',
      handler: function (request, reply) {
        // reply.file() expects the file path as parameter
        reply.file('././Pagina/img/send.png')
      }
    })
//----pdf 
    server.route({  
      method: 'GET',
      path: '/files/file.pdf',
      handler: function (request, reply) {
        // reply.file() expects the file path as parameter
        reply.file('././Pagina/Files/file.pdf')
      }
    })


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
                    //dateanswer:     Joi.optional(), se elimina
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
            for (var j = 0; j <= allform[0].questions.length - 1; j++){
                if (allform[i].questions[i].idquestion == allform[j].all._id) {
                    //console.log(allform[j].all._i);
                    if (allform[j].all.status.toUpperCase() === "FEEDBACK"){
                        quest = quest + "<div class='div" + i + "'><p> <font style='color:red'> <strong>[ " + allform[j].all.status + " ]</strong> </font>" + allform[j].all.text + "</p>";    
                    }else{
                        quest = quest + "<div class='div" + i + "'><p> <strong>[ " + allform[j].all.status + " ]</strong> " + allform[j].all.text + "</p>";
                    }
                    for (var z = 0; z <= allform[j].all.answers.length - 1; z++) {
                        for (var y = 0; y <= allform[j].all.answers.length - 1; y++) {
                            if (allform[j].all.answers[z].id_answer == allform[j].allanswers[y]._id) {
                                //console.log('Extoy dentro');
                                if (allform[j].allanswers[y]._id == "278ac4e0-96f1-11e7-a1a3-7fbc3871829a")
                                {
                                    //quest = quest + "<button id='"+ i +"-" + allform[i].allanswers[z]._id + "' style='margin: 2px' type='button' class='btn btn-default btn-sm part" + i + "'        data-toggle='modal' data-target='#exampleModal' data-whatever='@mdo'      value= '" + i + " " + allform[i].allanswers[z]._id + "'>" + allform[i].allanswers[z].text + "</button>";   
                                    quest = quest + "<button id='towrite" + i + "' style='margin: 2px; border-color:#004c91;' type='button' class='btn btn-default btn-sm part" + i + "' data-toggle='modal' data-target='#exampleModal" + i + "' data-whatever='@mdo' value= '" + i + " " + allform[j].allanswers[y]._id + "'>click to write</button>";   
                                    quest = quest + "<div class='modal fade' id='exampleModal" + i + "' tabindex='-1' role='dialog' aria-labelledby='exampleModalLabel'><div class='modal-dialog' role='document'> <div class='modal-content'> <div class='modal-header'> <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button> <h4 class='modal-title' id='exampleModalLabel'>Opinion</h4></div><div class='modal-body'><form><div class='form-group'><label for='message-text' class='control-label'>Message:</label><textarea class='form-control' id='message-text" + i + "'></textarea></div></form></div><div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>     <button id='"+ i +"-" + allform[j].allanswers[y]._id + "' type='button' onclick='sendinfo(value)' class='btn btn-primary part" + i + "' value= '" + i + " " + allform[j].allanswers[y]._id + "' >Send message</button>    </div></div></div></div>";
                                    //quest = quest + "<textarea style='margin: 2px 2px -15px 0px'></textarea>";
                                }else {
                                    quest = quest + "<button id='"+ i +"-" + allform[j].allanswers[y]._id + "' style='margin: 2px; border-color:#004c91;' type='button' class='btn btn-default btn-sm part" + i + "' value= '" + i + " " + allform[j].allanswers[y]._id + "' onclick='sendinfo(value)'>" + allform[j].allanswers[y].text + "</button>";   
                                }
                            }
                        }
                    }
                    quest = quest + "<hr></div>";
                }
            }
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
                    datenow: moment().format('MMMM Do YYYY'), 
                    //header: allform[0].header + "<hr>",
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
