var URLactual = window.location;
var urlid =  URLactual.href.toString();
var aux = 0;
var realquesnumber=0, quesnumber=0;
var dateStr = new Date();

for (var i =0; i < urlid.length; i++) {
 if (urlid[i] == '?'){
  aux = i + 4;
  }
}
var idFormR = urlid.substring(aux, urlid.length);
var multipleUsersSend = {idform: idFormR, createdate: dateStr.toISOString(), answers: []};

function sendinfo (valueans) {
    //var idform = "53375f30-9738-11e7-88d9-1113c020cefd";
    var idform = idFormR;
    var questionNum = valueans.split(" ", 1);
    var inicio = questionNum.length + 1;
    var fin = valueans.length;
    var idquestion = valueans.substring(inicio, fin);

    //$("#"+ questionNum +"-"+ idquestion).attr("class","btn btn-primary btn-sm part" + questionNum);
    //$("#"+ questionNum +"-"+ idquestion).attr("style","color: #ffffff; background-color: #004c91");
    $(".part" + questionNum).attr("class","btn btn-default btn-sm part" + questionNum);
    $(".part" + questionNum).attr("style","margin: 2px; border-color:#004c91;");
    //console.log(idquestion);
    $.ajax({
    url: "https://wmmailform.herokuapp.com/formsid/" + idform
    // url: "http://localhost:3000/formsid/" + idform
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
      var ansall;
      //console.log(form);
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
        var auxNumber = lookforQuestAns(form[0].questions[questionNum].idquestion, multipleUsersSend);
        if (auxNumber>=0){
          multipleUsersSend.answers[auxNumber].idanswer = idquestion
          quesnumber-=1;
        }else{
          multipleUsersSend.answers.push({idquestion: form[0].questions[questionNum].idquestion, idanswer: idquestion});
          quesnumber+=1;
        }
        console.log("hola----");
        console.log(multipleUsersSend.answers);
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

      console.log(infosendstringarr);
      try {
        $.ajax({
              headers : {
                  'Accept' : 'application/json',
                  'Content-Type' : 'application/json'
              },
              // url : 'http://localhost:3000/forms/' + idform,
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
  // $("#body").append('<div class="animated lightSpeedOut"><img style="text-align: center;" width="120px" height="120px" src="http://localhost:3000/img/send.png" alt="send-ms" height="42" width="42"></div>');
  $("#body").append('<div class="animated lightSpeedOut"><img style="text-align: center;" width="120px" height="120px" src="https://wmmailform.herokuapp.com/img/send.png" alt="send-ms" height="42" width="42"></div>');
  $("#body").append('<h4 style="text-align: center;">Information sent, Thanks!</h4>');
  console.log("hoal");
}


window.onload = function () {
  // var getform = httpGet("http://localhost:3000/forms/" + idFormR);
  var getform = httpGet("https://wmmailform.herokuapp.com/forms/" + idFormR);
  var allform = JSON.parse(getform);
  console.log(allform);
  var topush = document.getElementById("fillQuestionAns");
  realquesnumber = allform[0].questions.length;
  for (var i = 0; i <= allform[0].questions.length - 1; i++) {
            for (var j = 0; j <= allform[0].questions.length - 1; j++){
                if (allform[i].questions[i].idquestion == allform[j].all._id) {
                    //console.log(allform[j].all._i);
                    if (allform[j].all.status.toUpperCase() === "FEEDBACK"){
                    topush.innerHTML += "<div class='div" + i + "'><p> <font style='color:red'> <strong>[ " + allform[j].all.status + " ]</strong> </font>" + allform[j].all.text + "</p>";
                    }else{
                    topush.innerHTML += "<div class='div" + i + "'><p> <strong>[ " + allform[j].all.status + " ]</strong> " + allform[j].all.text + "</p>";
                    }
                    for (var z = 0; z <= allform[j].all.answers.length - 1; z++) {
                        for (var y = 0; y <= allform[j].all.answers.length - 1; y++) {
                            if (allform[j].all.answers[z].id_answer == allform[j].allanswers[y]._id) {
                                //console.log('Extoy dentro');
                                if (allform[j].allanswers[y]._id == "278ac4e0-96f1-11e7-a1a3-7fbc3871829a")
                                {
                                  topush.innerHTML += "<button id='"+ i +"-" + allform[i].allanswers[z]._id + "' style='margin: 2px' type='button' class='btn btn-default btn-sm part" + i + "'        data-toggle='modal' data-target='#exampleModal' data-whatever='@mdo'      value= '" + i + " " + allform[i].allanswers[z]._id + "'>" + allform[i].allanswers[z].text + "</button>";
                                topush.innerHTML += "<button id='towrite" + i + "' style='margin: 2px; border-color:#004c91;' type='button' class='btn btn-default btn-sm part" + i + "' data-toggle='modal' data-target='#exampleModal" + i + "' data-whatever='@mdo' value= '" + i + " " + allform[j].allanswers[y]._id + "'>click to write</button>";
                                topush.innerHTML += "<div class='modal fade' id='exampleModal" + i + "' tabindex='-1' role='dialog' aria-labelledby='exampleModalLabel'><div class='modal-dialog' role='document'> <div class='modal-content'> <div class='modal-header'> <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button> <h4 class='modal-title' id='exampleModalLabel'>Opinion</h4></div><div class='modal-body'><form><div class='form-group'><label for='message-text' class='control-label'>Message:</label><textarea class='form-control' id='message-text" + i + "'></textarea></div></form></div><div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>     <button id='"+ i +"-" + allform[j].allanswers[y]._id + "' type='button' onclick='sendinfo(value)' class='btn btn-primary part" + i + "' value= '" + i + " " + allform[j].allanswers[y]._id + "' >Send message</button>    </div></div></div></div>";
                                  topush.innerHTML += "<textarea style='margin: 2px 2px -15px 0px'></textarea>";
                                }else {
                                topush.innerHTML += "<button id='"+ i +"-" + allform[j].allanswers[y]._id + "' style='margin: 2px; border-color:#004c91;' type='button' class='btn btn-default btn-sm part" + i + "' value= '" + i + " " + allform[j].allanswers[y]._id + "' onclick='sendinfo(value)'>" + allform[j].allanswers[y].text + "</button>";
                                }
                            }
                        }
                    }
                topush.innerHTML += "<hr></div>";
                }
            }
        }

   topush.innerHTML += "<hr><div id='footer'>" +  allform[0].footer + "</div>";
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function forVariousUsers(){
    if (realquesnumber === quesnumber){
      var tosenmultipleUs = JSON.stringify(multipleUsersSend);
      console.log(tosenmultipleUs);
      close ();
      try {
        $.ajax({
              headers : {
                  'Accept' : 'application/json',
                  'Content-Type' : 'application/json'
              },
              // url : 'http://localhost:3000/forms-answers',
              url : 'https://wmmailform.herokuapp.com/forms-answers',
              type : 'POST',
              data : tosenmultipleUs,
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
    }else {
      alert('Please Answer All questions');
    }

}

function lookforQuestAns(idQuestion, Arreglo){//Busca el id en el arreglo para cambiar la respuesta
  var repeat=-1;
  for (var i = 0; i<Arreglo.answers.length; i++){
    if (Arreglo.answers[i].idquestion === idQuestion){
      repeat=i;
    }
  }
  if (repeat>=0)
    return repeat;
}
