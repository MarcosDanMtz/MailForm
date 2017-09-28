var question = new Array();
function showquest () {
  if (document.getElementById("text-footer").value == "" || document.getElementById("keywords-from").value == ""){
    alert("Please write a footer or keywords");
  }else {
    question = new Array();
    console.log(question);
    //var allAns = httpGet("http://localhost:3000/questions");
    var allAns = httpGet("https://wmmailform.herokuapp.com/questions");
    var objAllAns = JSON.parse(allAns);
    var tableIn = document.getElementById("fillQuestAsOpc");
    tableIn.innerHTML = "";

    for (var i = 0; i<objAllAns.length; i++)
    {
      tableIn.innerHTML += "<div class='checkbox'><label><p><input onclick='saveQuestforForm(this);' type='checkbox' id='" + objAllAns[i]._id + "' value='" + i + "'>" + objAllAns[i].text + "</p></label></div>";
    }
    tableIn.innerHTML += "<button type='button' class='btn btn-primary btn-lg btn-block' onclick='saveForm();'>Save Form</button>";
    //var todo = document.getElementById("whatToDo");
  }
}

function saveQuestforForm (obj) {

  if (obj.checked){

      var availableToWrite = "false";
      var checkQuestion = httpGet("https://wmmailform.herokuapp.com/questions/" + obj.id);
      //var checkQuestion = httpGet("http://localhost:3000/questions/" + obj.id);
      var questionToValue = JSON.parse(checkQuestion);

      for (var i = 0; i < questionToValue[0].answers.length; i++) {
        if ("278ac4e0-96f1-11e7-a1a3-7fbc3871829a" == questionToValue[0].answers[i].id_answer)
          availableToWrite = "true"
      }
      var formAux = new Object();
      formAux.idquestion = obj.id;
      formAux.answerid = "";
      formAux.availabletowrite = availableToWrite;
      formAux.answer = "";
      formAux.dateanswered = "";
      question.push(formAux);
      var nauxRepeat=0;
  }else {
    for (var i=0; i<question.length; i++){
      if(question[i].idquestion==obj.id){
        question.splice(i,1);
      }
    }
  }
  console.log(question);
}


function saveForm () {
  var form = new Object();
  form.header = document.getElementById("keywords-from").value;
  form.footer = document.getElementById("text-footer").value;
  form.questions = question;
  var formTosend = JSON.stringify(form);
  console.log(formTosend);

  try {
    $.ajax({
      headers : {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
      },
      //url : 'http://localhost:3000/forms',
      url : 'https://wmmailform.herokuapp.com/forms',
      type : 'POST',
      data : formTosend,
      success : function(response, textStatus, jqXhr) {
        console.log("Successfully Patched!");
      },
      error : function(jqXHR, textStatus, errorThrown) {
        // log the error to the console
        console.log("The following error occured: " + textStatus, errorThrown);
      },
      complete : function() {
        console.log("Venue Patch Ran");
      }
    });
    alert("Done!!");
  }
  catch (err){
    alert("error please try again!!");
  }
  //location.href ="http://localhost:3000/admin-forms";
  location.href ="https://wmmailform.herokuapp.com/admin-forms";
}




function searchForm () {
  //var response = httpGet("http://localhost:3000/forms")
  var response = httpGet("https://wmmailform.herokuapp.com/forms")
  var objAllQuest = JSON.parse(response);

  var texto = document.getElementById("formToFind").value.toString().toLowerCase();

  var resul = objAllQuest.filter(function(index) {
    if (index.header.toLowerCase().indexOf(texto) != -1)
    return index;
  });

  console.log(resul);
  
  var tableIn = document.getElementById("tbody");
  tableIn.innerHTML = "";
  for (var i = 0; i<resul.length; i++)
  {

    tableIn.innerHTML += "<tr onclick='CellSelect(this);' value='" + resul[i]._id + "'><td>" + (i+1) + "</td><td>" + resul[i].header + "</td><td>" + resul[i].footer + "</td></tr>";
  }
  
}

function CellSelect (obj) {

  //var response = httpGet("http://localhost:3000/answersforms/" + obj.getAttribute('value'));
  var response = httpGet("https://wmmailform.herokuapp.com/answersforms/" + obj.getAttribute('value'));
  var objForm = JSON.parse(response);
  var tableIn = document.getElementById("tbody");
  tableIn.innerHTML = "";
  tableIn.innerHTML += "<tr onclick='CellSelect(this);' value='" + objForm[0]._id + "'><td>" + 1 + "</td><td>" + objForm[0].header + "</td><td>" + objForm[0].footer + "</td></tr>";

  var infoToFill = document.getElementById("infoFormToUpdate");
  infoToFill.innerHTML = "";
  infoToFill.innerHTML += "<h3>The ID of the form to update:</h3><label for='exampleInputEmail1' id='idToUpdate' value=" +  objForm[0]._id + ">" + objForm[0]._id  + "</label>";
  infoToFill.innerHTML += "<h4>Questions selected for this form:</h4>";

  for (var i = 0; i < objForm[0].allquestions.length; i++) {
    infoToFill.innerHTML += "<p>" + (i+1) + "-" + objForm[0].allquestions[i].text + "</p>"  
  }
  
  infoToFill.innerHTML += "<hr>"; 

  var fillQuestions = document.getElementById("questionsPlaceUpdate");
  fillQuestions.innerHTML = "";
  fillQuestions.innerHTML += "<div class='form-group'> <label for='exampleInputEmail1'>Keywords</label> <input type='text' class='form-control' id='text-keywordsUpdate' placeholder='" + objForm[0].header + "'> </div> <div class='form-group'> <label for='exampleInputEmail1'>Footer: </label> <textarea type='text' class='form-control' id='text-footerUpdate' placeholder='" + objForm[0].footer + "'></textarea> </div>"; 

  
  question = new Array();
  console.log(question);
  //var allAns = httpGet("http://localhost:3000/questions");
  var allAns = httpGet("https://wmmailform.herokuapp.com/questions");
  var objAllAns = JSON.parse(allAns);
  var tableIn = document.getElementById("questionsPlaceUpdate");
  //tableIn.innerHTML = "";
  tableIn.innerHTML += "<h3>Select new questions for the form:</h3>"
  for (var i = 0; i<objAllAns.length; i++)
  {
    tableIn.innerHTML += "<div class='checkbox'><label><p><input onclick='saveQuestforForm(this);' type='checkbox' id='" + objAllAns[i]._id + "' value='" + i + "'>" + objAllAns[i].text + "</p></label></div>";
  }
  tableIn.innerHTML += "<button type='button' class='btn btn-primary btn-lg btn-block' onclick='updateForm();'>Save Form</button>";
  //var todo = document.getElementById("whatToDo");
}

function updateForm () {
  var id = document.getElementById("idToUpdate");
  var form = new Object();
  form.header = document.getElementById("text-keywordsUpdate").value;
  form.footer = document.getElementById("text-footerUpdate").value;
  form.questions = question;
  var formTosend = JSON.stringify(form);
  console.log(id.getAttribute("value"));

  try {
    $.ajax({
      headers : {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
      },
      //url : 'http://localhost:3000/forms/' + id.getAttribute("value"),
      url : 'https://wmmailform.herokuapp.com/forms/' + id.getAttribute("value"),
      type : 'PATCH',
      data : formTosend,
      success : function(response, textStatus, jqXhr) {
        console.log("Successfully Patched!");
      },
      error : function(jqXHR, textStatus, errorThrown) {
        // log the error to the console
        console.log("The following error occured: " + textStatus, errorThrown);
      },
      complete : function() {
        console.log("Venue Patch Ran");
      }
    });
    alert("Done!!");
  }
  catch (err){
    alert("error please try again!!");
  }
  //location.href ="http://localhost:3000/admin-forms";
  location.href ="https://wmmailform.herokuapp.com/formasn/admin-forms";
}

function clearUpdate () {
  var tbody = document.getElementById("tbody");
  tbody.innerHTML = "";
  var infoFormToUpdate = document.getElementById("infoFormToUpdate");
  infoFormToUpdate.innerHTML = "";
  var questionsPlaceUpdate = document.getElementById("questionsPlaceUpdate");
  questionsPlaceUpdate.innerHTML = "";
  question = new Array();
}

function clearCreate () {
  var fillQuestAsOpc = document.getElementById("fillQuestAsOpc");
  fillQuestAsOpc.innerHTML = "";
  question = new Array();
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
} 