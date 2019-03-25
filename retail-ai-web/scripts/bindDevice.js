
// const API_ROOT = "https://2k2foie16m.execute-api.ap-northeast-1.amazonaws.com/v1"
const API_ROOT = "http://localhost:8300"


$(document).ready(function () {

  var urlParams = new URLSearchParams(window.location.search);    
  var pushID = urlParams.get('pushID');

  // Send Button Handler
  $(".js-btn_send").click(function () {

    var mac = $('.js-serial').val();
    $(".waitMore").addClass("active");
    bindDevice(mac, pushID);

  });
});

function bindDevice(mac, pushID) {

  var body = {
    mac: mac,
    pushID: pushID
  };

  var settings = {
      "async": true,
      "crossDomain": true,
      "url": API_ROOT + "/bindDevice", "method": "PUT",
      // "url": "http://127.0.0.1:8300/customer_note",        "method": "PUT",        
      "headers": {
          "content-type": "application/json"
      },
      "processData": false,
      "data": JSON.stringify(body)
  };
  // console.log(settings.data);

  $.ajax(settings).done(function (response) {
      $(".waitMore").removeClass("active");        
      console.log(JSON.stringify(response));
      alert("綁定完成");
  });

}