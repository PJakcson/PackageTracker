var title = document.getElementById('title');
var container = document.getElementById('container');
var add_overlay = document.querySelector('add-overlay');
var list = document.querySelector('dhl-list');

var menu = document.querySelector('core-menu');
menu.addEventListener('core-select', function(e) {
    title.innerHTML = e.detail.item.label;
    list.show = e.detail.item.id;
    container.style.display = "block";
  });

window.onload = updateAll();

var add = document.querySelector('paper-fab');
add.addEventListener('click', function(e) {
    add_overlay.open();
  });

add_overlay.addEventListener('add', function(e) {
    addNewPackage(e.detail.service, e.detail.uid, e.detail.label);
  });

list.addEventListener('editParcel', function(e) {
    switch (e.detail.action) {
      case 'update': update(e.detail.parcel); break;
      case 'delete': deleteParcel(e.detail.parcel); break;
    }
  });

var refresh = document.querySelector('paper-icon-button');
//refresh.addEventListener('click', function(e) {
//    updateAll();
//    chrome.storage.sync.clear();
//  });

chrome.storage.onChanged.addListener(function(changes, namespace) {
  console.log(changes);
  chrome.storage.sync.getBytesInUse('packages', function(b) {

  });
  console.log('Change! Change!');
  list.update();
});

function addNewPackage(service, uid, label) {
  var parcel = genericParcel(service, uid, label);
    console.log(parcel['label']);
  addPackageToStorage(parcel);
}

function update(parcel) {
    if (parcel['delivered']) return;
    switch (parcel['service']) {
      case 'dhl':
        dhlUpdateSingle(parcel);
        break;
      case 'hermes':
        hermesUpdateSingle(parcel);
        break;
      case 'ups':
        upsUpdateSingle(parcel);
        break;
      case 'fedex':
        fedexUpdateSingle(parcel);
        break;
  }
}

function updateAll() {
  chrome.storage.sync.get(null, function(p) {
    for (parcel in p) {
      update(p[parcel]);
    }
  });
}

function addPackageToStorage(parcel) {
  var obj = {};
  var name = parcel['piece_identifier'];
  obj[name] = parcel;
  chrome.storage.sync.set(obj, function() {
    console.log('neues Paket hinzugefügt');
  });
}

function updateStorage(parcelNew) {
  var obj = {};
  var name = parcelNew['piece_identifier'];
  obj[name] = parcelNew;
  chrome.storage.sync.set(obj, function() {
    console.log('Paket upgedatet');
  });
}

function genericParcel(service, uid, label) {
  if (label == '') label = 'Package No.: ' + uid;
  var parcel = {piece_identifier: uid, language: 'en', events: [],
          service: service, logo: 'assets/' + service +'.jpg', status: '',
          delivered: false, label: label, timeAdded: new Date().getTime()
          };
          console.log(parcel);
  return parcel;
}

function deleteParcel(parcel) {
  var obj = {};
  var name = parcel['piece_identifier'];
  obj[name] = null;
  chrome.storage.sync.remove(parcel['piece_identifier']);
}

