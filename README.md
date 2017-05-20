# xerox-nlp-client

A simple promise-based Node client for the Xerox Linguistic Tools API.

## Installation

    npm install katspaugh/xerox-nlp-client

## Usage

From the command line:

    ./bin/postag 'Er ist ein guter Kerl.' 'German'

As a Node library:

    const posTag = require('xerox-nlp-client');

    posTag('Er ist ein guter Kerl.', 'German')
      .then(data => console.log(data));
