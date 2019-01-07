const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const api = require('./backend/routes');
var cors = require('cors');
const url = "http://localhost";

app.use(cors({origin: url}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/public/index.html'); // For React/Redux
});

app.use('/api', api);


app.listen(PORT, error => {
    error
    ? console.error("is this happending? ", error)
    : console.info(`==> 🌎 Listening on port ${PORT}. Visit ${url}:${PORT}/ in your browser.`);
});
