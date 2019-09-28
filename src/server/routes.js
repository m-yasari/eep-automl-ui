const dal = require('./dal.js');
const fetch = require('node-fetch');
const translateApi = require('@google-cloud/translate').Translate;

const DEFAULT_PRIORITY = 'Medium';
const SECOND_LANGUAGE = 'fr';
const PROJECT_ID = 'projectID';
const API_KEY = 'AIzaSyBssxoui3ZQoblvJNNi5pKyQuUFAUIZtT8';
const GOOGLE_TRANSLATE_ENDPOINT = 'https://translation.googleapis.com/language/translate/v2';

const getPriority = priority => {
    priority = priority || DEFAULT_PRIORITY;
    switch(priority.toLowerCase()) {
        case 'medium':
            return 'Medium';
        case 'low':
            return 'Low';
        case 'high':
            return 'High';
    }
};

const translate = (text) => (
    new Promise((resolve, reject) => {
        const translate = new translateApi({ projectId: PROJECT_ID });

        translate.translate(text, SECOND_LANGUAGE).then(results => {
            const translation = results[0];

            console.log(`Text: ${text}`);
            console.log(`Translation: ${translation}`);
            resolve(translation);
        }).catch(err => {
            console.error(`Translation error: ${err}`);
            reject(err);
        });
    })
);

const translate2 = (text) => (
    new Promise((resolve, reject) => {
        const reqBody = {
            q: [text],
            target: SECOND_LANGUAGE,
            source: 'en'
        };

        fetch(`${GOOGLE_TRANSLATE_ENDPOINT}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reqBody)
        })
        .then(results=> results.json())
        .then(results => {
            const translation = results.data.translations[0].translatedText;

            console.log(`Text: ${text}`);
            console.log(`Translation: ${translation}`);
            resolve(translation);
        })
        .catch(err => {
            console.error(`Translation error: ${err}`);
            reject(err);
        });
    })
);

const errResponse = (res, err) => {
    res.status(400).json({ result: 'failed', error: err });
};

const successResponse = (res, data) => {
    const respBody = { result: 'success' };
    if (data) {
        respBody.data = data;
    }
    res.send(respBody);
};

const appRouter = app => {
    app.get('/todo/:user', (req, res) => {
        try {
            dal.retrieve( { user: req.params.user }, todoItems => {
                successResponse(res, todoItems);
            });
        } catch(err) {
            console.log(err);
            errResponse(res, err);
        }
    });

    app.post('/todo/:user', (req, res) => {
        if (req.body.text) {
            translate2(req.body.text).then( translation => {
                const todoItem = {
                    text: req.body.text,
                    text2: translation,
                    status: 'open',
                    user: req.params.user,
                    priority: getPriority(req.body.priority)
                };
                try {
                    dal.insert(todoItem, () => {
                        console.log(`Added todo for ${req.params.user}: `, todoItem);
                        successResponse(res);
                    });
                } catch(err) {
                    console.log('Error in insertion: ', err);
                    errResponse(res, err);
                }
            }).catch(err => {
                console.log('Translation failed: ', err);
                errResponse(res, err);
            })
        } else {
            errResponse(res, '"text" fields is mandatory for to-do item.');
        }
    });

    app.put('/todo/:user/:id', (req, res) => {
        try{
            const id = dal.ObjectID(req.params.id);
            dal.update({ user: req.params.user, _id: id}, { status: 'done' }, () => {
                successResponse(res);
            });
        } catch(err) {
            console.log(err);
            errResponse(res, err);
        }
    });
};

module.exports = appRouter;
