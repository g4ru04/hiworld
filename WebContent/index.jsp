<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<link rel="stylesheet" href="/hiyes/css/jquery-ui.min.css">
		<link rel="stylesheet" href="/hiyes/css/styles.css">
		<script type="text/javascript" src="/hiyes/js/jquery-1.12.4.min.js"></script>
		<script type="text/javascript" src="/hiyes/js/jquery-ui.min.js"></script>
		<script type="text/javascript" src="/hiyes/js/jquery-migrate-1.4.1.min.js"></script>
		<style>
		body{
			margin:0px;
		}
 		.map{
 			height: 100vh;
 		} 
 		
 		table{
			border-collapse: collapse;
			border-spacing: 0;
		}
		</style>
	</head>
	<body>
<!-- 	###以下為海悅所需之部分### -->
<!-- 		<div class='section-content'> -->
				<div id='poi_show_list_container' class='over_map closed'>
					<div id="toggle-button" class="closed"></div>
					<table></table>
				</div>
				
				<div id='go_navigate' class='over_map'></div>
				<div id="direction_container" class='over_map closed' style=''>
					<table class='direction'>
						<tr>
							<td>
								路線起點
							</td>
							<td>
								<input type="text" id="search-box-input-view" placeholder="輸入地點 或 所在地導航">
							</td>
							<td rowspan='2' align="center">
								<img id='search-box-enter' src="./images/go_direction2.png" class="func">
								<br>
								<a href="#" id="left_navigate">取消</a>
							</td>
						</tr>
						<tr>
							<td>
								路線終點
							</td>
							<td>
								&nbsp;<span class="building_name">海悅建案</span>位置
							</td>
						</tr>
					</table>
				</div>
				<div id="map" class="map"></div>
				<div class='page_title over_map' style='display:none;'>半徑 <span id="title_r">1000公尺</span> 生活圈</div>
<!-- 	###以上為海悅所需之部分### -->
		<div id="tooltip">
			點此可開啟<br>POI列表選單
		</div>
		<script type="text/javascript" src="/hiyes/js/common.js"></script>
		<script type="text/javascript" src="/hiyes/js/methods.js"></script>
		<script type="text/javascript" src="/hiyes/js/main.js"></script>
		<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBSQDx-_LzT3hRhcQcQY3hHgX2eQzF9weQ&signed_in=true&libraries=places,visualization&callback=initMap"></script>
	</body>
</html>