/* global TrelloPowerUp */

// we can access Bluebird Promises as follows
// var Promise = TrelloPowerUp.Promise;
// const t = TrelloPowerUp.iframe();
/*

Trello Data Access

The following methods show all allowed fields, you only need to include those you want.
They all return promises that resolve to an object with the requested fields.

Get information about the current board
t.board('id', 'name', 'url', 'shortLink', 'members')

Get information about the current list (only available when a specific list is in context)
So for example available inside 'attachment-sections' or 'card-badges' but not 'show-settings' or 'board-buttons'
t.list('id', 'name', 'cards')

Get information about all open lists on the current board
t.lists('id', 'name', 'cards')

Get information about the current card (only available when a specific card is in context)
So for example available inside 'attachment-sections' or 'card-badges' but not 'show-settings' or 'board-buttons'
t.card('id', 'name', 'desc', 'due', 'closed', 'cover', 'attachments', 'members', 'labels', 'url', 'shortLink', 'idList')

Get information about all open cards on the current board
t.cards('id', 'name', 'desc', 'due', 'closed', 'cover', 'attachments', 'members', 'labels', 'url', 'shortLink', 'idList')

Get information about the current active Trello member
t.member('id', 'fullName', 'username')

For access to the rest of Trello's data, you'll need to use the RESTful API. This will require you to ask the
user to authorize your Power-Up to access Trello on their behalf. We've included an example of how to
do this in the `🔑 Authorization Capabilities 🗝` section at the bottom.

*/

/*

Storing/Retrieving Your Own Data

Your Power-Up is afforded 4096 chars of space per scope/visibility
The following methods return Promises.

Storing data follows the format: t.set('scope', 'visibility', 'key', 'value')
With the scopes, you can only store data at the 'card' scope when a card is in scope
So for example in the context of 'card-badges' or 'attachment-sections', but not 'board-badges' or 'show-settings'
Also keep in mind storing at the 'organization' scope will only work if the active user is a member of the team

Information that is private to the current user, such as tokens should be stored using 'private' at the 'member' scope

t.set('organization', 'private', 'key', 'value');
t.set('board', 'private', 'key', 'value');
t.set('card', 'private', 'key', 'value');
t.set('member', 'private', 'key', 'value');

Information that should be available to all users of the Power-Up should be stored as 'shared'

t.set('organization', 'shared', 'key', 'value');
t.set('board', 'shared', 'key', 'value');
t.set('card', 'shared', 'key', 'value');
t.set('member', 'shared', 'key', 'value');

If you want to set multiple keys at once you can do that like so

t.set('board', 'shared', { key: value, extra: extraValue });

Reading back your data is as simple as

t.get('organization', 'shared', 'key');

Or want all in scope data at once?

t.getAll();

*/

const CALENDAR_ICON = './images/icon-calendar.svg';
const GO_ICON = 'https://butlerfortrello.com/powerup/1526409456/img/powerup-gray/thumbs-up.svg?color=999';

let arr2 = [];

const cardButtonOneWeekCallback = function (t, opts) {
    cardButtonCallback(t, opts, 1);
};

const cardButtonOneMonthCallback = function (t, opts) {
    cardButtonCallback(t, opts, 4);
};

const cardButtonCallback = function (t, opts, weekNumber) {
    const nextFriday = moment().day(5 + weekNumber * 7).hour(9).minute(0);

    t.card('id')
        .then(function (card) {
            t.get('member', 'private', 'token')
                .then(function (token) {
                    const xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
                    xmlhttp.open("PUT", 'https://trello.com/1/cards/' + card.id);
                    xmlhttp.setRequestHeader("Content-Type", "application/json");
                    xmlhttp.send(JSON.stringify({
                        token: token,
                        due: nextFriday.valueOf(),
                        key: TRELLO_API_KEY
                    }));
                    // Store nb moov
                    t.get(card.id, 'shared', 'mel-moov', 0)
                        .then(function(moov) {
                            t.set(card.id, 'shared', 'mel-moov', moov + 1);
                        });
                });
        });

    return true;
};

const cardButtonMoovCallback = function (t, opts) {
    console.log(t.list('id', 'name'), t.card('id', 'name'));
};
/*
t.get('board', 'shared', 'list', [])
    .then(function (savedList) {
        savedList.forEach(function (list) {
            arr2.push({
                icon: GO_ICON, // don't use a colored icon here
                text: 'Moov',
                callback: cardButtonMoovCallback,
                list: list
            });
        });
});*/

// We need to call initialize to get all of our capability handles set up and registered with Trello
TrelloPowerUp.initialize({
    'card-buttons': function (t) {
        let arr1 = [{
            // usually you will provide a callback function to be run on button click
            // we recommend that you use a popup on click generally
            icon: CALENDAR_ICON, // don't use a colored icon here
            text: '+1 semaine',
            callback: cardButtonOneWeekCallback
        }, {
            // usually you will provide a callback function to be run on button click
            // we recommend that you use a popup on click generally
            icon: CALENDAR_ICON, // don't use a colored icon here
            text: '+1 mois',
            callback: cardButtonOneMonthCallback
        }];

        return t.get('board', 'shared', 'list', [])
            .then(function (savedList) {
                console.log(t.list('id', 'name'));
                savedList.forEach(function (list) {
                    arr1.push({
                        icon: GO_ICON, // don't use a colored icon here
                        text: 'Moov',
                        callback: cardButtonMoovCallback,
                        list: list
                    });
                });
                return arr1;
            });
    },
    'show-settings': function(t){
        // when a user clicks the gear icon by your Power-Up in the Power-Ups menu
        // what should Trello show. We highly recommend the popup in this case as
        // it is the least disruptive, and fits in well with the rest of Trello's UX
        return t.popup({
            title: 'Settings',
            url: './settings.html',
            height: 184 // we can always resize later, but if we know the size in advance, its good to tell Trello
        });
    },
    'card-detail-badges': function (t, opts) {
        return t.card('id')
            .then(function(card){
                return t.get(card.id, 'shared', 'mel-moov', 0)
                    .then(function(nbRepeat) {
                        let color = 'red';
                        if (nbRepeat  === 0) {
                            return [];
                        } else if (nbRepeat < 4) {
                            color = 'green';
                        } else if (nbRepeat < 8) {
                            color = 'orange';
                        }
                        return [{
                            // its best to use static badges unless you need your badges
                            // to refresh you can mix and match between static and dynamic
                            title: 'Nb report',
                            text: context[0],
                            color: color
                        }];
                    })
            });
    },
    /*

        🔑 Authorization Capabiltiies 🗝

        The following two capabilities should be used together to determine:
        1. whether a user is appropriately authorized
        2. what to do when a user isn't completely authorized

    */
    'authorization-status': function(t){
        // Return a promise that resolves to an object with a boolean property 'authorized' of true or false
        // The boolean value determines whether your Power-Up considers the user to be authorized or not.

        // When the value is false, Trello will show the user an "Authorize Account" options when
        // they click on the Power-Up's gear icon in the settings. The 'show-authorization' capability
        // below determines what should happen when the user clicks "Authorize Account"

        // For instance, if your Power-Up requires a token to be set for the member you could do the following:
        return t.get('member', 'private', 'token')
            .then(function(token){
                if(token){
                    return { authorized: true };
                }
                return { authorized: false };
            });
        // You can also return the object synchronously if you know the answer synchronously.
    },
    'show-authorization': function(t){
        // Returns what to do when a user clicks the 'Authorize Account' link from the Power-Up gear icon
        // which shows when 'authorization-status' returns { authorized: false }.

        // If we want to ask the user to authorize our Power-Up to make full use of the Trello API
        // you'll need to add your API from trello.com/app-key below:
        const trelloAPIKey = TRELLO_API_KEY;

        // This key will be used to generate a token that you can pass along with the API key to Trello's
        // RESTful API. Using the key/token pair, you can make requests on behalf of the authorized user.

        // In this case we'll open a popup to kick off the authorization flow.
        if (trelloAPIKey) {
            return t.popup({
                title: 'My Auth Popup',
                args: { apiKey: trelloAPIKey }, // Pass in API key to the iframe
                url: './authorize.html', // Check out public/authorize.html to see how to ask a user to auth
                height: 140,
            });
        } else {
            console.log("🙈 Looks like you need to add your API key to the project!");
            window.alert("🙈 Il faut autoriser le power up a utiliser ton compte ! (Va dans les paramètres)")
        }
    }
});
console.log('Loaded by: ' + document.referrer);