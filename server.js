const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// Key value port for Heroku. Run port 3000 if localhost.
const port = process.env.PORT || 3000;
var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// Middleware

app.use((request, response, next) => {
	// Creates a readable timestamp.
	var now = new Date().toString();
	var log = `${now}: ${request.method} ${request.url}`;

	console.log(log);
	fs.appendFile('server.log', log + '\n', (err) => {
		if (err)  {
			throw err;
			console.log('Unable to append data.');
		}
	});
	// App can't continue if next isn't called.
	next();
});

// Maintenance page. Redirects all pages to a maintenance page.
// app.use((request, response, next) => {
// 	response.render('maintenance.hbs');
// });

// Help.html
app.use(express.static(__dirname + '/public'));


// Helpers

hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
	return text.toUpperCase();
});

// Handlers for HTTP request.

app.get('/', (request, response) => {
	response.render('home.hbs', {
		pageTitle: 'Home Page',
		welcomeMsg: 'Welcome to the root file!',
		title: 'Eldorado - Home'
	});
});



app.get('/about', (request, response) => {
	response.render('about.hbs', {
		pageTitle: 'About Page',
		title: 'Eldorado - About'

	});
});

app.get('/projects', (request, response) => {
	response.render('projects.hbs', {
		pageTitle: 'Projects Page',
		title: 'Eldorado - Projects'

	});
});

app.get('/bad', (request, response) => {
	response.send({
		errorMessage: 'Unable to handle request.'
	});
});


// Bind app to a port on our machine. 2nd argument function is optional.
// Dynamic port for Heroku
app.listen(port, () => {
	console.log(`Server is up and running on port ${port}`);
});
