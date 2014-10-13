function fedexUpdateSingle(parcel) {
  var url = 'http://www.trackingex.com/fedex-tracking/';

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
      fedexParseRows(city, date, status, parcel);
      } catch (e) {
        console.log(e);
        parcel.status = 'parcel not found';
      } finally {
        updateStorage(parcel);
      }
    }
  }
  console.log('' + url + parcel['piece_identifier']+'.html');
  xmlHttp.open( "POST", '' + url + parcel['piece_identifier']+'.html', true );
  xmlHttp.send();
}

function fedexParseRows(c, d, s, p) {
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