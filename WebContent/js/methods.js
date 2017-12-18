/**
 * callee method
 */

function calculateAndDisplayRoute(directionFromAddr, directionsDisplay) {
	directionsService.route({
		origin: directionFromAddr,
		destination: new google.maps.LatLng(req_latlng.lat, req_latlng.lng),
		travelMode: 'DRIVING'
	}, function(response, status) {
		if (status === 'OK') {
		  directionsDisplay.setDirections(response);
		  
		  if(window.marker_array){
			  $.each(marker_array, function( key, cluster ) {
				  $.each(cluster, function( i, marker_item ) {
					  marker_item.setOptions({'opacity': 0.3});
				  });	
			  });
		  }
		} else {
			warningMsg('導航失敗: ' + status);
		}
	});
}

function format_radius(radius){
	if(radius>=1000){
		return new Number(radius/1000).toFixed(1) +" 公里";
	}else{
		return radius+" 公尺";
	}
}

function compute_zoom(radius){
	if (radius == null) return 7;
	var radius = +radius;
	if(radius<=12){return 21;}
	if(radius<=22){return 20;}
	if(radius<=50){return 19;}
	if(radius<=80){return 18;}
	if(radius<=200){return 17;}
	if(radius<=440){return 16;}
	if(radius<=880){return 15;}
	if(radius<=1800){return 14;}
	if(radius<=3600){return 13;}
	if(radius<=7200){return 12;}
	if(radius<=16000){return 11;}
	if(radius<=34000){return 10;}
	if(radius>34000 ){return 9;}
}

function draw_circle(req_lat,req_lng,radius,info_msg){
	if(radius!=null){
		$("#title_r").html(format_radius(radius));
		$(".page_title").show();
	}
	var rs_marker = new google.maps.Marker({
	    position: {lat: req_lat, lng: req_lng },
	    map: map,
	    zIndex:9999
	});
	
	if(getUrlParameter('building')!=null){
		$(".building_name").html(getUrlParameter('building'));
		var building_icon_url = "./image.do?action=getBuildingIcon"
			+ "&pic_name="
			+ encodeURI(getUrlParameter('building')+ ".png").replace(/\+/g,'%2b');
		rs_marker.setIcon(building_icon_url);
	}
	var rs_circle = new google.maps.Circle({
		  strokeColor: '#FF0000',
		  strokeOpacity: 0.5,
		  strokeWeight: 2,
		  fillColor: '#FF8700',
		  fillOpacity: 0.2,
		  map: map,
		  center: {lat: req_lat, lng: req_lng },
		  radius: +radius
	});
	var tmp_id = UUID();
	var infowindow = new google.maps.InfoWindow({content:"<div id='infowindow_"+tmp_id+"' class='info_window' style='padding:8px;font-size:140%;'>建案 '<b style='font-size:120%;'>"+getUrlParameter('building')+"</b>' 之地點</div>",disableAutoPan: true});
	google.maps.event.addListener(rs_marker, "click", function () {
		infowindow.open(map, rs_marker);
		$("#infowindow_"+tmp_id).click(function(){
			infowindow.close();
		});
	});
	
	$.ajax({
		type : "POST",
		url : "poiHiyes.do",
		data : {
			action : "select_POI_hiyes",
			lat :req_lat,
			lng : req_lng,
			radius : radius,
			token : getUrlParameter('token')
		},success : function(result) {
			
			if(result=="fail!"){
				warningMsg("錯誤","查詢發生錯誤，請洽系統管理員");
				return;
			}
			var json_obj = $.parseJSON(result).result;
			$.each(json_obj,function(i, item) {
				json_obj[i].center = {lat: +json_obj[i].lat, lng: +json_obj[i].lng};
			});
			
			function continue_search(){
				$.each(json_obj,function(i, item) {
					
					var marker = new google.maps.Marker({
					    position: json_obj[i].center,
					    title: json_obj[i].name,
					    map: map,
					});
					if(json_obj[i].icon!=null && json_obj[i].icon.length>3){
						var poi_icon_url = "./image.do?action=getPoiIconPath"
							+ "&pic_name="
							+ encodeURI(json_obj[i].icon.replace('./refer_data/poi_icon/','')).replace(/\+/g,'%2b');
						if( json_obj[i].type.indexOf("停車場")!=-1
								|| json_obj[i].type == "丹堤咖啡"
								|| json_obj[i].type == "大樹藥局"
								|| json_obj[i].subtype == "提款機" 
							 ){
							marker.setIcon({
								url: poi_icon_url,
								scaledSize: new google.maps.Size(24, 24)
							});
						}else{
							marker.setIcon(poi_icon_url);
						}
					}
					var unique_id = UUID();
					marker.setOptions({'opacity': 0.8});
					var tmp_table='<div id="infowindow_'+unique_id+'" style="margin:8px;"><table class="info_window">'+
						'<tr><th colspan="2">'+json_obj[i].type+'　</th></tr>'+
						'<tr><td>名稱：</td><td>'+json_obj[i].name+'</td></tr>'+
						((json_obj[i].addr!=null)?'<tr><td>地址：</td><td>'+json_obj[i].addr+'</td></tr>':"")+
						((json_obj[i].subtype!=null&&json_obj[i].subtype!='NULL')?'<tr><td>類型：</td><td>'+json_obj[i].subtype+'</td></tr>':"")+
						'</table></div>';
					var infowindow = new google.maps.InfoWindow({content:tmp_table});
					
					google.maps.event.addListener(marker, "click", function(event) { 
						var infowindow_open = infowindow.getMap();
					    if(infowindow_open !== null && typeof infowindow_open !== "undefined"){
					    	infowindow.close();					    	
					    }else{
					    	marker.setOptions({'opacity': 0.8});
					    	infowindow.open(marker.get('map'), marker);
					    	$("#infowindow_"+unique_id).click(function(){
								infowindow.close();
							});
					    	setTimeout(function () { infowindow.close(); }, 3000);
					    }
			        });
					
					if(!window.marker_array){
						marker_array={};
					}
					if(!window.marker_array[json_obj[i].category]){
						marker_array[json_obj[i].category]=[];
					}
					marker_array[json_obj[i].category].push(marker);
				});
			}
			
			if(json_obj.length>80000){
				warningMsg("警告","查詢資料量異常，系統已自動中止搜尋。");
			}else if(json_obj.length>1000){
				$("<div/>").html("生活圈POI資料量達"+json_obj.length+"筆\n是否繼續查詢?").dialog({
					title: "提醒",
					draggable : true,
					resizable : false,
					autoOpen : true,
					height : "auto",
					modal : true,
					buttons : [{
						text: "確認", 
						click: function() { 
							continue_search();
							$(this).dialog("close");
							
						}
					},{
						text: "取消", 
						click: function() { 
							$(this).dialog("close");
						}
					}]
				});
			}else{
				continue_search();
			}
		}
	});
}