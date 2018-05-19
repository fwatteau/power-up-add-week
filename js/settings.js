/* global TrelloPowerUp */

const Promise = TrelloPowerUp.Promise;
const t = TrelloPowerUp.iframe();

const listSelector = document.getElementById('list');

t.lists('all')
  .then(function (lists) {
      console.log(JSON.stringify(lists, null, 2));
      t.render(function () {
          return Promise.all([
              t.get('board', 'shared', 'list')
          ])
              .spread(function (savedList) {
                  if (savedList) {
                      listSelector.value = savedList;
                  }
              })
              .then(function () {
                  t.sizeTo('#content')
                      .done();
              })
      });
  });

document.getElementById('save').addEventListener('click', function(){
  return t.set('board', 'shared', 'list', listSelector.value)
    .then(function(){
      t.closePopup();
    })
});
