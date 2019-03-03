
var memberImgsInfo = JSON.parse(localStorage.getItem("memberImgs"));
console.log(memberImgsInfo);

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
var saveJpeg = function(){
    console.log("===== Start upload All Jpeg ==========")
    for (var i = 0; i < memberImgsInfo.length; i++) {

        console.log("===== Uploading Jpeg " +i +" ==========")

        var cvsId="canvas"+i;
        var file_token = "thumb-"+i
        var chainInfo = {
            canvasID:cvsId,
            file_token:file_token
        }

        getImgUploadUrl(chainInfo)
        .then(uploadJpeg)
        .catch( e => {
            console.log(e);
        });

        console.log("===== End Uploading Jpeg " +i +" ==========")

    }

    console.log("===== End upload All Jpeg ==========")    
};

var saveCustomerNote = function(){
    
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

            // // 图片ajax上传
            // var xhr = new XMLHttpRequest();

            // // 开始上传
            // xhr.open("PUT", chainInfo.location, true);
            // xhr.setRequestHeader("content-type", "binary/octet-stream");
            // xhr.send(blob);

            // console.log("===== End upload a Jpeg ==========")
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