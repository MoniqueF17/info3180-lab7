/* Add your Application JavaScript */
/*global Vue*/
/*global VueRouter*/
/*global fetch*/
/*global token*/

Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="#">Lab 7</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/upload/">Upload <span class="sr-only">(current)</span></router-link>
          </li>
        </ul>
      </div>
    </nav>
    `
});

Vue.component('app-footer', {
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; Flask Inc.</p>
        </div>
    </footer>
    `
});

const Home = Vue.component('home', {
   template: `
    <div class="jumbotron">
        <h1>Lab 7</h1>
        <p class="lead">In this lab we will demonstrate VueJS working with Forms and Form Validation from Flask-WTF.</p>
    </div>
   `,
    data: function() {
       return {};
    }
});

const NotFound = Vue.component('not-found', {
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data: function () {
        return {};
    }
});

const uploadform = Vue.component('upload-form', {
    template: `
        <div class=upload>
            <h2>Upload Form</h2>
            <div>
                <ul class="list">
                    <li v-for="message in messages" class="list alert alert-success">
                        {{message.message}}
                        {{message.filename}}
                    </li>
                    <li v-for="error in errors" class="list alert alert-danger">
                        {{ error.errors[0] }} <br>
                        {{ error.errors[1] }}
                    </li>
                </ul>
                <form id="uploadForm"  @submit.prevent="uploadPhoto" method="POST" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="msg">Description</label><br>
                        <textarea placeholder="Add photo description here." class="textbox" id="desc" name="description"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="msg">Photo Upload</label><br>
                        <input class="form-control-file" type="file" name="photo"/>
                    </div>
                    <button class="btn btn-primary" type="submit">Upload</button>
                </form>
            <div>
        <div>
    `,
    data: function() {
       return {
           messages: [],
           errors: []
       };
    },
    methods: {
        uploadPhoto: function () {
            let self = this;
            let uploadForm = document.getElementById('uploadForm');
            let form_data = new FormData(uploadForm);
            fetch("/api/upload", {
                method: 'POST',
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (jsonResponse) {
                    // display a success/error message
                    console.log(jsonResponse);
                self.messages = jsonResponse.result;
                self.errors = jsonResponse.errors;
                })
                .catch(function (error) {
                    console.log(error);
            });
        }
    }
});
    
// Define Routes
const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: "/", component: Home},
        // Put other routes here
        {path: "/upload", component: uploadform},
        // This is a catch all route in case none of the above matches
        {path: "*", component: NotFound}
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});
