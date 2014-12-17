
function hermesUpdateSingle(parcel) {
  var url = 'https://www.myhermes.de/wps/portal/paket/SISYR?auftragsNummer=' + parcel['piece_identifier'];

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
        parcel.directLink = url;
        updateStorage(parcel);
      }
    }
  }
  xmlHttp.open( "POST", url, true );
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
  p['delivered'] = hermesIsDelivered(event.status);
  p['status'] = event['status'];
}

function hermesIsDelivered(stat) {
  return (stat.indexOf('elivered')>=0 || stat.indexOf('ugestellt')>=0);
}