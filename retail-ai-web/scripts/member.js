
const API_ROOT = "https://2k2foie16m.execute-api.ap-northeast-1.amazonaws.com/v1";
//const API_ROOT = "http://127.0.0.1:8300"

var memberImgsInfo = JSON.parse(localStorage.getItem("memberImgs"));
var faces = []
var mac = ''
var userCloudID = "";
var userFaceID = "";
// var headshotToken = "";
// var origImgToken = "";
var imgPath = {};
var isPhotoChanged = false

console.log(memberImgsInfo);
console.log(JSON.stringify(localStorage))

$(document).ready(function () {

    let urlParams = new URLSearchParams(window.location.search);    
    mac = urlParams.get('mac');
    console.log('mac:'+mac)

    if (urlParams.has('userID')){
        init();
        faces=initData.snapshots
    } else {
        for (let item in memberImgsInfo){
            faces.push(item.imgToken)
        }
    }

    for (var i = 0; i < memberImgsInfo.length; i++) {
        const element = memberImgsInfo[i];
        var cvsId="canvas"+i;
        var html = "<div class='snapshot_wrap' data-picIndex="+i+">" +
        "<canvas id='" + cvsId + "'></canvas>" +
        "<a href='#' class='btn_snapshotDel'>X</a>" +
        "</div>";

        $(".memberInfo_snapshots").append(html);
    }

    if (urlParams.has('userID')){
        init();
        faces=initData.snapshots
        loadFaces()
    } else {
        cropFaces()
    }    
    
    //儲存基本資料
    $(".js-btn-save").click(function () {
        if (true/*urlParams.has('userID')*/) {
            getData(putAjax);
        }else{
            saveJpegNote();
        }
    });

    $(".btn_snapshotDel").click(function () {
        isPhotoChanged=true
    })


    // $(".btn_note").click(function () {
    //     if (urlParams.has('userID')) {
    //         getData(putAjax);
    //     } else {
    //         saveJpegNote();
    //     }
    // });

});

function init() {

    let urlParams = new URLSearchParams(window.location.search);

    userCloudID = urlParams.get('userID');
    userFaceID = urlParams.get('tmpID');
    // headshotToken = urlParams.get('img');
    // origImgToken = urlParams.get('origImgToken');

    // getImgUrl(headshotToken, 'headshotPath', imgPath);
    // getImgUrl(origImgToken, 'origImgPath', imgPath);

    console.log("urlParams:" + urlParams);
    console.log("userCloudID:" + userCloudID);
    console.log("userFaceID:" + userFaceID);
    console.log($(".js-snapshot").attr("src"));
    var url = API_ROOT + "/customer_note?userID=" + userCloudID;

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": "GET",
        "headers": {},
        "processData": false,
        "data": ""
    }
    console.log(settings);
    var initData = {};
    $.ajax(settings).done(function (response) {
        // console.log(response);
        initData = response;
        console.log(initData);

        //put data to html
        $("p.js-userName").attr("data-id", userCloudID);
        $("p.js-userName").text(initData.userName);
        $("input.js-userName").val(initData.userName);
        $(".visitTime span:last-child").text(initData.lastVisitTime);
        // $(".js-snapshot").attr("src", headshotPath);
        // $(".js-snapshot-small").attr("src", headshotPath);
        $("input[name='gender']").each(function () {
            if ($(this).val() == initData.gender) {
                $(this).prop("checked", true);
            }
        });
        $("input[type='date']").val(initData.birthday);
        for (var i = 0; i < initData.favorColor.length; i++) {
            $("input[name='favorColor']").each(function () {
                if ($(this).val() == initData.favorColor[i]) {
                    $(this).prop("checked", true);
                }
            });
        }
        for (var i = 0; i < initData.favor.length; i++) {
            $("input[name='favor']").each(function () {
                if ($(this).val() == initData.favor[i]) {
                    $(this).prop("checked", true);
                }
            });
        }
        $("input[name='dealChance']").each(function () {
            if ($(this).val() == initData.dealChance) {
                $(this).prop("checked", true);
            }
        });
        $("input[name='budget']").each(function () {
            if ($(this).val() == initData.budget) {
                $(this).prop("checked", true);
            }
        });
        $("input[name='career']").each(function () {
            if ($(this).val() == initData.career) {
                $(this).prop("checked", true);
            }
        });
        for (var k = 0; k < initData.notes.length; k++) {
            var html = '<div class="member_note_item js-note">';
            var p1 = '<p>' + initData.notes[k].time + '</p>';
            var p2 = '<p>' + initData.notes[k].note + '</p>';
            html = html + p1 + p2 + '</div>';
            $(".member_note").append(html);
        }

    });

}

function getData(apiCall) {

    let urlParams = new URLSearchParams(window.location.search);

    var data = {
        "userID": "",
        "userName": "",
        "lastVisitTime": "",
        "gender": "",
        "birthday": "",
        "favorColor": [],
        "favor": [],
        "dealChance": "",
        "budget": "",
        "career": "",
        "notes": [],
        "targetFace": ""
    };

    data.targetFace = urlParams.get('top') + "," + urlParams.get('left') + "," + urlParams.get('width') + ',' + urlParams.get('height');
    data.userID = userCloudID;
    data.userName = $("input.js-userName").val();
    data.lastVisitTime = "2018/10/01 11:35";
    data.gender = $("input[name='gender']:checked").val();
    data.birthday = $("input[type='date']").val();
    data.dealChance = $("input[name='dealChance']:checked").val();
    data.budget = $("input[name='budget']:checked").val();
    data.career = $("input[name='career']:checked").val();
    if (userFaceID !== 'undefined') {
        data.faceId = userFaceID;
    }
    $("input[name='favorColor']:checked").each(function () {
        data.favorColor.push($(this).val());
    });
    $("input[name='favor']:checked").each(function () {
        data.favor.push($(this).val());
    });
    $(".js-note").each(function () {
        var memberNote = {
            "time": "",
            "note": ""
        };
        if (userFaceID !== 'undefined') {
            data.faceId = userFaceID;
        }
        memberNote.userFaceID = userFaceID;
        memberNote.time = $(this).find("p:first-child").text();
        memberNote.note = $(this).find("p:last-child").text();

        data.notes.push(memberNote);
    });

    if (isPhotoChanged){
        deleteCustomerNote(userCloudID)
        .then(function(){
            saveJpegNote();
        })
    } else {
        apiCall(data);
    }
};

function putAjax(data) {
    var stringData = JSON.stringify(data);
    console.log(stringData);

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": API_ROOT + "/customer_note", "method": "PUT",
        // "url": "http://127.0.0.1:8300/customer_note",        "method": "PUT",        
        "headers": {
            "content-type": "application/json"
        },
        "processData": false,
        "data": stringData
    };
    // console.log(settings.data);

    $.ajax(settings).done(function (response) {
        console.log(JSON.stringify(response));
        alert("資料更新完成");
    });

}

function deleteCustomerNote(userID, resolve, reject){

    return new Promise(function(resolve, reject){

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": API_ROOT + "/customer_note?userID="+userID + "&mac=" + mac,
             "method": "DELETE",
            // "url": "http://127.0.0.1:8300/customer_note",        "method": "PUT",        
            "headers": {
                "content-type": "application/json"
            },
            "processData": false,
            "data": ""
        };
        console.log('deleteCustomerNote with payload:'+JSON.stringify(settings))

        $.ajax(settings).done(function(response) {
            console.log(JSON.stringify(response));
            resolve('')            
        });

    })
}


//存圖，存 customerNote
var saveJpegNote = function(){

    console.log("===== Start upload All Jpeg ==========")
    var divs = document.getElementsByClassName('snapshot_wrap')

    function myLoop (i) {          
        setTimeout(function () {   

            console.log("  ===== Uploading Jpeg ==========")

            var cvsId="canvas" + divs[i].getAttribute('data-picindex');
            var file_token = genUUID()
            let chainInfo = {
                canvasID:cvsId,
                file_token:file_token
            }
            faces.push(file_token)

            getImgUploadUrl(chainInfo)
            .then(uploadJpeg)
            .catch( e => {
                console.log(e);
            });

            console.log("  ===== End Uploading Jpeg ==========") 
            if (--i) myLoop(i);      //  decrement i and call myLoop again if i > 0

        }, 1000)                   //  pass the number of iterations as an argument
    }

    myLoop(divs.length-1)
    setTimeout(function(){
        postCustomerNote()
    }, 1000*memberImgsInfo.length)

    console.log("===== End upload All Jpeg ==========")    
};


function postCustomerNote() {

        let urlParams = new URLSearchParams(window.location.search);

        var data = {
            "userID": "",
            "userName": "",
            "lastVisitTime": "",
            "snapshots": [],
            "gender": "",
            "birthday": "",
            "favorColor": [],
            "favor": [],
            "dealChance": "",
            "budget": "",
            "career": "",
            "notes": [],
            "targetFace": ""
        };

        data.mac = mac
        data.targetFace = urlParams.get('top') + "," + urlParams.get('left') + "," + urlParams.get('width') + ',' + urlParams.get('height');
        data.userName = $("input.js-userName").val();
        data.lastVisitTime = "2018/10/01 11:35";
        data.snapshots = faces;
        data.gender = $("input[name='gender']:checked").val();
        data.birthday = $("input[type='date']").val();
        data.dealChance = $("input[name='dealChance']:checked").val();
        data.budget = $("input[name='budget']:checked").val();
        data.career = $("input[name='career']:checked").val();
        if (typeof(userFaceID) !== 'undefined') {
            data.faceId = userFaceID;
        }
        $("input[name='favorColor']:checked").each(function () {
            data.favorColor.push($(this).val());
        });
        $("input[name='favor']:checked").each(function () {
            data.favor.push($(this).val());
        });
        $(".js-note").each(function () {
            var memberNote = {
                "time": "",
                "note": ""
            };
            if (userFaceID !== 'undefined') {
                data.faceId = userFaceID;
            }
            memberNote.userFaceID = userFaceID;
            memberNote.time = $(this).find("p:first-child").text();
            memberNote.note = $(this).find("p:last-child").text();
            // memberNote.snapshot = headshotToken;

            data.notes.push(memberNote);
        });

        var stringData = JSON.stringify(data);

        console.log('stringData post:'+stringData)
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": API_ROOT + "/customer_note", "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "processData": false,
            "data": stringData
        };
        // console.log(settings.data);

        $.ajax(settings).done(function (response) {
            console.log(JSON.stringify(response));
            alert("資料更新完成");
        });
}

function cropFaces() {

    console.log("===== cropFaces ==========")

    for (var i = 0; i < memberImgsInfo.length; i++) {
        var id = "canvas" + i;
        var left = memberImgsInfo[i].faceRectangles[0].left;
        var top = memberImgsInfo[i].faceRectangles[0].top;
        var w = memberImgsInfo[i].faceRectangles[0].width;
        var h = memberImgsInfo[i].faceRectangles[0].height;
        var src = "https://di93lo4zawi3i.cloudfront.net/" + memberImgsInfo[i].imgToken;
        drawCanvas(id, src, w, h, top, left);
        console.log(i)
    }

}

function loadFaces() {

    console.log("===== loadFaces ==========")

    for (var i = 0; i < faces.length; i++) {

        var src = "https://di93lo4zawi3i.cloudfront.net/" + faces[i];
        var image = new Image();
        image.setAttribute("crossOrigin", 'Anonymous');
        image.src = src;        

        var id = "canvas" + i;
        var canvas = document.getElementById(id);
        canvas.width=100;
        canvas.height=100;
        ctx = canvas.getContext('2d');


        image.onload = function () {
            ctx.drawImage(img, 0, 0, image.width,    image.height,     // source rectangle
                       0, 0, canvas.width, canvas.height);
            console.log(i)
        }
    }
}

function uploadJpeg(chainInfo, resolve, reject){

    return new Promise(function(resolve, reject){

        console.log("===== Start upload a Jpeg with info:"+ JSON.stringify(chainInfo) + "==========")
         // canvas转为blob并上传
        var canvas = document.getElementById(chainInfo.canvasID)
        var dataURL = canvas.toDataURL('image/jpeg', 0.5);
        var blob = dataURItoBlob(dataURL)

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": chainInfo.location,
            "method": "PUT",
            // "url": "http://127.0.0.1:8300/customer_note",        "method": "PUT",        
            "headers": {
                'content-type': "binary/octet-stream"
            },
            "processData": false,
            "data": blob
        };
        console.log(settings.data);

        $.ajax(settings).complete(function (jqxhr, txt_status) {
            console.log ("Complete: [ " + txt_status + " ] " + JSON.stringify(jqxhr));
            // if (response code is 301) {
            console.log("===== End upload a Jpeg ==========")
            resolve(chainInfo)
        })
    })
}

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

function getImgUploadUrl(chainInfo, resolve, reject) {

    return new Promise(function(resolve, reject){

        console.log("===== getImgUploadUrl ==========")
        let body = {
            file_token: chainInfo.file_token
        }
        let bodyStr = JSON.stringify(body)
        console.log(bodyStr)

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": API_ROOT + "/faceImg?file_token="+chainInfo.file_token,
            "method": "PUT",
            "headers": {
                'content-type': "binary/octet-stream"
            },
            "processData": false,
            "data": bodyStr
        };
        console.log(settings.data);

        $.ajax(settings).complete(function (jqxhr, txt_status) {
            console.log ("Complete: [ " + txt_status + " ] " + JSON.stringify(jqxhr));
            // if (response code is 301) {
            let response = JSON.parse(jqxhr.responseText)
            if (typeof(response.Location)!='undefined'){
                chainInfo.location = response.Location
                console.log("===== end getImgUploadUrl ==========")
                resolve(chainInfo)
            } else {
                console.log("===== end getImgUploadUrl ==========")
                reject('')
            }
        })
    })
}

function drawCanvas(id, src, w, h, top, left) {

    var image = new Image();

    var canvas = document.getElementById(id);
    canvas.width=100;
    canvas.height=100;
    ctx = canvas.getContext('2d');

    image.setAttribute("crossOrigin", 'Anonymous');
    image.src = src;
    let margin = w/2

    image.onload = function () {
        console.log(left);
        let imageRect = {
            left: Math.max(0, left-margin),
            top: Math.max(0, top-margin),
            width: w+2*margin,
            height: h+2*margin
        };
        let canvasRect = {
            left: 0,
            top: 0,
            width: 100,
            height: 100
        };

        cropImgToCanvas(image, canvas, imageRect, canvasRect);
        // ctx.drawImage(image,
        //     70, 20,   // Start at 70/20 pixels from the left and the top of the image (crop),
        //     50, 50,   // "Get" a `50 * 50` (w * h) area from the source image (crop),
        //     0, 0,     // Place the result at 0, 0 in the canvas,
        //     50, 50); // With as width / height: 100 * 100 (scale)
    }
}



function cropImgToCanvas(img, canvas, rectangle, drawRectangle) {
    ctx = canvas.getContext('2d');
    ctx.drawImage(img,
        rectangle.left, rectangle.top,   // Start at 70/20 pixels from the left and the top of the image (crop),
        rectangle.width, rectangle.height,   // "Get" a `50 * 50` (w * h) area from the source image (crop),
        drawRectangle.left, drawRectangle.top,     // Place the result at 0, 0 in the canvas,
        drawRectangle.width, drawRectangle.height); // With as width / height: 100 * 100 (scale)

    console.log('===== done draw image =========')
}

var genUUID = function() {
  var d = Date.now();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}