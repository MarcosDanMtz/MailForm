var answers = new Array();
function showAns (argument) {
	if (document.getElementById("text-question").value == "" || document.getElementById("text-status").value == ""){
		alert("Please write a question");
	}else {
		var allAns = httpGet("http://localhost:3000/answers");
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
			url : 'http://localhost:3000/questions',
			//url : 'https://wmmailform.herokuapp.com/forms/' + idform,
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
	location.href ="http://localhost:3000/admin-questions";
}


function loadQuestions () {
	var response = httpGet("http://localhost:3000/questions")
	var objAllQuest = JSON.parse(response);
	var tableIn = document.getElementById("tbody");
	tableIn.innerHTML = "";
	for (var i = 0; i<objAllQuest.length; i++)
	{
		tableIn.innerHTML += "<tr onclick='CellSelect(this);' value='" + objAllQuest[i]._id + "'><td>" + objAllQuest[i]._id + "</td><td>" + objAllQuest[i].text + "</td></tr>";
	}
	var todo = document.getElementById("whatToDo");
}





function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}	