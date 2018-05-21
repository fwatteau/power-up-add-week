/* global TrelloPowerUp */

const t = TrelloPowerUp.iframe();

const listSelector = document.getElementById('list');
const dejListSelector = document.getElementById('list-dej');

t.lists('id', 'name')
  .then(function (lists) {
      return Promise.all([
          t.get('board', 'shared', 'list', []),
          t.get('board', 'shared', 'dej-list', false)
      ]).then(function (context) {
          const savedLists = context[0];
          const dejList = context[1];
          lists.forEach(function(list) {
              const opt = document.createElement('option');
              opt.value = list.id;
              opt.innerHTML = list.name;
              opt.selected = savedLists.includes(list.id);
              listSelector.appendChild(opt);
              const newOpt = opt.cloneNode(true);
              newOpt.selected = (dejList === list.id);
              dejListSelector.appendChild(newOpt);
          });
          t.sizeTo('#content')
              .done();
          });
  });

document.getElementById('save').addEventListener('click', function(){
  const values = [...listSelector.options].filter(option => option.selected).map(option => option.value);
  if (dejListSelector.selectedIndex) {
      const selectedList = dejListSelector.options[dejListSelector.selectedIndex];
      t.set('board', 'shared', 'dej-list', selectedList.value);
  } else {
      t.remove('board', 'shared', 'dej-list');
  }

  return t.set('board', 'shared', 'list', values)
    .then(function(){
      t.closePopup();
    })
});
