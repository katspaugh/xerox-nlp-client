const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');


/**
 * Ensure that an object is an array
 *
 * @param {any} list
 * @returns {array}
 */
function ensureArray(list) {
  if (list instanceof Array) return list;
  return [ list ];
}

/**
 * Make a request to the API
 *
 * @param {string} text
 * @param {string} language
 * @returns {promise}
 */
function makeRequest(text, language) {
  const POS_API = 'https://services.open.xerox.com/RestOp/fst-nlp-tools/PartOfSpeechTagging?format=json';

  const form = new FormData();
  form.append('inputtext', text);
  form.append('language', language);

  return fetch(POS_API, { method: 'POST', body: form, headers: form.getHeaders() })
    .then(resp => resp.json());
}

/**
 * Smooth out the XML-to-JSON conversion
 *
 * @param {any} data
 * @returns {any}
 */
function formatResponse(data) {
  const sentences = ensureArray(
    data.PartOfSpeechTaggingResponse.PartOfSpeechTaggingResult.file.sentence
  );

  return sentences.map(sentence => {
    const lexemes = ensureArray(sentence['lexeme-list'].lexeme);

    return lexemes.map(lexeme => {
      const senseList = ensureArray(lexeme['sense-list']);
      const senses = ensureArray(senseList[0].sense);
      const sense = senses[0];
      let surfaceForm = lexeme['surface-form'];
      let baseForm = sense['base-form'];

      if (surfaceForm['#text']) {
        surfaceForm = surfaceForm['#text'];
        if (surfaceForm instanceof Array) surfaceForm = surfaceForm.join('');
        baseForm = surfaceForm;
      }

      return {
        surfaceForm: surfaceForm,
        baseForm: baseForm,
        partOfSpeech: sense['part-of-speech']['#text'].slice(1)
      }
    });
  });
}

/**
 * Perform a part-of-speech tagging on a text in a given language
 *
 * @param {string} text
 * @param {string} [language]
 * @returns {promise}
 */
module.exports = function posTag(text, language = 'English') {
  return makeRequest(text, language)
    .then(formatResponse)
    .then(data => ({
      text: text,
      language: language,
      sentences: data
    }));
}
