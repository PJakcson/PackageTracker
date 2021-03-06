//////////////////// ADD-OVERLAY ////////////////////////////////////////////
Polymer('add-overlay', {
  selected: "dhl",
  label: '',
  uid: '',
  headericon: "assets/dhl.jpg",
  created: function() {
    this.addEventListener("keypress", function() {
    if (event.keyCode == 13) console.log('enter');

    });
  },
  itemSelected: function(e, detail) {
      this.headericon = 'assets/' + this.selected + '.jpg';
  },
  confirm: function() {
    this.fire('add', {uid: this.uid, service: this.selected, label: this.label});
    this.uid = '';
    this.label = '';
    this.selected = 'dhl';
  },
  keypressHandler: function(event, detail, sender) {
      if(event.keyCode==13 || event.keyCode==19){
        this.confirm();
        this.opened=false;
        }
  },
  open: function() {
    this.opened = true;

  },
  uidChanged: function() {
    //if (this.uid.length <= 12) this.selected = 'dhl';
    //if (this.uid.length > 12) this.selected = 'hermes';
  }
});

//////////////////// DETAIL-OVERLAY ////////////////////////////////////////////
Polymer('detail-overlay', {
  open: function(uid) {
    this.toggle();
    detailSetParcel(this, uid);
  },
  openlink: function() {
    window.open(this.parcel.directLink);
  },
  resizeHandler: function() {
  },
});

function detailSetParcel(detailCard, uid) {
  chrome.storage.sync.get(uid, function(p) {
    detailCard.parcel = p[uid];

    //var hd = detailCard.$.header;
    //if (hd.children.length > 1) hd.removeChild(hd.children[1]);
    var sp = detailCard.$.h_number;
    sp.setAttribute('id', 'h_uid');
    //window.open('http://google.com');
    if (p[uid].label.search(p[uid].piece_identifier) < 0) {
      sp.innerHTML = '(Tracking #: ' + p[uid].piece_identifier + ')';
      //hd.appendChild(sp);
    } else {
      sp.innerHTML = 'directlink';
    }
    createTable(detailCard);
    });
}

function createTable(detailCard) {

  var events = detailCard.parcel.events.reverse();
  var table = detailCard.$.table;

  while (table.children[1]) {
    table.removeChild(table.children[1]);
  }

  var tr = document.createElement('tr');
  tr.appendChild(document.createElement('th'));
  tr.appendChild(document.createElement('th'));
  tr.appendChild(document.createElement('th'));
  tr.appendChild(document.createElement('th'));

  for (e in events) {
    var tr = document.createElement('tr');
    var picRes = '../assets/detail_page/elem2sm.png';

    if (e == events.length-1) picRes = '../assets/detail_page/elem1sm.png';
    if (e==0 && detailCard.parcel.delivered) picRes = '../assets/detail_page/elem3sm.png';


    var pic = document.createElement('td');
    pic.setAttribute('class', 'pic');
    var img = document.createElement('img');
    img.setAttribute('src', picRes);
    img.setAttribute('class', (e!=events.length-1)? 'normalImg' : 'lastImg');
    pic.appendChild(img);

    var date = document.createElement('td');
    date.setAttribute('class', 'date');
    date.innerHTML = events[e].date;

    var status = document.createElement('td');
    status.setAttribute('class', 'status');
    status.innerHTML = events[e].status;

    var city = document.createElement('td');
    city.setAttribute('class', 'city');
    city.innerHTML = events[e].city;

    tr.appendChild(pic);
    tr.appendChild(date);
    tr.appendChild(status);
    tr.appendChild(city);

    table.appendChild(tr);
  }
}

//////////////////// DHL-LIST ////////////////////////////////////////////
(function() {
Polymer('dhl-list', {
  showChanged: function() {
    updateList(this, this.show);
  },
  created: function() {
    updateList(this, this.show);
  },
  update: function() {
    updateList(this, this.show);
  },
  updateItem: function(p) {
    this.fire('update', {parcel: p});
  }
});

function updateList(list, show) {
  switch (show) {
    case 'all': getAllPackages(list); break;
    case 'received': getReceivedPackages(list); break;
    case 'underway': getUnderwayPackages(list); break;
    case 'trash': getDeletedPackages(list); break;
  }
}

function getAllPackages(list) {
    chrome.storage.sync.get(null, function(p) {
      var num_array = new Array();
      for (var items in p){
        if (!p[items]['trash']) num_array.push(p[items]);
      }
      list.packages = num_array.sort(compare);
    });
}

function getReceivedPackages(list) {
    chrome.storage.sync.get(null, function(p) {
      var num_array = new Array();
      for (var items in p){
        if (p[items]['delivered'] && !p[items]['trash']) num_array.push(p[items]);
      }
      list.packages = num_array.sort(compare);
    });
}

function getUnderwayPackages(list) {
    chrome.storage.sync.get(null, function(p) {
      var num_array = new Array();
      for (var items in p){
        if (!p[items]['delivered']  && !p[items]['trash']) num_array.push(p[items]);
      }
      list.packages = num_array.sort(compare);
    });
  }

function getDeletedPackages(list) {
    chrome.storage.sync.get(null, function(p) {
      var num_array = new Array();
      for (var items in p){
        if (p[items]['trash']) num_array.push(p[items]);
      }
      list.packages = num_array.sort(compare);
    });
  }

function compare(a,b) {
  if (a['timeAdded'] < b['timeAdded'])
     return -1;
  if (a['timeAdded'] > b['timeAdded'])
    return 1;
  return 0;
}

  })
();

//////////////////// DHL-CARD ////////////////////////////////////////////
Polymer('dhl-card', {
  created: function(){
    //
    this.raise = 1;
  },
  domReady: function(){
    if (this.label == '') {
      this.querySelector('h2').innerHTML =
        'Package No.' + this.parcel['label'];
    }
  },
  onHover: function(){this.raise = 3;},
  onOut: function(){this.raise = 1;},
  downAction: function(e) {
    this.$.ripple.downAction({x: e.x, y: e.y});
  },
  upAction: function(e) {
    this.$.ripple.upAction();
  },
  packageClick: function(e, detail) {
    var detail_overlay = document.querySelector('detail-overlay');
    detail_overlay.open(this.parcel['piece_identifier']);
  },
  edit: function(e, detail) {
    var list = document.querySelector('dhl-list');
    list.fire('editParcel', {action: 'update', parcel: this.parcel});
  },
  refresh: function(e, detail) {
    var list = document.querySelector('dhl-list');
    list.fire('editParcel', {action: 'update', parcel: this.parcel});
  },
  clear: function(e, detail) {
    var list = document.querySelector('dhl-list');
    if (!this.parcel['trash']) {
      list.fire('editParcel', {action: 'trash',parcel: this.parcel});
    }
    else
      list.fire('editParcel', {action: 'delete',parcel: this.parcel});
  }
});

