function dhlUpdateSingle(parcel) {

  var xmlHttp = null;
  xmlHttp = new XMLHttpRequest();
  var url = 'http://nolp.dhl.de/nextt-online-public/set_identcodes.do?' + 'lang=' + 'en' + '&idc=' + parcel['piece_identifier'] + '&rfn=&extendedSearch=true';

  xmlHttp.onreadystatechange=function()
  {
  if (xmlHttp.readyState==4 && xmlHttp.status==200)
    {
      var parser = new DOMParser();
      var doc = parser.parseFromString(xmlHttp.responseText, "text/html");

      try {
        var table = doc.getElementById('collapse-events-' + parcel['piece_identifier'] + '_1');
        var tableRows = table.getElementsByTagName('tbody')[0].children;
        dhlParseRows(tableRows, parcel);
      } catch (e) {
        console.log(e);
        parcel.status = 'parcel not found';
      } finally {
        parcel.directLink = url;
        updateStorage(parcel);
      }
    }
  }
  xmlHttp.open( "GET", url, true );
  xmlHttp.send();
}

function dhlParseRows(r, p) {
  p['events'] = [];
  for (i=0; i<r.length; i++) {
    event = {
      date: r[i].children[0].innerHTML.replace(/(\r\n|\n|\r|\t)/gm,""),
      city: r[i].children[1].innerHTML.replace(/(\r\n|\n|\r|\t)/gm,"") ,
      status: r[i].children[2].innerHTML.replace(/(\r\n|\n|\r|\t)/gm,""),
      img: '../assets/detail_page/elem2sm.png'
    };
    if (i==0) {
      event.img = '../assets/detail_page/elem1sm.png';
    }
    p['delivered'] = dhlIsDelivered(event.status);
    p.events.push(event);
  }
  p.status = event.status;
}

function dhlIsDelivered(stat) {
  return (stat.indexOf('elivered')>=0 || stat.indexOf('ugestellt')>=0);
}