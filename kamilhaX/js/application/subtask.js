Parse.initialize("0tVwiPK2ojovt24VcBqJ1jKE60QoxufdEB1Xcna0", "eWlSk7NQgYBXyz9G8kUFTCUoZqemXPMyrZrcTKOX");

function prepareHomePage(){
	console.log(Parse.User.current().get("username"));
	$("#currentUserPhoto").attr('src','img/usericon.png');
	$("#currentUserEmail").val=Parse.User.current().get("username");
	$("#retrievedSubtasksDiv").css({'margin-top':'-8%'});
	retrieveSubtasks();
}

$("#backToTasksButton").click(function(){
	var taskIdHashedString = location.hash;
	location.href="home.html"+taskIdHashedString;
});

/*************************************************/
/*PARSE USAGE*/

/*Adding a new subtask*/
var Subtask = Parse.Object.extend("Subtask");
var Task = Parse.Object.extend("Task");
   
$("#addSubtaskForm").submit(function(event){
  event.preventDefault();//Prevents automatic page refresh
    if(Parse.User.current()!=null){
	  var name = $("#subtaskNameTextField").val();
	  var done = false;
	  
	  var newSubtask = new Subtask();
	  var task = new Task();
	  
	  newSubtask.set("name", name);
	  newSubtask.set("done", done);
	  
	  var taskIdHashedString = location.hash;
	  var taskId = taskIdHashedString.substr(1); 
	  task.set("objectId", taskId);
	  newSubtask.set("task", task);
	  
	  newSubtask.save(
	  {
		success:function(){
			$("#subtaskNameTextField").val("");
			retrieveSubtasks();
		}, 
		error:function(error){
		  alert("There was an error during adding the subtask!");
		}
	  });  
	}
});

/*Retrieving tasks*/
function retrieveSubtasks(){
  alert("SUUUUUB");
  var query = new Parse.Query(Subtask);
  var task = new Task();
  var taskIdHashedString = location.hash;
  var taskId = taskIdHashedString.substr(1); 
  
  task.set("objectId", taskId);
  query.equalTo("task", task);
  query.find({
	success:function(results){
	  var output="";
	  for(var i in results){
		var name=results[i].get("name");
		var important=results[i].get("important");
		var done=results[i].get("done");
		var id=results[i].id;
		
		if(done==false){
			output+="<tr><td class='mdl-data-table__cell--non-numeric'><span style='cursor:pointer;' onclick='subtaskStriker(this)' data-id='"+ id +"'>" + name + "</span></td><td>8 AM</td></tr>";
		}
		
		if(done==true){
			output+="<tr><td class='mdl-data-table__cell--non-numeric'><span style='cursor:pointer;text-decoration: line-through;' onclick='subtaskStriker(this)' data-id='"+ id +"'>" + name + "</span></td><td>6 PM</td></tr>";
		}
	}
		$("#retrievedSubtasksTableBody").html(output);
	}, error:function(error){
		console.log("Query error : " + error.message);
	}
  });
}

function subtaskStriker(element){
	var textDecoration = element.style.textDecoration;
	if(textDecoration=="line-through"){
		var newSubtask = new Subtask();
		
		var name = element.innerHTML;
		var done = false;
		var id = element.getAttribute("data-id");
		
		newSubtask.set("name", name);
		newSubtask.set("done", done);
		newSubtask.set("objectId", id);  
		newSubtask.save(
		  {
			success:function(){
				element.style.textDecoration="";
				retrieveSubtasks();
			}, 
			error:function(error){
			  alert("There was an error setting the subtask as undone!");
			}
		  }); 
	}
	
	else if(textDecoration==""){
		var newSubtask = new Subtask();
		
		var name = element.innerHTML;
		var done = true;
		var id = element.getAttribute("data-id");
		
		newSubtask.set("name", name);
		newSubtask.set("done", done);
		newSubtask.set("objectId", id);
		  
		  newSubtask.save(
		  {
			success:function(){
				element.style.textDecoration="line-through";
				retrieveSubtasks();
			}, 
			error:function(error){
			  alert("There was an error setting the subtask as done!");
			}
		  }); 
	}
}
