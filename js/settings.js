/* global TrelloPowerUp */

const t = TrelloPowerUp.iframe();

const listSelector = document.getElementById('list');

t.lists('id', 'name')
  .then(function (lists) {
      return t.get('board', 'shared', 'list')
          .then(function (savedList) {
              lists.forEach(function(list) {
                  const opt = document.createElement('option');
                  opt.value = list.id;
                  opt.innerHTML = list.name;
                  opt.selected = savedList.includes(list.id);
                  listSelector.appendChild(opt);
              });
              t.sizeTo('#content')
                  .done();
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
