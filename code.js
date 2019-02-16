



//Определяем местоположение и центрируем карту в месте нахождения пользователя

navigator.geolocation.getCurrentPosition(function(position) {
	window.myLat = position.coords.latitude;
	window.myLng = position.coords.longitude;
	var ll = new mapboxgl.LngLat(position.coords.longitude, position.coords.latitude);
	var myposition = ll.toArray();
	map.setCenter(myposition);
});


//Рисуем карту
mapboxgl.accessToken = 'pk.eyJ1IjoieXVyYWt1em1pY2giLCJhIjoiY2pzMGxmcWk0MWt5dDN5bzMxY2V1MDA3aCJ9.uWl284AonDQe4NK9ISlOjQ';
const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/yurakuzmich/cjs0luc2y3s4v1fo1qz5s3r3e',
center: [0,0],
zoom: 3
});


//Пробуем по-людски получить json
var myRequest = new XMLHttpRequest();
myRequest.open('GET', '/db', false);
myRequest.send();
var result = myRequest.responseText;
var users = JSON.parse(result);


//Вывод списка пользователей и добавление маркеров на карту
if(myRequest.status != 200) {
	console.log('Error'+': '+myRequest.statusText);
} else {
	for(var i = 0; i <= 100; i++) {
		//Добавляем пользователя
		let user='<div class="container"><div class="row"><div class="col"><img src="'+users.features[i].properties.avatar+'" class="rounded" onclick="flyToUser('+users.features[i].geometry.coordinates+')"></div><div class="col"><p class="text-left">' + users.features[i].properties.userName +'</p><p>email: <a href="mailto:'+users.features[i].properties.email+'">'+users.features[i].properties.email+'</a></p><p>homepage: <a href="'+users.features[i].properties.url+'">'+users.features[i].properties.url+'</a></p></div></div></div>';
		userlist.innerHTML += user + '<br>';
		//Добавляем маркер пользователя
		
		let usermarker = new mapboxgl.Marker();
		usermarker.setLngLat(users.features[i].geometry.coordinates);
		usermarker.addTo(map);
		//console.log("Добавлен маркер № "+i);
	}
}


  
  
  
//Обработчик кнопок переключения вида карта/пользователи
document.getElementById('mapbutton').onclick = function() {
      document.getElementById('userlist').style.display = 'none';
	  //map.flyTo({center:[0, 0], zoom:15});
}

document.getElementById('usersbutton').onclick = function() {
      document.getElementById('userlist').style.display = 'block';
}

//Функция перехода к маркеру пользователя
function flyToUser(usercoords) {
	document.getElementById('userlist').style.display = 'none';
	map.flyTo({center: usercoords, zoom:25});
}


