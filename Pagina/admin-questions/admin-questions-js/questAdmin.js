var answers = new Array();
function showAns (argument) {
	if (document.getElementById("text-question").value == "" || document.getElementById("text-status").value == ""){
		alert("Please write a question");
	}else {
		answers = new Array();
		console.log(answers);
		//var allAns = httpGet("http://localhost:3000/answers");
		var allAns = httpGet("https://wmmailform.herokuapp.com/answers");
		var objAllAns = JSON.parse(allAns);
		var tableIn = document.getElementById("fillAnsAsOpc");
		tableIn.innerHTML = "";

		tableIn.innerHTML += "<h4>Select at least 2 options, maximum 4:</h4>";
		for (var i = 0; i<objAllAns.length; i++)
		{
			tableIn.innerHTML += "<div class='checkbox'><label><input onclick='saveAnsforQuest(this);' type='checkbox' id='" + objAllAns[i]._id + "' value='" + i + "'>" + objAllAns[i].text + "</label></div>";
		}
		tableIn.innerHTML += "<button type='button' class='btn btn-primary btn-lg btn-block' onclick='saveQuestion();'>Save Question</button>";
		var todo = document.getElementById("whatToDo");
	}
}

/*function SaveQuestion () {
	var value = document.getElementById("text-ans").value;
	if (value == "") {
		alert("Text box is empty");
	}else {
		var valuejson = value.replace(" ", "");
		var ansjson = new Object();
		ansjson.text = document.getElementById("text-ans").value;
		ansjson.value = "valuejson";
		var tosenans= JSON.stringify(ansjson);
	}
}*/	

function saveAnsforQuest (obj) {

	if (obj.checked){	
		if (answers.length <= 3){
			var answersAux = new Object();
			answersAux.id_answer = obj.id;
			answers.push(answersAux);
			var nauxRepeat=0;
			console.log(answersAux);
			console.log(answers);
			
		}else {
			alert("limit exceeded");
			answers.splice(answers.length,1);
			document.getElementById(obj.id).checked = false;
		}
	}else {
		for (var i=0; i<answers.length; i++){
			if(answers[i].id_answer==obj.id){
				answers.splice(i,1);
			}
		}
	}
	//console.log(answers);
}


function saveAnsforQuestUpdate (obj) {

	if (obj.checked){	
		if (answers.length <= 3){
			var answersAux = new Object();
			answersAux.id_answer = obj.id;
			answers.push(answersAux);
			var nauxRepeat=0;
			
		}else {
			alert("limit exceeded");
			answers.splice(answers.length,1);
			document.getElementById(obj.id).checked = false;
		}
	}else {
		for (var i=0; i<answers.length; i++){
			if(answers[i].id_answer==obj.id){
				answers.splice(i,1);
			}
		}
	}
	//console.log(answers);
}

function saveQuestion () {
	var dateStr = new Date();
	var question = new Object();
	question.status = document.getElementById("text-status").value.toUpperCase();
	question.text = document.getElementById("text-question").value;
	question.createdate = dateStr.toISOString();
	question.answers = answers;
	var questionTosend = JSON.stringify(question);
	console.log(questionTosend);


	try {
		$.ajax({
			headers : {
			  'Accept' : 'application/json',
			  'Content-Type' : 'application/json'
			},
			//url : 'http://localhost:3000/questions',
			url : 'https://wmmailform.herokuapp.com/formasn/questions',
			type : 'POST',
			data : questionTosend,
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
	//location.href ="http://localhost:3000/admin-questions";
	location.href ="https://wmmailform.herokuapp.com/admin-questions";
}

function saveQuestionUpdate () {
	var dateStr = new Date();
	var question = new Object();
	var objIdQuest = document.getElementById("idToUpdate");
	question.status = document.getElementById("text-statusUpdate").value.toUpperCase();
	question.text = document.getElementById("text-questionUpdate").value;
	question.createdate = dateStr.toISOString();
	question.answers = answers;
	var questionTosend = JSON.stringify(question);
	//console.log(idQuest);
	console.log(questionTosend);


	try {
		$.ajax({
			headers : {
			  'Accept' : 'application/json',
			  'Content-Type' : 'application/json'
			},
			//url : 'http://localhost:3000/questions/' + objIdQuest.getAttribute("value"),
			url : 'https://wmmailform.herokuapp.com/questions/' + objIdQuest.getAttribute("value"),
			type : 'PATCH',
			data : questionTosend,
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
	// location.href ="http://localhost:3000/admin-questions";
	location.href ="https://wmmailform.herokuapp.com/admin-questions";
}


function loadQuestions () {
	//var response = httpGet("http://localhost:3000/questions")
	var response = httpGet("https://wmmailform.herokuapp.com/questions");
	var objAllQuest = JSON.parse(response);
	var tableIn = document.getElementById("tbody");
	tableIn.innerHTML = "";
	for (var i = 0; i<objAllQuest.length; i++)
	{
		tableIn.innerHTML += "<tr onclick='CellSelect(this);' value='" + objAllQuest[i]._id + "'><td>" + objAllQuest[i]._id + "</td><td>" + objAllQuest[i].text + "</td></tr>";
	}
	var todo = document.getElementById("whatToDo");
}


function searchAns () {
	//var response = httpGet("http://localhost:3000/questions");
	var response = httpGet("https://wmmailform.herokuapp.com/questions")
	var objAllQuest = JSON.parse(response);
	var texto = document.getElementById("questionToFind").value.toString().toLowerCase();

	var resul = objAllQuest.filter(function(index) {
		if (index.text.toLowerCase().indexOf(texto) != -1)
		return index;
	});
	
	var tableIn = document.getElementById("tbody");
	tableIn.innerHTML = "";
	for (var i = 0; i<resul.length; i++)
	{
		tableIn.innerHTML += "<tr onclick='CellSelect(this);' value='" + resul[i]._id + "'><td>" + resul[i]._id + "</td><td>" + resul[i].text + "</td></tr>";
	}
	
}

function CellSelect (obj) {
	//var response = httpGet("http://localhost:3000/questions/" + obj.getAttribute('value'));
	var response = httpGet("https://wmmailform.herokuapp.com/questions/" + obj.getAttribute('value'));
	var objAllQuest = JSON.parse(response);
	var tableIn = document.getElementById("tbody");
	tableIn.innerHTML = "";
	tableIn.innerHTML += "<tr onclick='CellSelect(this);' value='" + objAllQuest[0]._id + "'><td>" + objAllQuest[0]._id + "</td><td>" + objAllQuest[0].text + "</td></tr>";

	var plaseUpdateQuestion = document.getElementById("updateQuestion");
	plaseUpdateQuestion.innerHTML = "";
	plaseUpdateQuestion.innerHTML += "<label for='exampleInputEmail1'>ID of Question: </label> <label for='exampleInputEmail1' id='idToUpdate' value=" +  objAllQuest[0]._id + ">" + objAllQuest[0]._id  + "</label>";
	plaseUpdateQuestion.innerHTML += "<div class='form-group'> <label for='exampleInputEmail1'>Write the status</label> <input type='text' class='form-control' id='text-statusUpdate' placeholder='" + objAllQuest[0].status + "'> </div> <div class='form-group'> <label for='exampleInputEmail1'>New Question</label> <textarea type='email' class='form-control' id='text-questionUpdate' placeholder='" + objAllQuest[0].text + "'></textarea> </div>";
	plaseUpdateQuestion.innerHTML += "<button type='button' class='btn btn-info' onclick='showAnsUpdate();' >Show Answers</button>"

}

function showAnsUpdate () {
	if (document.getElementById("text-questionUpdate").value == "" || document.getElementById("text-statusUpdate").value == ""){
		alert("Please write a question");
	}else {
		answers = new Array();
		//var allAns = httpGet("http://localhost:3000/answers");
		var allAns = httpGet("https://wmmailform.herokuapp.com/answers");
		var objAllAns = JSON.parse(allAns);
		var tableIn = document.getElementById("answersPlaceUpdate");
		tableIn.innerHTML = "";

		tableIn.innerHTML += "<h4>Select at least 2 options, maximum 4:</h4>";
		for (var i = 0; i<objAllAns.length; i++)
		{
			tableIn.innerHTML += "<div class='checkbox'><label><input onclick='saveAnsforQuestUpdate(this);' type='checkbox' id='" + objAllAns[i]._id + "' value='" + i + "'>" + objAllAns[i].text + "</label></div>";
		}
		tableIn.innerHTML += "<button type='button' class='btn btn-primary btn-lg btn-block' onclick='saveQuestionUpdate();'>Update Question</button>";
		var todo = document.getElementById("whatToDo");
	}
}


function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}	