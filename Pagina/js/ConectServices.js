

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
    var idform = "53375f30-9738-11e7-88d9-1113c020cefd";
    var questionNum = valueans.split(" ", 1);
    var inicio = questionNum.length + 1;
    var fin = valueans.length;
    var idquestion = valueans.substring(inicio, fin);

    //$("#"+ questionNum +"-"+ idquestion).attr("class","btn btn-primary btn-sm part" + questionNum);
    //$("#"+ questionNum +"-"+ idquestion).attr("style","color: #ffffff; background-color: #004c91");

    //console.log(idquestion);
    $.ajax({
    url: "https://wmmailform.herokuapp.com/formsid/" + idform
    //url: "http://localhost:3000/formsid/" + idform
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

      var dateStr = new Date();
      $(".part" + questionNum).attr("class","btn btn-default btn-sm part" + questionNum);
      $(".part" + questionNum).attr("style","margin: 2px; border-color:#004c91;");
      if(idquestion == '278ac4e0-96f1-11e7-a1a3-7fbc3871829a'){

        if ($("#message-text" + questionNum).val() === "") {
          alert("Please fill the textarea for question " + questionNum+1);
        }else {
          form[0].questions[questionNum].answerid = idquestion;
          form[0].questions[questionNum].answer = $("#message-text" + questionNum).val();
          
          $("#towrite" + questionNum).attr("class","btn btn-primary btn-sm part" + questionNum);
          $("#towrite" + questionNum).attr("style","color: #ffffff; background-color: #004c91");
        }        
      }else {
        form[0].questions[questionNum].answer = "";
        form[0].questions[questionNum].answerid = idquestion;
        //$("#"+ questionNum +"-"+ idquestion).attr("class","btn btn-primary");
        //$(".part" + questionNum).attr("class","btn btn-default btn-sm part" + questionNum);
        //$(".part" + questionNum).attr("style","margin: 2px; border-color:#004c91;");
        $("#"+ questionNum +"-"+ idquestion).attr("class","btn btn-primary btn-sm part" + questionNum);
        $("#"+ questionNum +"-"+ idquestion).attr("style","color: #ffffff; background-color: #004c91");
      }
      form[0].questions[questionNum].dateanswered = dateStr.toISOString();
      delete form[0]._id;
      infosendstringarr = JSON.stringify(form);
      infosendstringarr = infosendstringarr.substring(1, infosendstringarr.length-1);


      
      //console.log(infosendstringarr);
      try {
        $.ajax({
              headers : {
                  'Accept' : 'application/json',
                  'Content-Type' : 'application/json'
              },
              //url : 'http://localhost:3000/forms/' + idform,
              url : 'https://wmmailform.herokuapp.com/forms/' + idform,
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
        //alert("Answer send correctly");
      }
      catch (err){
        alert("Error please refresh the page");
      }
    }


    //$(".part" + questionNum).attr("class")
    

    //$(".part" + questionNum).css("background", "#85C1E9");    
}

function close () {
  //document.body.style.backgroundColor='#FFFFFF';
  $("#body").empty();
  $("#body").append('<h1 style="text-align: center;">Sent</h1>');
  //$("#body").append('<div class="animated lightSpeedOut"><img style="text-align: center;" width="120px" height="120px" src="http://localhost:3000/img/send.png" alt="send-ms" height="42" width="42"></div>');
  $("#body").append('<div class="animated lightSpeedOut"><img style="text-align: center;" width="120px" height="120px" src="https://wmmailform.herokuapp.com/img/send.png" alt="send-ms" height="42" width="42"></div>');
  $("#body").append('<h4 style="text-align: center;">Information sent, Thanks!</h4>');
  console.log("hoal");
}

exports.register.attributes = {
    name: 'routes-clientrequest'
};