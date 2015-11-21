Parse.initialize("0tVwiPK2ojovt24VcBqJ1jKE60QoxufdEB1Xcna0", "eWlSk7NQgYBXyz9G8kUFTCUoZqemXPMyrZrcTKOX");
var Subtask = Parse.Object.extend("Subtask");

var Task = Parse.Object.extend("Task");
var List = Parse.Object.extend("List");

$("#subtaskForm").submit(function(){
	retrieveTasks();
}); 
 
function retrieveTasks(){
  var query = new Parse.Query(Task);
  query.find({
	success:function(results){
	  var output="";
	  for(var i in results){
		var name=results[i].get("name");
		var important=results[i].get("important");
		var done=results[i].get("done");
		output+="<div class='calendar-date'><span>1</span><span>Fri</span></div>";
		output+="<div class='calendar-activity teal mdl-shadow--1dp'><span>"+name+"</span><span id='retrievedTaskTime' class='calendar-hour'></span></div><div class='clr'></div>";
		
	alert("ommek");
	}
		$("#retrievedTasksDiv").html(output);
		
	}, error:function(error){
		console.log("Query error : " + error.message);
	}
  });
}
