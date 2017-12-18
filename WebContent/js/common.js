/**
 * common method
 */

function warningMsg(title, msg) {
	$("<div/>").html(msg).dialog({
		title: title,
		draggable : true,
		resizable : false,
		autoOpen : true,
		height : "auto",
		modal : true,
		buttons : [{
			text: "確認", 
			click: function() { 
				$(this).dialog("close");
			}
		}]
	});
}

function UUID(){
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    return v.toString(16);
	});
}

function getUrlParameter(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function tooltip(clas){
	$("."+clas).mouseover(function(e){
		 this.newTitle = $(this).attr("title");
		 this.title = "";
		 var tooltip = "<div id='tooltip'>"+ this.newTitle +"<\/div>";
		 $("body").append(tooltip);
		 $("#tooltip").css({"top": (e.pageY+20) + "px","left": (e.pageX+10)  + "px"}).show("fast");
	 }).mouseout(function(){
	         this.title = this.newTitle;
	         $("#tooltip").remove();
	 }).mousemove(function(e){
	         $("#tooltip").css({"top": (e.pageY-20) + "px","left": (e.pageX+10)  + "px"});
	 });
}

