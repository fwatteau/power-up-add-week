/* global TrelloPowerUp */

const Promise = TrelloPowerUp.Promise;
const t = TrelloPowerUp.iframe();

const listSelector = document.getElementById('list');

t.lists('id', 'name')
  .then(function (lists) {
      lists.forEach(function(list) {
          const opt = document.createElement('option');
          opt.value = list.id;
          opt.innerHTML = list.name;
          listSelector.appendChild(opt);
      });
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
  const values = [...listSelector.options].filter(option => option.selected).map(option => option.value);
  console.log(values, 'saved');
  return t.set('board', 'shared', 'list', values)
    .then(function(){
      t.closePopup();
    })
});
