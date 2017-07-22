// Template strings goes here -----------------------------------------------
var photo_page = `<div>
<h2 v-cloak>[[ msg_add_photo ]]</h2>
<hr>
<form v-on:submit.prevent="submitPhoto()">
	<fieldset>
		<legend>Add Photo</legend>
		<div class="form-group">
			<label class="control-label col-md-2" for="photo_name">Photo Name</label>
			<div class="col-md-10">
				<input type="text" 
					class="form-control" 
					name="photo_name" 
					id="photo_name" 
					v-model="photo_form.name" 
					placeholder="Enter the name for photo" required/>
			</div>
		</div>
		<div class="form-group">
			<label class="control-label col-md-2" for="photo_url">Photo Url</label>
			<div class="col-md-10">
				<input type="text" 
					class="form-control" 
					name="photo_url" 
					id="photo_url" 
					v-model="photo_form.url" 
					placeholder="Enter the url for photo" required/>
			</div>
		</div>
		<div class="form-group">
			<div class="col-md-10 col-md-offset-2">
				<button type="reset" class="btn btn-default">Clear</button>
				<button class="btn btn-success" v-on:submit.prevent="submitPhoto()">Add</button>
			</div>
		</div>
	</fieldset>
</form>
</div>`


var album_page = `<div>
<h2 v-cloak>[[ msg_album ]]</h2>
<strong>Your current uuid: <code v-cloak>[[ server_data ]]</code></strong>
<br>
<a target="_blank" class="btn btn-info" v-on:click="loadAlbum()">Load Abum</a>
<hr>
<div id="photo_album" class="container">
	<div class="row placeholders">
		<div class="col-sm-12 col-md-8 col-lg-12 placeholder" >
			<div class="col-lg-3 col-md-4 col-sm-8" v-for="photo in photos">
				<img class="img-responsive" :src="photo.url"/>
				<label>[[ photo.name ]]</label>
			</div>
		</div>
	</div>
</div>
</div>`

// End of template strings ---------------------------------------------------
const Photo = { 
	template: photo_page , 
	delimiters:['[[',']]'],
	data(){
			data = {
				msg_add_photo:"Loaded the page where you can add your awesome photo urls!",
				photo_form:{}
			}

			return data 
	},
	methods:{
		submitPhoto: function(){
			this.$http.post('/dashboard/addPhoto', {data:this.photo_form})
			.then(res => {
				if (res.data.status = true) {
					// reload route forcibily since its same route (refer : https://github.com/vuejs/vue-router/issues/296)
					this.$router.go({path:'/add', force:true})
				}
			})
			console.log(this.photo_form)
		}
	}
}


const Album = {
	template: album_page , 
	delimiters:['[[',']]'],
	data(){
			data = {
				msg_album:"Loaded Album page",
				// load data from server while routing
				server_data:'',
				photos:{}
			}
			return data 
	},
	created:function(){
		this.$http.get('/dashboard/getData')
		.then(res => {
			if (res.data.status == true) {
				this.server_data = res.data.message
				console.log(this.server_data)
			}
		})
	},
	methods:{
		loadAlbum: function(){
			this.$http.get('/dashboard/getPhotos')
			.then(res => {
				if (res.data.status == true) {
					this.photos = res.data.photos
					console.log(this.photos)
				}
			})
		}
	}
	
}

const routes = [
	{ 
		path: '/add', 
		component: Photo 
	},
	{ path: '/album', component: Album }
]

const router = new VueRouter({
	routes // short for `routes: routes`
})


var app = new Vue({
	router
}).$mount('#app')

