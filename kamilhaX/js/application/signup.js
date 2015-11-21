Parse.initialize("0tVwiPK2ojovt24VcBqJ1jKE60QoxufdEB1Xcna0", "eWlSk7NQgYBXyz9G8kUFTCUoZqemXPMyrZrcTKOX");

var List = Parse.Object.extend("List");


$("#signUpForm").submit(function(event) {
	event.preventDefault();
	console.log(Parse.User.current());

	if(Parse.User.current()==null){
		var name = $("#signUpEmailTextField").val();
		var pass = $("#signUpPasswordTextField").val();
		var confirmationPass = $("#signUpPasswordConfirmationTextField").val();
		
		if(pass==confirmationPass){
			var user = new Parse.User();
			user.set("username", name);
			user.set("password", pass);
			user.signUp(null, {
				success: function(user) {
					var list = new List();
					list.set("name", "Inbox");
					list.set("user", Parse.User.current());
					list.save(
					  {
						success:function(){
							location.href="home.html";	
						}, 
						error:function(error){
						  alert("There was an error!");
						}
					  });  
					
				},

				error: function(user, error) {
					alert("Signup error : " + error.message);
				}
			});
		}
		
		else if(pass!=confirmationPass){
			alert("The password must be identical to the confirmation password.");
		}
	}
	
	else if(Parse.User.current()!=null){
		alert("You are already logged in as " + Parse.User.current().get("username"));
	}
});
