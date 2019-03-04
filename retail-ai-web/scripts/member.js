
const FACE_TOKEN_ROOT = "faces/"
const API_ROOT = "https://2k2foie16m.execute-api.ap-northeast-1.amazonaws.com/v1";
//const API_ROOT = "http://127.0.0.1:8300"

var memberImgsInfo = JSON.parse(localStorage.getItem("memberImgs"));
var faces = []
var mac = ''

console.log(memberImgsInfo);
console.log(JSON.stringify(localStorage))

$(document).ready(function () {

    let urlParams = new URLSearchParams(window.location.search);    
    mac = urlParams.get('mac');
    console.log('mac:'+mac)

})

//儲存基本資料
$(".btn_note").click(function () {
    saveJpegNote();
});

for (var i = 0; i < memberImgsInfo.length; i++) {
    const element = memberImgsInfo[i];
    var cvsId="canvas"+i;
    var html = "<div class='snapshot_wrap'>" +
                    "<canvas id='" + cvsId + "'></canvas>" +
                    "<a href='#' class='btn_snapshotDel'>X</a>" +
                "</div>";
                
    $(".memberInfo_snapshots").append(html);
}

loadJpeg();

//在snapshot畫出臉部方框
var saveJpegNote = function(){
    console.log("===== Start upload All Jpeg ==========")
    for (var i = 0; i < memberImgsInfo.length; i++) {

        console.log("===== Uploading Jpeg " +i +" ==========")

        var cvsId="canvas"+i;
        var file_token = FACE_TOKEN_ROOT+genUUID()
        var chainInfo = {
            canvasID:cvsId,
            file_token:file_token
        }
        faces.push(file_token)

        getImgUploadUrl(chainInfo)
        .then(uploadJpeg)
        .catch( e => {
            console.log(e);
        });

        console.log("===== End Uploading Jpeg " +i +" ==========")
    }

    setTimeout(function(){
        postCustomerNote()
    }, 3000)

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
            memberNote.snapshot = headshotToken;

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
            resolve('')
        });
}

function loadJpeg(uploadUrl) {

    console.log("===== uploadJpeg ==========")
    console.log("upload to url:" + uploadUrl)

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
            "url": "http://localhost:8300/faceImg?file_token="+chainInfo.file_token,
            "method": "PUT",
            // "url": "http://127.0.0.1:8300/customer_note",        "method": "PUT",        
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