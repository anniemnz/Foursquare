const version = '?v=20170901';
const clientid = '&client_id=RPGUL25RSMX1OOV0ZFGA3OGD0IF5XKQB0SA4RWEC1VIHWTHF';
const clientSecret = '&client_secret=UY2ZX5BNM03Z0SIHI4CPLHI4PMAW1PS01ZLK2D2NOV14DVL4';
const key = version + clientid + clientSecret;

$(function(){

	let center = [-36.8446152873055,174.76662397384644];
	let map = L.map('map').setView(center,17);
	L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhhbHl4OTAiLCJhIjoiY2o2YjdrZHRlMWJmYjJybDd2cW1rYnVnNSJ9.j_DQLfixHfhioVjH6qmqkw').addTo(map);

	//vicinity circle
	L.circle(center, {
						radius: 250,
						color: 'salmon',
						weight:1,
						fill:false
					}).addTo(map);

	//Explore venues -- foursquare api

	let exploreUrl = 'https://api.foursquare.com/v2/venues/explore'+key+'&ll=-36.8446152873055,174.76662397384644';

	$.ajax({
		url:exploreUrl,
		dataType:'jsonp',
		success:function(res){
		
			let data = res.response.groups[0].items;

			let venues = _(data).map(function(item){

				return {
						latlng:[item.venue.location.lat,item.venue.location.lng],
						description: item.venue.name,
						iconImage: 'assets/cafe.svg',
						venueid: item.venue.id
					};
			});


			_(venues).each(function(venue){

				let venueIcon = L.icon({
											iconUrl: venue.iconImage,
											iconSize:[30,30]
										});
				let marker = L.marker(venue.latlng,{icon:venueIcon}).addTo(map);

				//add venueid to marker
				marker.venueid = venue.venueid;

				marker.on('click',function(){
				
					let venueUrl = 'https://api.foursquare.com/v2/venues/'+this.venueid+key;

					$.ajax({
						url:venueUrl,
						dataType:'jsonp',
						success:function(res){

							let photos = res.response.venue.photos.groups[0].items;

							$('.modal-title').text(res.response.venue.name);

							$('.modal-body').empty();

							_(photos).each(function(photo){
								let photoPath = photo.prefix +'100x100'+photo.suffix;
								$('<img src='+photoPath+'>').appendTo('.modal-body');
							});

							$('#myModal').modal('show');

						}
					});

				})
			});
		}
	});

	


});












