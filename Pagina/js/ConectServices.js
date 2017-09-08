

const Joi   = require('joi');
var request = require('request');
var arraydoc = "";

exports.register = function (server, options, next) {
  const db = server.app.db;
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
        $match : { _id: idform }
    }
]).toArray(function (err, docs)
{
    if (err)
    {
        return reply(Boom.wrap(err, 'Internal MongoDB error'));
    }
    console.log(docs);
});*/

  return next();

}





function sendinfo (valueans) {
    var idform = "e142d5e0-932b-11e7-98c8-134629b3a0ca";
    var questionNum = valueans.split(" ", 1);
    var inicio = questionNum.length + 1;
    var fin = valueans.length;
    var idquestion = valueans.substring(inicio, fin);
    //console.log(idquestion);
    $.ajax({
    url: "http://localhost:3000/formsid/" + idform
    }).then(function(updateform) {
      update(updateform);
      
      /*var questionNum = valueans.split(" ", 1);
      var inicio = questionNum.length + 1;
      var fin = valueans.length;
      var idans = valueans.substring(inicio, fin);
      var updateform = [];
      console.log('question number');
      console.log(questionNum); 
      console.log('id answer');
      console.log(idans);
      console.log(updateform);
      update (updateform);*/
      
    });

    function update (form) {
      var infosendstringarr;
      console.log(form);
      form[0].questions[questionNum].answerid = idquestion;
      delete form[0]._id;
      infosendstringarr = JSON.stringify(form);
      infosendstringarr = infosendstringarr.substring(1, infosendstringarr.length-1);
      //console.log(infosendstringarr);


      $.ajax({
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            url : 'http://localhost:3000/forms/' + idform,
            type : 'PATCH',
            data : infosendstringarr,
            success : function(response, textStatus, jqXhr) {
                console.log("Venue Successfully Patched!");
            },
            error : function(jqXHR, textStatus, errorThrown) {
                // log the error to the console
                console.log("The following error occured: " + textStatus, errorThrown);
            },
            complete : function() {
                console.log("Venue Patch Ran");
            }
        });
    }
    $(".part" + questionNum).css("background", "#85C1E9");
    console.log('tremendo AAAAA');
    
}


exports.register.attributes = {
    name: 'routes-clientrequest'
};