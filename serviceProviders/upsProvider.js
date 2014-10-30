function upsUpdateSingle(parcel) {
  var url = 'http://wwwapps.ups.com/ietracking/tracking.cgi?tracknum=' + parcel['piece_identifier'];

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
        var table = doc.getElementsByClassName('dataTable');
        var tableRows = table[0].getElementsByClassName('odd')[0].children;
        upsParseRows(tableRows, parcel);
      } catch (e) {
        console.log(e);
        parcel.status = 'parcel not found';
      } finally {
        parcel.directLink = url;
        updateStorage(parcel);
      }
    }
  }
  xmlHttp.open( "POST", url, true );
  xmlHttp.send();
}

function upsParseRows(r, p) {
  event = {
      date: r[1].innerHTML.replace(/(\r\n|\n|\r|\t)/gm,"") + ' '
          + r[2].innerHTML.replace(/(\r\n|\n|\r|\t)/gm,""),
      city:  r[0].innerHTML.replace(/(\r\n|\n|\r|\t)/gm,""),
      status: r[3].innerHTML.replace(/(\r\n|\n|\r|\t)/gm,"")
    };
  if (p.status != event.status)  p['events'].push(event);
  if(event['status'] == 'Delivered' ||
    event['status'] == 'The shipment has been successfully delivered') {
    p['delivered'] = true;
    console.log('geliefert');
  }
  p['status'] = event['status'];
}