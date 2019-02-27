
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

uploadJpeg();

function uploadJpeg(uploadUrl) {

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
        wait()
    }

}

function drawCanvas(id, src, w, h, top, left) {
    var image = new Image();

    var canvas = document.getElementById(id);
    ctx = canvas.getContext('2d');

    image.src = src;
    image.setAttribute("crossOrigin", 'Anonymous');
    let outfit = w/2

    image.onload = function () {
        console.log(left);
        let imageRect = {
            left: Math.max(0, left-outfit),
            top: Math.max(0, top-outfit),
            width: w+2*outfit,
            height: h+2*outfit
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function wait() {
    console.log('Taking a break...');
    await sleep(2000);
    console.log('Two seconds later');
}

function cropImgToCanvas(img, canvas, rectangle, drawRectangle) {
    ctx = canvas.getContext('2d');
    ctx.drawImage(img,
        rectangle.left, rectangle.top,   // Start at 70/20 pixels from the left and the top of the image (crop),
        rectangle.width, rectangle.height,   // "Get" a `50 * 50` (w * h) area from the source image (crop),
        drawRectangle.left, drawRectangle.top,     // Place the result at 0, 0 in the canvas,
        drawRectangle.width, drawRectangle.height); // With as width / height: 100 * 100 (scale)
}