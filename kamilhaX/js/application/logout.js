Parse.initialize("0tVwiPK2ojovt24VcBqJ1jKE60QoxufdEB1Xcna0", "eWlSk7NQgYBXyz9G8kUFTCUoZqemXPMyrZrcTKOX");

$("#logoutForm").click(function(event){
    console.log(Parse.User.current().get("username"));
	if(Parse.User.current()!=null){  
		Parse.User.logOut();
		alert("You are now offline.");
	}	

	else if(Parse.User.current()==null){  
		alert("You are not logged in.");
	}	
});
	
      