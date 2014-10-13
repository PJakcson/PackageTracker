function dhlUpdateSingle(parcel) {
  var url = 'http://nolp.dhl.de/nextt-online-public/set_identcodes.do?';

  var xmlHttp = null;
  xmlHttp = new XMLHttpRequest();

  xmlHttp.onreadystatechange=function()
  {
  if (xmlHttp.readyState==4 && xmlHttp.status==200)
    {
      var parser = new DOMParser();
      var doc = parser.parseFromString(xmlHttp.responseText, "text/html");

      try {
        var table = doc.getElementById('collapse-events-' + parcel['piece_identifier'] + '_1');
        var tableRows = table.getElementsByTagName('tbody')[0].children;
        parseRows(tableRows, parcel);
      } catch (e) {
        console.log(e);
        parcel.status = 'parcel not found';
      } finally {
        updateStorage(parcel);
      }
    }
  }
  xmlHttp.open( "GET", '' + url + 'lang=' + 'en' + '&idc=' + parcel['piece_identifier'] + '&rfn=&extendedSearch=true', true );
  xmlHttp.send();
}

function parseRows(r, p) {
  p['events'] = [];
  for (i=0; i<r.length; i++) {
    event = {
      date: r[i].children[0].innerHTML.replace(/(\r\n|\n|\r|\t)/gm,""),
      city: r[i].children[1].innerHTML.replace(/(\r\n|\n|\r|\t)/gm,"") ,
      status: r[i].children[2].innerHTML.replace(/(\r\n|\n|\r|\t)/gm,"")
    };
    p.events.push(event);
  }
  if(event.status == 'The shipment has been successfully delivered' ||
    event.status == 'Die Sendung wurde erfolgreich zugestellt.') {
    p.delivered = true;
  }
  p.status = event.status;
}