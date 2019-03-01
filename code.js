//Рисуем карту
mapboxgl.accessToken = 'pk.eyJ1IjoieXVyYWt1em1pY2giLCJhIjoiY2pzMGxmcWk0MWt5dDN5bzMxY2V1MDA3aCJ9.uWl284AonDQe4NK9ISlOjQ';
const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/yurakuzmich/cjs0luc2y3s4v1fo1qz5s3r3e',
center: [0,0],
zoom: 3
});

//Определяем местоположение и центрируем карту в месте нахождения пользователя
navigator.geolocation.getCurrentPosition(function(position) {
	window.myLat = position.coords.latitude;
	window.myLng = position.coords.longitude;
	var ll = new mapboxgl.LngLat(position.coords.longitude, position.coords.latitude);
	var myposition = ll.toArray();
	map.setCenter(myposition);
});

//Пробуем по-людски получить json
var xhr = new XMLHttpRequest();
xhr.open('GET', '/db', true);
xhr.send();

xhr.onload = function() {
	
	var result = xhr.responseText;
	var users = JSON.parse(result);
	
	users.features.forEach(function callback(currentValue, index, array) {
		renderUser(currentValue.properties.avatar, currentValue.properties.userName, 
		currentValue.properties.email, currentValue.properties.url,
		currentValue.geometry.coordinates);
		
		let markerdiv = document.createElement('div');
		markerdiv.className = 'marker';
		markerdiv.style.background = '#fff url('+currentValue.properties.avatar+') no-repeat center';
				
		let usermarker = new mapboxgl.Marker(markerdiv);
		usermarker.setLngLat(currentValue.geometry.coordinates);
		usermarker.addTo(map);
		
		markerdiv.addEventListener('click', function() {
			flyToUser(currentValue.geometry.coordinates[0], currentValue.geometry.coordinates[1]);
		});
	});
	
	var usersinlist = document.querySelectorAll(".avatar > img");
	for (var i = 0; i < usersinlist.length; i++) {
		usersinlist[i].onclick = function() {
			flyToUser(this.dataset.lng, this.dataset.lat);
		}
	}
}

//Описания функций
function renderUser(avatar, username, usermail, userurl, usercoords) {
	let user = '';
		user +=  '<div class="user">';
			user +=  '<div class="avatar">';
				//Аватарка
				user += '<img src="'+avatar+'" data-lng="'+usercoords[0]+'" data-lat="'+usercoords[1]+'">';
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

function flyToUser(lng, lat) {
	map.flyTo({center: [lng, lat], zoom:6});
}