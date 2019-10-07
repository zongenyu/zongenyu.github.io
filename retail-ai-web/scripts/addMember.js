const IMG_ROOT = "https://di93lo4zawi3i.cloudfront.net"
const milliSecondPerDay=86400000;
const FACE_EVENT_URL = "https://2k2foie16m.execute-api.ap-northeast-1.amazonaws.com/v1/face_event?mac=";
var startTime = -1;
var endTime = -1;
var mac = ''
var imgWidth=1280
var imgHeight=720
    

$(document).ready(function () {

    let urlParams = new URLSearchParams(window.location.search);    
    mac = urlParams.get('mac');


    var now = new Date();
    let startTimeStr = urlParams.get('startTime');
    let endTimeStr = urlParams.get('endTime');
    startTime = parseInt(startTimeStr);
    endTime = parseInt(endTimeStr);
    let startOfDay = now;
    console.log('startTime:'+startTime);

    if (isNaN(startTime) && isNaN(endTime)) {
        startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        console.log("start of today:"+startOfDay);
        startTime = startOfDay.getTime();
        endTime = startTime+milliSecondPerDay;
    } else {
        let currentDate = new Date(startTime/1000);
        startOfDay = new Date(startTime)
    }

    let dateText = startOfDay.getFullYear() + " 年 " + startOfDay.getMonth() + " 月 " + startOfDay.getDate() + " 日";
    $(".docTitle").text(dateText);    


    getFaceEvents(mac, {startTime: startTime, endTime: endTime}, (retList) => {

        console.log(retList);
        drawHtml(retList);
    });

})

const getFaceEvents = function(mac, timeRange, callback){


    let urlStr = FACE_EVENT_URL + mac +"&startTime=" + timeRange.startTime +"&endTime=" + timeRange.endTime;


    console.log('url:'+urlStr);

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": urlStr,
        "method": "GET",
        "headers": {
            "content-type": "application/json"
            // "cache-control": "no-cache"
        },
        "processData": false,
        "data": ""
    }


    $.ajax(settings).done(function (response) {

        var data=response;
        console.log(data);
        callback(data);
    });

}

$(".prevousBtn").click(() => {
    endTime = startTime;
    startTime = startTime - milliSecondPerDay;
    window.location.href = window.location.pathname + "?mac=" + mac +"&startTime=" + startTime +"&endTime=" + endTime;
});

$(".nextBtn").click(() => {
    console.log('start:'+startTime);
    console.log('end:'+endTime);
    startTime = endTime;
    endTime = endTime + milliSecondPerDay;
    window.location.href = window.location.pathname + "?mac=" + mac +"&startTime=" + startTime +"&endTime=" + endTime;
});

function drawHtml(data) {

    // console.log(data);
    var htmls="";
    for (var i = 0; i < data.Items.length; i++) {
        var imgToken = data.Items[i].imgToken;
        var url = IMG_ROOT + '/' + imgToken;

        var html =
            "<label class='member_imgs_row'>" +
            "<input type='checkbox' name='memberImgs' >" +
            "<div class='snapshot_wrap'>" +
            "<img src='" + url + "' alt='' class='snapshot js-snapshot'>" +
            "<div class='snapshot_frame'></div>" +
            "</div>" +
            "</label>";
        htmls += html;
    }

    $(".member_imgs").append(htmls);

    getSnapshotFrame(data);
    addCheckEvent();
    setNote(data);

}

function getSnapshotFrame(data) {

    for (let i = 0; i < data.Items.length; i++) {
        if (data.Items[i].faceRectangles.length>0){
            var faceRectangles = data.Items[i].faceRectangles[0]
            var top = faceRectangles.top;
            let left = faceRectangles.left;
            let width = faceRectangles.width;
            let height = faceRectangles.height;
            console.log('top:' + top + ", left:" + left + ", width:" + width + ", height:" + height);

            var snapshotWrapW = $(".snapshot_wrap").width();
            var snapshotWrapH = snapshotWrapW / imgWidth * imgHeight;
            // console.log('snapshotWrapW:' + snapshotWrapW + ", snapshotWrapH:" + snapshotWrapH)
            var frameTop = Math.round(top / imgHeight * 100);
            var frameLeft = Math.round(left / imgWidth * 100);
            var frameW = width / imgWidth * snapshotWrapW;
            var frameH = height / imgHeight * snapshotWrapH;
            // console.log('frameTop:' + frameTop + ", frameLeft:" + frameLeft + ', frameW:' + frameW + ", frameH:" + frameH);
            $(".snapshot_frame").eq(i).css({
                "top": frameTop + "%",
                "left": frameLeft + "%",
                "width": frameW + "px",
                "height": frameH + "px",
            });

        }
        
    }
   
    // 結束遮罩
    $(".waitMore").removeClass("active");
}

function addCheckEvent() {

    $("input[name='memberImgs']").click(function () {
        console.log("click");
        for (let i = 0; i < $("input[name='memberImgs']").length; i++) {
            if ($("input[name='memberImgs']").eq(i).prop("checked")) {
                $(".btn_note").addClass("active");
                break;
            } else {
                $(".btn_note").removeClass("active");
            } 
        }
    })

}

function setNote(data) {

    var data=data;
    var result=[];
    $(".btn_note").click(function () {
        if ($(".btn_note").hasClass("active")){
            console.log("has");
            // $(this).attr("href", "http://localhost:3000/addMember.html");
            for (let i = 0; i < $("input[name='memberImgs']").length; i++) {
                if ($("input[name='memberImgs']").eq(i).prop("checked")) {
                   result.push(data.Items[i]);
                }
            }
            // console.log(result);

            localStorage.setItem('memberImgs', JSON.stringify(result));

            location="./member.html?mac="+mac;
        }

    })

}