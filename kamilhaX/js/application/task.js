Parse.initialize("0tVwiPK2ojovt24VcBqJ1jKE60QoxufdEB1Xcna0", "eWlSk7NQgYBXyz9G8kUFTCUoZqemXPMyrZrcTKOX");

function prepareHomePage() {
    console.log(Parse.User.current().get("username"));
    $("#currentUserPhoto").attr('src', 'img/usericon.png');
    $("#currentUserEmail").val = Parse.User.current().get("username");
    $("#retrievedSubtasksDiv").css({
        'margin-top': '-8%'
    });
    $("#dueDateAdderDialog").hide();
    $("#subtaskAdderDialog").hide();
    $("#noteAdderDialog").hide();
    $("#listAdderDialog").hide();
    $("#reminderAdderDialog").hide();
    $("#alarmAdderDialog").hide();
    $("#taskMenu").hide();
    $("#listDropMenu").hide();
    getCurrentTaskName();
    getUserListsNames();
    retrieveSubtasks();

}

$("#backToTasksButton").click(function () {
    var taskIdHashedString = location.hash;
    location.href = "home.html" + taskIdHashedString;
});

/*************************************************/

$("#editTaskButton").click(function () {
    if ($("#taskNameTextField").val() != "") {

        var Task = Parse.Object.extend("Task");

        var editTask = new Task();

        var taskIdHashedString = location.hash;
        var taskId = taskIdHashedString.substr(1);

        var taskName = $("#taskNameTextField").val();

        var done = "";
        var important = "";

        var importantLine = document.getElementById("importantMenuItem").style.textDecoration;
        var doneLine = document.getElementById("doneMenuItem").style.textDecoration;

        if (doneLine == "line-through") {
            done = true;
        } else if (!(doneLine == "line-through")) {
            done = false;
        }

        if (importantLine == "line-through") {
            important = true;
        } else if (!(importantLine == "line-through")) {
            important = false;
        }

        editTask.set("objectId", taskId);
        editTask.set("name", taskName);

        editTask.set("done", done);
        editTask.set("important", important);

        editTask.save({
            success: function () {
                alert("The task has been updated!");
            },
            error: function (error) {
                alert("There was an error during adding the subtask!");
            }
        });
    }
});

function getCurrentTaskName() {
    var Task = Parse.Object.extend("Task");
    var editTask = new Task();
    var query = new Parse.Query(Task);
    var taskIdHashedString = location.hash;
    var taskId = taskIdHashedString.substr(1);
    query.equalTo("objectId", taskId);
    query.find({
        success: function (results) {
            var name = "";
            var important = "";
            var note = "";
            var done = "";
            var output = "";
            var list = null;
            var listName = "";
            for (var i in results) {
                name = results[i].get("name");
                important = results[i].get("important");
                done = results[i].get("done");
                note = results[i].get("note");
                list = results[i].get("list");
                var List = Parse.Object.extend("List");

                var query = new Parse.Query(List);
                query.equalTo("objectId", list.id);
                query.find({
                    success: function (lists) {
                        listName = lists[0].get("name");
                        var listId = lists[0].id;
                        $("#listItemTBody").html("<tr onclick='dropMenuFunction();' style='cursor:pointer;'><td class='mdl-data-table__cell--non-numeric'><span style='cursor:pointer;' data-id='" + listId + "'>" + listName + "</span></td><td></td></tr>");
                    }
                    , error: function (error) {
                        console.log("Query error : " + error.message);
                    }
                });

            }
            if (important == true) {
                document.getElementById("importantMenuItem").style.textDecoration = "line-through";
            }

            if (done == true) {
                document.getElementById("doneMenuItem").style.textDecoration = "line-through";
            }

            if (note != null) {
                if (note != "") {
                    $("#addNoteButton").attr("disabled", "disabled").off('click');
                    output += "<tr><td style='background:#FFEB3B'; class='mdl-data-table__cell--non-numeric'><span style='cursor:pointer;'>" + note + "</span></td><td style='cursor:pointer;' id='editNoteButton'><i style='width:12px;' class='material-icons'>edit</i></td></tr>";
                    $("#retrievedNotesTableBody").html(output);
                }
            }
            $("#taskNameTextField").val(name);
        },
        error: function (error) {
            console.log("Query error : " + error.message);
        }
    });
}

function getUserListsNames() {
    var List = Parse.Object.extend("List");
    var list = new List();
    var query = new Parse.Query(List);

    query.equalTo("user", Parse.User.current());
    query.find({
        success: function (results) {
            var output = "";
            for (var i in results) {
                var name = results[i].get("name");
                var id = results[i].id;
                output += "<div id='listItem' style='cursor:pointer;' class='item'><div class='label' fit style='color:#727272; font-size:14px;font-weight: normal;' onclick='listItemChooser(this)' data-id='" + id + "'>" + name + "</div><paper-ripple fit></paper-ripple></div>";
            }
            $("#listDropMenu").html(output);
        },
        error: function (error) {
            console.log("Query error : " + error.message);
        }
    });
}

///////////////////////////////////////////////////////////
/////////////FOOTER BUTTONS////////////////////////////////
$("#addTimeButton").click(function () {
    $("#dueDateAdderDialog").fadeIn();
    $("#taskMenu").hide();
});

$("#dueDateAdderDeclineButton").click(function () {
    $("#dueDateAdderDialog").hide(0);
});

$("#reminderAdderAcceptButton").click(function () {
    $("#reminderAdderDialog").hide(0);
    $("#alarmAdderDialog").fadeIn();
});

$("#reminderAdderDeclineButton").click(function () {
    $("#reminderAdderDialog").hide(0);
    $("#alarmAdderDialog").fadeIn();
});

$("#alarmAdderAcceptButton").click(function () {
    $("#alarmAdderDialog").hide(0);
});

$("#alarmAdderDeclineButton").click(function () {
    $("#alarmAdderDialog").hide(0);
});

//
$("#addSubtaskButton").click(function () {
    $("#subtaskAdderDialog").fadeIn();
    $("#taskMenu").hide();
});

$("#subtaskAdderDeclineButton").click(function () {
    $("#subtaskAdderDialog").fadeOut();
});

//
$("#addNoteButton").click(function () {
    $("#noteAdderDialog").fadeIn();
    $("#taskMenu").hide();
});

$("#editNoteButton").click(function () {
    alert("BOOOOOOOOOOO");
    $("#noteAdderDialog").fadeIn();
    $("#taskMenu").hide();
});

$("#noteAdderDeclineButton").click(function () {
    $("#noteAdderDialog").fadeOut();
});
//

$("#taskMenuButton").click(function () {
    $("#taskMenu").slideToggle(100);
});

$("#importantMenuItem").click(function () {
    var importantLine = document.getElementById("importantMenuItem").style.textDecoration;
    if (importantLine == "line-through") {
        document.getElementById("importantMenuItem").style.textDecoration = "";
    } else if (!(importantLine == "line-through")) {
        document.getElementById("importantMenuItem").style.textDecoration = "line-through";
    }
});

$("#doneMenuItem").click(function () {
    var doneLine = document.getElementById("doneMenuItem").style.textDecoration;
    if (doneLine == "line-through") {
        document.getElementById("doneMenuItem").style.textDecoration = "";
    } else if (!(doneLine == "line-through")) {
        document.getElementById("doneMenuItem").style.textDecoration = "line-through";
    }
});

function dropMenuFunction() {
    $("#listDropMenu").fadeToggle();
    $("#taskMenu").hide();
}
/**********************************************************/
/*Adding time*/
var Task = Parse.Object.extend("Task");
$("#dueDateAdderAcceptButton").click(function (event) {
    event.preventDefault();//Prevents automatic page refresh
    if (Parse.User.current() !== null) {
        var dueDateString = $("#date-format").val();
        var dueDate = new Date(dueDateString);
        if (dueDate !== "") {
            var task = new Task();

            task.set("dueDate", dueDate);

            var taskIdHashedString = location.hash;
            var taskId = taskIdHashedString.substr(1);
            task.set("objectId", taskId);
            
            task.save(
                    {
                        success: function () {
                            $("#date-format").val("");
                            $("#dueDateAdderDialog").hide();
                            $("#reminderAdderDialog").fadeIn(0);
                        },
                        error: function (error) {
                            alert("There was an error during adding the due date!");
                        }
                    });
        }

        else {
            alert("The due date value cannot be empty.");
        }
    }
});

var Task = Parse.Object.extend("Task");
$("#reminderAdderAcceptButton").click(function (event) {
    event.preventDefault();//Prevents automatic page refresh
    if (Parse.User.current() !== null) {
        var reminderDateString = $("#date-format-reminder").val();
        var reminderDate = new Date(reminderDateString);
        if (reminderDate !== "") {
            var task = new Task();

            task.set("reminderDate", reminderDate);

            var taskIdHashedString = location.hash;
            var taskId = taskIdHashedString.substr(1);
            task.set("objectId", taskId);
            task.save(
                    {
                        success: function () {
                            $("#date-format-reminder").val("");
                            $("#reminderAdderDialog").hide();
                            $("#alarmAdderDialog").fadeIn(0);
                        },
                        error: function (error) {
                            alert("There was an error during adding the reminder!");
                        }
                    });
        }

        else {
            alert("The reminder value cannot be empty.");
        }
    }
});

/*****************************************************
 /*Adding a new subtask*/
var Subtask = Parse.Object.extend("Subtask");
var Task = Parse.Object.extend("Task");

$("#subtaskAdderAcceptButton").click(function (event) {
    event.preventDefault();//Prevents automatic page refresh
    if (Parse.User.current() !== null) {
        var name = $("#subtaskNameTextField").val();
        if (name !== "") {
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
                        success: function () {
                            $("#subtaskNameTextField").val("");
                            retrieveSubtasks();
                            $("#subtaskAdderDialog").hide();
                        },
                        error: function (error) {
                            alert("There was an error during adding the subtask!");
                        }
                    });
        }

        else {
            alert("The subtask name cannot be empty.");
        }
    }
});

/*Retrieving subtasks*/
function retrieveSubtasks() {
    var Subtask = Parse.Object.extend("Subtask");
    var Task = Parse.Object.extend("Task");

    var query = new Parse.Query(Subtask);
    var task = new Task();
    var taskIdHashedString = location.hash;
    var taskId = taskIdHashedString.substr(1);

    task.set("objectId", taskId);
    query.equalTo("task", task);
    query.find({
        success: function (results) {
            var output = "";
            for (var i in results) {
                var name = results[i].get("name");
                var important = results[i].get("important");
                var done = results[i].get("done");
                var id = results[i].id;
                if (done == false) {
                    output += "<tr><td class='mdl-data-table__cell--non-numeric'><span style='cursor:pointer;' onclick='subtaskStriker(this)' data-id='" + id + "'>" + name + "</span></td><td></td></tr>";
                }

                if (done == true) {
                    output += "<tr><td class='mdl-data-table__cell--non-numeric'><span style='cursor:pointer;text-decoration: line-through;' onclick='subtaskStriker(this)' data-id='" + id + "'>" + name + "</span></td><td></td></tr>";
                }
            }
            $("#retrievedSubtasksTableBody").html(output);
        },
        error: function (error) {
            console.log("Query error : " + error.message);
        }
    });
}

function listItemChooser(element) {
    var Task = Parse.Object.extend("Task");
    var List = Parse.Object.extend("List");
    var listId = $(element).data("id");
    if (Parse.User.current() !== null) {
        if (listId !== "") {
            var task = new Task();
            var list = new List();
            var taskIdHashedString = location.hash;
            var taskId = taskIdHashedString.substr(1);
            console.log("Task ID : " + taskId);

            task.set("objectId", taskId);
            list.id = listId;

            task.set("list", list);

            task.save(
                    {
                        success: function () {
                            getCurrentTaskName();
                            $("#listDropMenu").hide(0);
                        },
                        error: function (error) {
                            alert("There was an error during assigning the list name!");
                        }
                    });
        }

        else {
            alert("The list name cannot be empty.");
        }
    }
}


function subtaskStriker(element) {
    var textDecoration = element.style.textDecoration;
    if (textDecoration == "line-through") {
        var newSubtask = new Subtask();

        var name = element.innerHTML;
        var done = false;
        var id = element.getAttribute("data-id");

        newSubtask.set("name", name);
        newSubtask.set("done", done);
        newSubtask.set("objectId", id);
        newSubtask.save(
                {
                    success: function () {
                        element.style.textDecoration = "";
                        retrieveSubtasks();
                    },
                    error: function (error) {
                        alert("There was an error setting the subtask as undone!");
                    }
                });
    }

    else if (textDecoration == "") {
        var newSubtask = new Subtask();

        var name = element.innerHTML;
        var done = true;
        var id = element.getAttribute("data-id");

        newSubtask.set("name", name);
        newSubtask.set("done", done);
        newSubtask.set("objectId", id);

        newSubtask.save(
                {
                    success: function () {
                        element.style.textDecoration = "line-through";
                        retrieveSubtasks();
                    },
                    error: function (error) {
                        alert("There was an error setting the subtask as done!");
                    }
                });
    }
}

/////////////////////////////////////////////////////
////////////NOTES////////////////////////////////////

var Task = Parse.Object.extend("Task");
$("#noteAdderAcceptButton").click(function (event) {
    event.preventDefault();//Prevents automatic page refresh
    if (Parse.User.current() !== null) {
        var note = $("#noteAdderTextField").val();
        if (note !== "") {
            var task = new Task();

            task.set("note", note);

            var taskIdHashedString = location.hash;
            var taskId = taskIdHashedString.substr(1);
            task.set("objectId", taskId);
            task.set("task", task);

            task.save(
                    {
                        success: function () {
                            $("#noteAdderTextField").val("");
                            $("#noteAdderDialog").hide();
                            getCurrentTaskName();
                        },
                        error: function (error) {
                            alert("There was an error during adding the note!");
                        }
                    });
        }

        else {
            alert("The note cannot be empty.");
        }
    }
});


/**********************************************************/
window.onpaint = prepareHomePage();