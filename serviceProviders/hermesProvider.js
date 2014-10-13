
function hermesUpdateSingle(parcel) {
  var url = 'https://www.myhermes.de/wps/portal/paket/SISYR?';

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
        var table = doc.getElementsByClassName('content_table table_shipmentDetails');
        var tableRows = table[0].getElementsByTagName('tbody')[0].children;

        hermesParseRows(tableRows, parcel);
      } catch (e) {
        console.log(e);
        parcel.status = 'parcel not found';
      } finally {
        updateStorage(parcel);
      }
    }
  }
  xmlHttp.open( "POST", '' + url + 'auftragsNummer=' + parcel['piece_identifier'], true );
  xmlHttp.send();
}

function hermesParseRows(r, p) {
  p['events'] = [];
  for (i=r.length-1; i>=0; i--) {
    event = {
      date: r[i].children[0].innerHTML.replace(/(\r\n|\n|\r|\t)/gm,"") + ' '
          + r[i].children[1].innerHTML.replace(/(\r\n|\n|\r|\t)/gm,""),
      city:  '',
      status: r[i].children[2].innerHTML.replace(/(\r\n|\n|\r|\t)/gm,"")
    };
    p['events'].push(event);
  }
  console.log(event['status']);
  if(event['status'] == 'Die Sendung wurde zugestellt. ' ||
    event['status'] == 'The shipment has been successfully delivered') {
    p['delivered'] = true;
    console.log('geliefert');
  }
  p['status'] = event['status'];
}