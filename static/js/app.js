// Vue.config.delimiters = ['[[',']]']

Vue.http.options.root = '/';
var hello = new Vue({
	el:'#vueApp',
	delimiters:['[[',']]'],
	data:{
		message:'Welcome to Vue App!'
	}
})


var login = new Vue({
	delimiters:['[[',']]'],
	el:'#loginForm',
	data:{
		form:{
			username:'',
			password:''
		}
	},

	methods:{
		loginUser: function(){
			console.log(this.form)
			this.$http.post('/login', {data:this.form})
			.then(response => {
				if (response.data.status == true ){
					window.location.href = '/dashboard'
				}
			}, response => {
				console.log("error >>> ",response.data.message)
			})
		}
	}
})


var signup = new Vue({
	delimiters:['[[',']]'],
	el:'#signupForm',
	data:{
		form:{
			username:'',
			password:'',
			error_msg:'',
			has_error:''
		}
	},

	methods:{
		signupUser: function(){
			this.$http.post('/signup', {data:this.form})
			.then(response => {
				if (response.data.code == 200 && response.data.status == true){
					window.location.href = '/'
				}
				else{
					this.form.error_msg = response.data.message;
					this.form.has_error = "has-error";
				}
			}, response => {
				console.log("error >>> ",response.data.message)
			})
		}
	}
})