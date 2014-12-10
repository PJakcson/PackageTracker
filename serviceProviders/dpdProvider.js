function dpdUpdateSingle(parcel) {
  var url = 'http://www.trackingex.com/dpd-tracking/' + parcel['piece_identifier'] + '.html';

  var xmlHttp = null;
  xmlHttp = new XMLHttpRequest();

  xmlHttp.onreadystatechange=function()
  {
  if (xmlHttp.readyState==4 && xmlHttp.status==200)
    {
      var parser = new DOMParser();
      //var doc = parser.parseFromString(xmlHttp.responseText, "text/html");
      var doc = parser.parseFromString(xmlHttp.responseText, "text/html");
      try {
        var city = doc.getElementsByClassName('lititle');
        var date = doc.getElementsByClassName('litime');
        var status = doc.getElementsByClassName('liADD');
        dpdParseRows(city, date, status, parcel);
      } catch (e) {
        console.log(e);
        parcel.status = 'parcel not found';
      } finally {
        parcel.directLink = 'https://tracking.dpd.de/parcelstatus?query=' + parcel.piece_identifier + '&locale=de_DE';
        updateStorage(parcel);
      }
    }
  }
  xmlHttp.open( "POST", url, true );
  xmlHttp.send();
}

function dpdParseRows(c, d, s, p) {
  p['events'] = [];
  for (i=c.length-1; i>=0; i--) {
    event = {
      date: d[i].innerHTML,
      city: c[i].innerHTML,
      status: s[i].innerHTML
    };
    p['events'].push(event);
  }
  console.log(event['status']);
  if(event['status'] == 'Delivered' ||
    event['status'] == 'The shipment has been successfully delivered') {
    p['delivered'] = true;
    console.log('geliefert');
  }
  p['status'] = event['status'];
}