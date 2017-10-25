/* Show SignUp/SignIn menu */
function showSignup(){
	if(document.getElementById("popup").style.display == "none" || document.getElementById("popup").style.display == ""){
		document.getElementById("popup").style.display = "block";
	}else{
		document.getElementById("popup").style.display = "none";
	}
}

/* Confirm To skip alert */
function confirmSkip(){
	confirm("Are you sure you want to skip?");
}

/* Open Menu's in sidebar (chat, userlist, waitlist, profilesettings, staff) */
function openTab(evt, menuName) {
	// Declare all variables
	var i, tabcontent, tablinks;

	// Get all elements with class="tabcontent" and hide them
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}

	// Get all elements with class="tablinks" and remove the class "active"
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

	// Show the current tab, and add an "active" class to the button that opened the tab
	document.getElementById(menuName).style.display = "block";
	evt.currentTarget.className += " active";
}
document.getElementById("defaultOpen").click();

/* Open Menu's in staff sidebar */
function openPage(evt, menuName) {
	// Declare all variables
	var i, pagecontent, pagelinks;

	// Get all elements with class="tabcontent" and hide them
	pagecontent = document.getElementsByClassName("pagecontent");
	for (i = 0; i < pagecontent.length; i++) {
		pagecontent[i].style.display = "none";
	}

	// Get all elements with class="tablinks" and remove the class "active"
	pagelinks = document.getElementsByClassName("pagelinks");
	for (i = 0; i < pagelinks.length; i++) {
		pagelinks[i].className = pagelinks[i].className.replace(" active", "");
	}

	// Show the current tab, and add an "active" class to the button that opened the tab
	document.getElementById(menuName).style.display = "block";
	evt.currentTarget.className += " active";
}

/* Open Sign In or Sign Up part */
function openPart(evt, menuName) {
	// Declare all variables
	var i, popupcontent, signlinks;

	// Get all elements with class="tabcontent" and hide them
	popupcontent = document.getElementsByClassName("popupcontent");
	for (i = 0; i < popupcontent.length; i++) {
		popupcontent[i].style.display = "none";
	}

	// Get all elements with class="tablinks" and remove the class "active"
	signlinks = document.getElementsByClassName("signlinks");
	for (i = 0; i < signlinks.length; i++) {
		signlinks[i].className = signlinks[i].className.replace(" active", "");
	}

	// Show the current tab, and add an "active" class to the button that opened the tab
	document.getElementById(menuName).style.display = "block";
	evt.currentTarget.className += " active";
}

/* Opening different playlist */
function openPlaylist(evt, menuName) {
	// Declare all variables
	var i, playlistcontent, playlistlinks;

	// Get all elements with class="tabcontent" and hide them
	playlistcontent = document.getElementsByClassName("playlistcontent");
	for (i = 0; i < playlistcontent.length; i++) {
		playlistcontent[i].style.display = "none";
	}

	// Get all elements with class="tablinks" and remove the class "active"
	playlistlinks = document.getElementsByClassName("playlistlinks");
	for (i = 0; i < playlistlinks.length; i++) {
		playlistlinks[i].className = playlistlinks[i].className.replace(" active", "");
	}

	// Show the current tab, and add an "active" class to the button that opened the tab
	document.getElementById(menuName).style.display = "block";
	evt.currentTarget.className += " active";
}

/* Open content menu (roomInfo, history, playlists) */
function openMenu(evt, menuName) {

	if(menuName == "room-info"){					
		if(document.getElementById(menuName).style.display == "none" || document.getElementById(menuName).style.display == ""){
			document.getElementById(menuName).style.display = "block";
			document.getElementById('playlists').style.display = "none";
			document.getElementById('history').style.display = "none";
			document.querySelector(".history-button i").className = document.querySelector(".history-button i").className.replace("chevron-up", "history");
			document.querySelector(".playlists-button i").className = document.querySelector(".playlists-button i").className.replace("chevron-down", "format-list-bulleted");
		}else{
			document.getElementById(menuName).style.display = "none";
		}
	}
	
	if(menuName == "playlists"){					
		if(document.getElementById(menuName).style.display == "none" || document.getElementById(menuName).style.display == ""){
			document.getElementById(menuName).style.display = "block";
			document.getElementById('room-info').style.display = "none";
			document.getElementById('history').style.display = "none";
			document.querySelector(".history-button i").className = document.querySelector(".history-button i").className.replace("chevron-up", "history");
			document.querySelector(".playlists-button i").className = document.querySelector(".playlists-button i").className.replace("format-list-bulleted", "chevron-down");
		}else{
			document.getElementById(menuName).style.display = "none";
			document.querySelector(".playlists-button i").className = document.querySelector(".playlists-button i").className.replace("chevron-down", "format-list-bulleted");
		}
	}
	
	if(menuName == "history"){					
		if(document.getElementById(menuName).style.display == "none" || document.getElementById(menuName).style.display == ""){
			document.getElementById(menuName).style.display = "block";
			document.getElementById('room-info').style.display = "none";
			document.getElementById('playlists').style.display = "none";
			document.querySelector(".history-button i").className = document.querySelector(".history-button i").className.replace("history", "chevron-up");
			document.querySelector(".playlists-button i").className = document.querySelector(".playlists-button i").className.replace("chevron-down", "format-list-bulleted");
		}else{
			document.getElementById(menuName).style.display = "none";
			document.querySelector(".history-button i").className = document.querySelector(".history-button i").className.replace("chevron-up", "history");
		}
	}
}

/* vote button actions -> showing different styles depending the choices */
function voteButton(evt, vote) {
	// Declare all variables
	var i, upvote, downvote, grab, joinqueue;

	upvote = document.getElementById("upvote");
	downvote = document.getElementById("downvote");
	grab = document.getElementById("grab");
	joinqueue = document.getElementById("joinqueue");
	
	if(vote == "upvote"){
		if(document.getElementsByClassName("upvote")[0].classList.contains("active") == true){
			upvote.className = upvote.className.replace(" active", "");
			document.querySelector("#upvote > i.mdi-thumb-up").className = "mdi mdi-24px mdi-thumb-up-outline";
		}else{
			document.getElementById("upvote").className += " active";
			document.querySelector("#upvote > i.mdi-thumb-up-outline").className = "mdi mdi-24px mdi-thumb-up";
		}
		if(document.getElementsByClassName("downvote")[0].classList.contains("active")){
			downvote.className = downvote.className.replace(" active", "");
			document.querySelector("#downvote > i.mdi-thumb-down").className = "mdi mdi-24px mdi-thumb-down-outline";
		}
	}
	
	if(vote == "downvote"){
		if(document.getElementsByClassName("downvote")[0].classList.contains("active")){
			downvote.className = downvote.className.replace(" active", "");
			document.querySelector("#downvote > i.mdi-thumb-down").className = "mdi mdi-24px mdi-thumb-down-outline";
		}else{
			document.getElementById("downvote").className += " active";
			document.querySelector("#downvote > i.mdi-thumb-down-outline").className = "mdi mdi-24px mdi-thumb-down";
		}
		if(document.getElementsByClassName("upvote")[0].classList.contains("active")){
			upvote.className = upvote.className.replace(" active", "");
			document.querySelector("#upvote > i.mdi-thumb-up").className = "mdi mdi-24px mdi-thumb-up-outline";
		}
	}
	
	if(vote == "grab"){
		if(document.getElementsByClassName("grab")[0].classList.contains("active")){
			grab.className = grab.className.replace(" active", "");
			document.querySelector("#grab > i.mdi-star").className = "mdi mdi-24px mdi-star-outline";
		}else{
			document.getElementById("grab").className += " active";
			document.querySelector("#grab > i.mdi-star-outline").className = "mdi mdi-24px mdi-star";
		}
	}
	
	if(vote == "joinqueue"){
		if(document.getElementsByClassName("joinqueue")[0].classList.contains("active")){
			joinqueue.className = joinqueue.className.replace(" active", "");
			document.querySelector("#joinqueue > i.mdi-playlist-remove").className = "mdi mdi-24px mdi-playlist-plus";
		}else{
			document.getElementById("joinqueue").className += " active";
			document.querySelector("#joinqueue > i.mdi-playlist-plus").className = "mdi mdi-24px mdi-playlist-remove";
		}
	}
}

/* Show video controls */
function showControls() {
	document.getElementById("video-controls").style.opacity = 1;
}

function hideControls() {
	document.getElementById("video-controls").style.opacity = 0;
}