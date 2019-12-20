
let customerArrive = () => {

  let urlStr = "https://2k2foie16m.execute-api.ap-northeast-1.amazonaws.com/v1/storeWatch";
  let body = JSON.stringify({"eventType":"visitor_arrive"});

  console.log('url:'+urlStr);


  var settings = {
      "async": true,
      "crossDomain": true,
      "url": urlStr,
      "method": "POST",
      "headers": {
          "content-type": "application/json"
          // "cache-control": "no-cache"
      },
      "processData": false,
      "data": body
  }


  $.ajax(settings).done(function (response) {

      var data=response;
      console.log(data);
      callback(data);
  });

};

let customerWatch = () => {

  let urlStr = "https://2k2foie16m.execute-api.ap-northeast-1.amazonaws.com/v1/storeWatch";
  let body = JSON.stringify({"eventType":"visitor_watch"});

  console.log('url:'+urlStr);


  var settings = {
      "async": true,
      "crossDomain": true,
      "url": urlStr,
      "method": "POST",
      "headers": {
          "content-type": "application/json"
          // "cache-control": "no-cache"
      },
      "processData": false,
      "data": body
  }


  $.ajax(settings).done(function (response) {

      var data=response;
      console.log(data);
      callback(data);
  });

};