  



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


//Новый вывод пользователей
if(myRequest.status != 200) {
	console.log('Err. #${myRequest.statusText}');
} else {
	users.features.forEach(function callback(currentValue, index, array) {
		//console.log(currentValue);
		renderUser(currentValue.properties.avatar, currentValue.properties.userName, 
		currentValue.properties.email, currentValue.properties.url);
		
		
		let markerdiv = document.createElement('div');
		markerdiv.className = 'marker';
		markerdiv.style.background = '#fff url('+currentValue.properties.avatar+') no-repeat center';
				
		let usermarker = new mapboxgl.Marker(markerdiv);
		usermarker.setLngLat(currentValue.geometry.coordinates);
		usermarker.addTo(map);
	});
}


//Вывод списка пользователей и добавление маркеров на карту
/*
if(myRequest.status != 200) {
	console.log('Error'+': '+myRequest.statusText);
} else {
	for(var i = 0; i <= 100; i++) {
		//Добавляем пользователя
		let user='<div class="container"><div class="row"><div class="col"><img src="'+users.features[i].properties.avatar+'" class="rounded" onclick="flyToUser('+users.features[i].geometry.coordinates[0]+','+ users.features[i].geometry.coordinates[1]+')"></div><div class="col"><p class="text-left">' + users.features[i].properties.userName +'</p><p>email: <a href="mailto:'+users.features[i].properties.email+'">'+users.features[i].properties.email+'</a></p><p>homepage: <a href="'+users.features[i].properties.url+'">'+users.features[i].properties.url+'</a></p></div></div></div>';
		userlist.innerHTML += user + '<br>';
		
		//Добавляем маркер пользователя
		
		//DOM-элемент для маркера
		var el = document.createElement('div');
		el.className = 'marker';
		el.style.background = '#fff url('+users.features[i].properties.avatar+') no-repeat center';
		
		//Обработчик для элемента маркера
		el.addEventListener('click', function(newalert, lng, lat) {
			return function(){
				//В алерт выведем имя поьзователя
				window.alert("Имя пользователя: "+newalert);
				//И отценрируем на нем карту
				flyToUser(lng, lat);
			};
		}(users.features[i].properties.userName, users.features[i].geometry.coordinates[0],users.features[i].geometry.coordinates[1]));

		//Создаем маркер
		let usermarker = new mapboxgl.Marker(el);
		usermarker.setLngLat(users.features[i].geometry.coordinates);
		usermarker.addTo(map);
		//console.log("Добавлен маркер № "+i);
	}
}
*/
 
 
//Функция отрисовки пользоваеля
function renderUser(avatar, username, usermail, userurl) {
	let user = '';
		user +=  '<div class="user">';
			user +=  '<div class="avatar">';
				//Аватарка
				user += '<img src="'+avatar+'">';
			user += '</div>'
			user += '<div class="userinfo">';
				//Данные юзера
				user += '<p>'+username+'</p>';
				user += '<p><a href="mailto:'+usermail+'">'+usermail+'</a></p>';
				user += '<p><a href="'+userurl+'">'+userurl+'</a></p>';
			user += '</div>'
		user +=  '</div>';
	userlist.innerHTML += user;
	
}

//Функция центрирования карты на маркере пользователя
function flyToUser(lng, lat) {
	document.getElementById('userlist').style.display = 'none';
	//console.log();
	map.flyTo({center: [lng, lat], zoom:6});
}




