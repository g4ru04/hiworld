/**
 * caller & prepare method
 */

$(function() {
//$(window).load(function() {	
	if(getUrlParameter('building')!=null){
		var building_icon_url = "./image.do?action=getBuildingIcon"
			+ "&pic_name="
			+ encodeURI(getUrlParameter('building')+".png").replace(/\+/g,'%2b');

		head = document.getElementsByTagName('head')[0];
		link = document.createElement('link');
		link.type = "image/x-icon";
		link.rel = "SHORTCUT ICON"
		link.href = building_icon_url;
		head.appendChild(link);
	}
});

function initMap() {
	
	$.ajax({
		type : "POST",
		url : "poiHiyes.do",
		async : false,
		data : {
			action : "check_token",
			token :getUrlParameter('token'),
		},success : function(result) {
			if(result=="success"){
				console.log("安全認證成功");
				var lat = getUrlParameter("lat");
				var lng = getUrlParameter("lng");
				var radius = getUrlParameter("radius");
				var zoom = getUrlParameter("zoom"); 
				zoom = (zoom==null?compute_zoom(radius):+zoom);

				req_latlng = {lat: ( lat!=null ? parseFloat(lat) : 23.598321171324468), lng: ( lng!=null ? parseFloat(lng) : 120.97802734375) };
				
				map = new google.maps.Map(document.getElementById('map'), {
					panControl: true,
				    zoomControl: true,
				    mapTypeControl: false,
				    scaleControl: true,
				    streetViewControl: true,
				    overviewMapControl: true,
				    zoom: zoom,
					center: req_latlng
				});
				
				if(radius!=null){
					draw_circle(req_latlng.lat,req_latlng.lng,radius);
				}
				directionsService = new google.maps.DirectionsService;
			    directionsDisplay = new google.maps.DirectionsRenderer;
			    directionsDisplay.setMap(map);
			    
				pre_prepare();
				setup_search();
				prepare_category_checkbox();
				$(".over_map").show();
			}else{
				warningMsg("警告","安全認證字串錯誤，將停止本項服務");
				$(".ui-widget-overlay").css("opacity", "0.5");
				$(".over_map,.map").remove();
				console.log("安全認證失敗");
			}
			
		}
	});
}

function setup_search(){
	
	$("#search-box-enter").click(function(e){
		e.preventDefault();
		var search_str = $("#search-box-input-view").val();
		if(search_str.length!=0){
			calculateAndDisplayRoute(
					search_str
	        	,directionsDisplay);
			$("#direction_container").toggleClass("closed");
		}else{
			if (navigator.geolocation) {
		        navigator.geolocation.getCurrentPosition(function(position){
		        	calculateAndDisplayRoute(
		        		new google.maps.LatLng( position.coords.latitude ,position.coords.longitude)
		        	,directionsDisplay);
		        	$("#direction_container").toggleClass("closed");
		        },function(error){
		        	console.log(error);
		        	warningMsg("警告","瀏覽器不支援定位");
			    },{
			         enableHighAccuracy: true,
			         timeout : 5000
			    });
		    }else{
		    	warningMsg("警告","瀏覽器不支援定位");
		    }
		}
		
	});
}

function pre_prepare(){
	$("#search-box-input-view").keypress(function(e) {
		if(e.which == 13) {
	    	e.preventDefault();
	    	$("#search-box-enter").trigger("click");
	    }
	});
	
	$("#toggle-button").click(function(){
		$(this).toggleClass("closed");
		$("#poi_show_list_container").toggleClass("closed");
		$("#poi_show_list_container").css("left","");
		$("#poi_show_list_container").css("top","");
	});
	
	$("#toggle-button").mouseover(function(e) {
		  $("#tooltip").css({"top": (e.pageY+20) + "px","left": (e.pageX+10)  + "px"}).show();
	}).mousemove(function(e) {
		  $("#tooltip").css({"top": (e.pageY+20) + "px","left": (e.pageX+10)  + "px"});
	}).mouseout(function() {
		  $( "#tooltip" ).hide();
	});
	
	$("#go_navigate,#left_navigate").click(function(){
		$("#direction_container").toggleClass("closed");
	});
}

function prepare_category_checkbox(){

	$("#poi_show_list_container").draggable({ containment: "body",drag: function( event, ui ) { $("#poi_show_list_container").css("transition","none");} });
	
	var poi_show_list=[
		{"key":"eat","value":"飲食相關"},
		{"key":"health","value":"醫療與藥局"},
		{"key":"convenient","value":"生活便利"},
		{"key":"functionality","value":"生活機能"}
	];
	
	$.each(poi_show_list,function(i,item){
		$("#poi_show_list_container table").append(
			$("<tr/>").html([
				$("<td/>").html($("<input/>",{
					"name" : "poi_show_list",
					"type" : "checkbox",
					"checked" : true,
					"value" : item.value,
					"eng_value" : item.key
				})),
				$("<td/>").html("<b>"+item.value+"</b>")
			])
		);
	});
	
	$("input[name='poi_show_list']").click(function(){
		var have_checked = $(this).prop("checked");
		if(window.marker_array[$(this).val()]){
			  $.each(marker_array[$(this).val()], function( i, marker_item ) {
				  marker_item.setMap(have_checked==true?map:null);
			  });	
		  }
	});
	
}