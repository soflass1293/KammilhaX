Parse.initialize("0tVwiPK2ojovt24VcBqJ1jKE60QoxufdEB1Xcna0", "eWlSk7NQgYBXyz9G8kUFTCUoZqemXPMyrZrcTKOX");

function prepareHomePage() {
    console.log(Parse.User.current().get("username"));
    $("#currentUserPhoto").attr('src', 'img/usericon.png');
    $("#currentUserEmail").val = Parse.User.current().get("username");
    $("#validateTaskButton").hide(0);
    $("#addTaskForm").hide(0);
    $("#closeTaskAdderButton").hide(0);
    $("#visualisationMenu").hide(0);
    $("#listAdderDialog").hide(0);
    retrieveLists();
    retrieveTasks();
}

$("#addTaskButton").click(function () {
    $("#addTaskButton").fadeToggle(0);
    $("#topImage").fadeToggle(0);
    $("#addTaskForm").fadeToggle("slow");
    $("#closeTaskAdderButton").fadeToggle("slow");
    $("#retrievedTasksDiv").css({'margin-top': '-16%'});
    $("#listMenu").hide(0);
    $("#visualisationMenu").hide(0);
});

$("#closeTaskAdderButton").click(function () {
    $("#addTaskForm").fadeToggle(0);
    $("#closeTaskAdderButton").fadeToggle(0);
    $("#addTaskButton").fadeToggle("slow");
    $("#topImage").fadeToggle("slow");
    $("#retrievedTasksDiv").css({'margin-top': '0px'});
});

/*************************************************/

$("#visualizeButton").click(function () {
    $("#listMenu").hide(0);
    $("#visualisationMenu").slideToggle(150);
});

$("#listButton").click(function () {
    $("#visualisationMenu").hide(0);
    $("#listMenu").slideToggle(150);
});

//
$("#listAdderDeclineButton").click(function () {
    $("#listAdderDialog").hide(0);
});

function showListAdderDialog() {
    $("#listAdderDialog").fadeIn(150);
}

//
$("#layoutDrawerButton").click(function () {
    $("listMenu").css("display", "block");
});

$("#layoutDrawerButton").click(function () {
    $("locationMenu").css("display", "block");
});


/*************************************************/
/*PARSE USAGE*/

/*Adding a new task*/
var Task = Parse.Object.extend("Task");
var List = Parse.Object.extend("List");

$("#addTaskForm").submit(function (event) {
    event.preventDefault();//Prevents automatic page refresh
    if (Parse.User.current() != null) {
        var name = $("#taskNameTextField").val();
        var important = false;
        var done = false;
        var collaborative = false;

        var newTask = new Task();

        newTask.set("name", name);
        newTask.set("important", important);
        newTask.set("done", done);
        newTask.set("collaborative", collaborative);

        newTask.set("user", Parse.User.current());

        newTask.save(
                {
                    success: function () {
                        var query = new Parse.Query(List);
                        query.find({
                            success: function (lists) {
                                for (var j in lists) {
                                    var name = lists[j].get("name");
                                    $("#listItemTBody").html("<div id='listItem' style='cursor:pointer;' class='item'><div class='label' fit style='color:#727272; font-size:14px;font-weight: normal;'>" + name + "</div><paper-ripple fit></paper-ripple></div>");
                                }
                            }
                            ,
                            error: function (error) {
                                console.log("Query error : " + error.message);
                            }
                        });

                        $("#taskNameTextField").val("");
                        retrieveTasks();
                    },
                    error: function (error) {
                        alert("There was an error during adding the task!");
                    }
                });
    }
});

/*Retrieving tasks*/
function retrieveTasks() {
    var query = new Parse.Query(Task);
    query.ascending("dueDate");
    query.find({
        success: function (results) {
            var output = "";
            var listName = "";
            for (var i in results) {
                var name = results[i].get("name");
                var important = results[i].get("important");
                var done = results[i].get("done");
                var collaborative = results[i].get("collaborative");
                var dueDate = results[i].get("dueDate");

                if (dueDate !== undefined) {
                    var date = new Date();
                    var timeDiff = dueDate.getTime() - date.getTime();
                    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    var infoDate = "";
                    if (diffDays < 1) {
                        infoDate = "Outdated";
                        var dueDate = "";
                        var dueDateDay = "";
                        var dueDateMonth = "";
                        var dueDateYear = "";
                        var dueDateHour = "";
                        var dueDateMinutes = "";
                    }

                    else if (diffDays === 1) {
                        infoDate = "Tomorrow";
                        var dueDate = "";
                        var dueDateDay = "";
                        var dueDateMonth = "";
                        var dueDateYear = "";
                        var dueDateHour = "";
                        var dueDateMinutes = "";
                    }

                    else if (diffDays === 2) {
                        infoDate = "In two days";
                        var dueDate = "";
                        var dueDateDay = "";
                        var dueDateMonth = "";
                        var dueDateYear = "";
                        var dueDateHour = "";
                        var dueDateMinutes = "";

                    }

                    else if ((diffDays > 2) && (diffDays < 10)) {
                        infoDate = "Next 7 days";
                        var dueDate = "";
                        var dueDateDay = "";
                        var dueDateMonth = "";
                        var dueDateYear = "";
                        var dueDateHour = "";
                        var dueDateMinutes = "";
                    }

                    else {
                        var dueDate = results[i].get("dueDate") + "";
                        var dueDateDay = dueDate.substr(8, 2);
                        var dueDateMonth = dueDate.substr(4, 3);
                        var dueDateYear = dueDate.substr(11, 4);
                        var dueDateHour = " at " + dueDate.substr(16, 2);
                        var dueDateMinutes = ":" + dueDate.substr(19, 2);
                    }
                }

                else if (dueDate === undefined) {
                    var dueDate = "";
                    var dueDateDay = "";
                    var dueDateMonth = "";
                    var dueDateYear = "";
                    var dueDateHour = "";
                    var dueDateMinutes = "";
                    infoDate = "";
                }

                var id = results[i].id;

                var List = Parse.Object.extend("List");
                var query = new Parse.Query(List);

                if (collaborative == true) {
                    output += "<div class='calendar-date'></div><span><strong>This Week (July 2 - 8)</strong></span>";
                    output += "<div class='calendar-activity green mdl-shadow--1dp'><span><a style='color:white;' href='task.html#" + id + "'>" + name + "</a></span><span id='retrievedTaskTime' class='calendar-hour'>" + infoDate + dueDateMonth + " " + dueDateDay + dueDateHour + dueDateMinutes + "</span></div><div class='clr'></div><div></div>";
                }

                else if (important == false) {
                    output += "<div class='calendar-date'></div><span><strong>This Week (July 2 - 8)</strong></span>";
                    output += "<div class='calendar-activity teal mdl-shadow--1dp'><span><a style='color:white;' href='task.html#" + id + "'>" + name + "</a></span><span id='retrievedTaskTime' class='calendar-hour'><small>" + infoDate + dueDateMonth + " " + dueDateDay + dueDateHour + dueDateMinutes + "</small></span></div><div class='clr'></div>";
                }

                else if (done == true && important == false) {
                    output += "<div class='calendar-date'></div><span><strong>This Week (July 2 - 8)</strong></span>";
                    output += "<div class='calendar-activity teal mdl-shadow--1dp'><span style='text-decoration: line-through;'><a style='color:white;' href='task.html#" + id + "'>" + name + "</a></span><span id='retrievedTaskTime' class='calendar-hour'>" + infoDate + dueDateMonth + " " + dueDateDay + dueDateHour + dueDateMinutes + "</span></div><div class='clr'></div>";
                }

                else if (done == true && important == true) {
                    output += "<div class='calendar-date'></div><span><strong>This Week (July 2 - 8)</strong></span>";
                    output += "<div class='calendar-activity red mdl-shadow--1dp'><span style='text-decoration: line-through;'><a style='color:white;' href='task.html#" + id + "'>" + name + "</a></span><span id='retrievedTaskTime' class='calendar-hour'><small>" + infoDate + dueDateMonth + " " + dueDateDay + dueDateHour + dueDateMinutes + "</small></span></div><div class='clr'></div>";
                }

                else {
                    output += "<div class='calendar-date'></div><span><strong>This Week (July 2 - 8)</strong></span>";
                    output += "<div class='calendar-activity red mdl-shadow--1dp'><span><a style='color:white;' href='task.html#" + id + "'>" + name + "</a></span><span id='retrievedTaskTime' class='calendar-hour'></span></div><div class='clr'></div>";
                }

            }
            $("#retrievedTasksDiv").html(output);

        }
        , error: function (error) {
            console.log("Query error : " + error.message);
        }
    });
}
//
/*
 function retrieveTasksByListName(element){
 var listName = element.innerHTML.replace(/<[^>]*>/g, "");
 
 var newList = new List();
 newList.set("name", listName);
 
 var query = new Parse.Query(Task);
 
 query.equalTo("list", newList); 
 query.equalTo("user", Parse.User.current()); 
 
 query.find({
 success:function(results){
 var output="";
 for(var i in results){
 var name=results[i].get("name");
 var important=results[i].get("important");
 var done=results[i].get("done");
 var collaborative=results[i].get("collaborative");
 var id=results[i].id;
 
 if(collaborative==true){
 output+="<div class='calendar-date'><span>1</span><span>Fri</span></div>";
 output+="<div class='calendar-activity green mdl-shadow--1dp'><span><a style='color:white;' href='task.html#"+id+"'>"+name+"</a></span><span id='retrievedTaskTime' class='calendar-hour'></span></div><div class='clr'></div>";
 }
 
 else if(important==false){
 output+="<div class='calendar-date'><span>1</span><span>Fri</span></div>";
 output+="<div class='calendar-activity teal mdl-shadow--1dp'><span><a style='color:white;' href='task.html#"+id+"'>"+name+"</a></span><span id='retrievedTaskTime' class='calendar-hour'></span></div><div class='clr'></div>";
 }
 
 else{
 output+="<div class='calendar-date'><span>1</span><span>Fri</span></div>";
 output+="<div class='calendar-activity red mdl-shadow--1dp'><span><a style='color:white;' href='task.html#"+id+"'>"+name+"</a></span><span id='retrievedTaskTime' class='calendar-hour'></span></div><div class='clr'></div>";
 }
 
 }
 $("#retrievedTasksDiv").html(output);
 }, error:function(error){
 console.log("Query error : " + error.message);
 }
 });
 }	
 */
//////////////////////////////////////////////////
var List = Parse.Object.extend("List");

$("#listAdderAcceptButton").click(function (event) {
    event.preventDefault();//Prevents automatic page refresh
    if (Parse.User.current() != null) {
        var name = $("#listAdderTextField").val();

        var newList = new List();

        newList.set("name", name);

        newList.set("user", Parse.User.current());
        newList.save(
                {
                    success: function () {
                        $("#listAdderTextField").val("");
                        $("#listAdderDialog").fadeOut(0);
                        retrieveLists();
                    },
                    error: function (error) {
                        alert("There was an error during adding the list!");
                    }
                });
    }
});

function retrieveLists() {
    var query = new Parse.Query(List);
    query.equalTo("user", Parse.User.current());
    query.find({
        success: function (results) {
            var output = "";
            var itemsCounter = 0;
            for (var i in results) {
                var name = results[i].get("name");
                itemsCounter++;
                output += "<a id='listMenuItem' onclick='retrieveTasksByListName(this);' class='mdl-navigation__link animsition-link' style='cursor:pointer;' >" + name + "</a>";
            }
            output += "<a id='addNewListMenuItem' onclick='showListAdderDialog();' class='mdl-navigation__link animsition-link' style='cursor:pointer;'>Add a new list</a>";
            $("#listMenu").html(output);
            itemsCounter = itemsCounter + 1;
            itemsCounter = itemsCounter * 52;
            document.getElementById("listMenu").style.marginTop = "-" + itemsCounter + "px";
        }, error: function (error) {
            console.log("Query error : " + error.message);
        }
    });
}


//////////////////////////////////////////////////
var Location = Parse.Object.extend("Location");

$("#listLocationAcceptButton").click(function (event) {
    event.preventDefault();//Prevents automatic page refresh
    if (Parse.User.current() != null) {
        var name = $("#listLocationTextField").val();

        var newLocation = new Location();

        newLocation.set("name", name);

        newLocation.set("user", Parse.User.current());
        newLocation.save(
                {
                    success: function () {
                        $("#listLocationTextField").val("");
                        retrieveLocation();
                    },
                    error: function (error) {
                        alert("There was an error during adding the location!");
                    }
                });
    }
});

function retrieveLocations() {
    var query = new Parse.Query(List);
    query.equalTo("user", Parse.User.current());
    query.find({
        success: function (results) {
            var output = "";
            var itemsCounter = 0;
            for (var i in results) {
                var name = results[i].get("name");
                itemsCounter++;
                output += "<a id='lcoationtMenuItem' onclick='retrieveTasksByListName(this);' class='mdl-navigation__link animsition-link' style='cursor:pointer;' >" + name + "</a>";
            }
            output += "<a id='addNewLocationMenuItem' onclick='showLocationAdderDialog();' class='mdl-navigation__link animsition-link' style='cursor:pointer;'>Add a new location</a>";
            $("#locationMenu").html(output);
            itemsCounter = itemsCounter + 1;
            itemsCounter = itemsCounter * 52;
            document.getElementById("locationMenu").style.marginTop = "-" + itemsCounter + "px";
        }, error: function (error) {
            console.log("Query error : " + error.message);
        }
    });
}
/******************************************************/
window.onpaint = prepareHomePage();