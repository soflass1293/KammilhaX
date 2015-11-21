Parse.initialize("0tVwiPK2ojovt24VcBqJ1jKE60QoxufdEB1Xcna0", "eWlSk7NQgYBXyz9G8kUFTCUoZqemXPMyrZrcTKOX");

$("#loginForm").submit(function(event) {
        event.preventDefault();
        if(Parse.User.current()==null){
			var name = $("#loginEmailTextField").val();
			var pass = $("#loginPasswordTextField").val();
			
			Parse.User.logIn(name, pass, {
				success: function(user) {
					location.href="home.html";
				},
				error: function(user, error) {
				  alert("Login error : " + error.message);
			}
		});
	}
	
	else if(Parse.User.current()!=null){
		alert("You are already logged in as " + Parse.User.current().get("username"));
		location.href="home.html";
				
	}
});
