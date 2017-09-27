var info = "";

function SaveAns () {

	var value = document.getElementById("text-ans").value;
	if (value == "") {
		alert("Text box is empty");
	}else {
		var valuejson = value.replace(" ", "");
		var ansjson = new Object();
		ansjson.text = document.getElementById("text-ans").value;
		ansjson.value = "valuejson";
		var tosenans= JSON.stringify(ansjson);

		$.ajax({
	              headers : {
	                  'Accept' : 'application/json',
	                  'Content-Type' : 'application/json'
	              },
	              url : 'http://localhost:3000/answers',
	              //url : 'https://wmmailform.herokuapp.com/forms/' + idform,
	              type : 'POST',
	              data : tosenans,
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
		document.getElementById("text-ans").value = "";
		alert("Answer create");	
	}
}		

function getAllAns () {
	var allAns = httpGet("http://localhost:3000/answers");
	var objAllAns = JSON.parse(allAns);
	var tableIn = document.getElementById("tbody");
	tableIn.innerHTML = "";

	for (var i = 0; i<objAllAns.length; i++)
	{
		tableIn.innerHTML += "<tr onclick='CellSelect(this);' value='" + objAllAns[i]._id + "'><td>" + (i + 1) + "</td><td>" + objAllAns[i].text + "</td><td>" + objAllAns[i].value + "</td></tr>";
	}
	var todo = document.getElementById("whatToDo");
	todo.innerHTML = "";
}

function CellSelect (obj) {
	obj.style.background = (obj.style.background=='') ? 'red' : '';
	info = "";
	info = obj.getAttribute('value');
	


	//fill the delet or update
	var Dell_Update=document.getElementById("whatToDo");
	Dell_Update.innerHTML = "<select onchange='chagedrop(value);' class='form-control'><option>Escoge una opción</option><option>Update</option><option>Delete</option></select>";
}

function chagedrop (opc) {
	var Dell_Update_c=document.getElementById("whatToDo");
	Dell_Update_c.innerHTML = "";
	if (opc.toUpperCase()=="DELETE"){
		Dell_Update_c.innerHTML += "<hr><button type='button' onclick='deleteAns()' class='btn btn-primary btn-lg btn-block'>are you sure to delete it?</button>"
	}else if (opc.toUpperCase()=="UPDATE"){
		Dell_Update_c.innerHTML += "<div class='form-group'><label for='updateAns'>Update Answer</label><input type='text' class='form-control' id='updateans' placeholder='Send me notes'></div>"
		Dell_Update_c.innerHTML += "<hr><button type='button' onclick='Updateans()' class='btn btn-primary btn-lg btn-block'>Update</button>"
	}
}

function deleteAns () {
	var urlDelte = "http://localhost:3000/answers/" + info;
	httpDelete(urlDelte);
	getAllAns ();

}

function Updateans () {
	var urlUpdate = "http://localhost:3000/answers/" + info;
	var value = document.getElementById("updateans").value;
	var valuejson = value.replace(" ", "");
	var ansjson = new Object();
	ansjson.text = document.getElementById("updateans").value;
	ansjson.value = "valuejson";
	var tosenans= JSON.stringify(ansjson);
	httpPatch(urlUpdate, tosenans);
	getAllAns ();
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function httpPatch(theUrl, tosend)
{
    $.ajax({
              headers : {
                  'Accept' : 'application/json',
                  'Content-Type' : 'application/json'
              },
              url : theUrl,
              //url : 'https://wmmailform.herokuapp.com/forms/' + idform,
              type : 'PATCH',
              data : tosend,
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
}

function clearall (argument) {
	var tableelement = document.getElementById("tbody");
	var divelement = document.getElementById("whatToDo");
	tableelement.innerHTML = "";
	divelement.innerHTML = "";
}

function httpDelete(theUrlD)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "DELETE", theUrlD, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}