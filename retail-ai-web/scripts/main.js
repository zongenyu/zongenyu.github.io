var userCloudID = "";
var userFaceID = "";
var headshotToken = "";
var origImgToken = "";
var imgPath = {};

$(document).ready(function () {
    init();

    // 打開基本資料備註
    $(".js-btn-addNote").click(function () {
        $(".addNote_wrap").addClass("active");
        $(".js-btn-addNote").parent().css("display", "none");
    });

    //關掉基本資料備註
    $(".js-btn_cancel").click(function () {
        $(".addNote_wrap textarea").val("");
        $(".addNote_wrap").removeClass("active");
        $(".js-btn-addNote").parent().css("display", "block");
    });

    //新增基本資料備註
    $(".js-btn_add").click(function () {
        var note = $(".addNote_wrap textarea").val();
        if (note !== "") {
            var html = '<div class="member_note_item js-note">';
            var time = '<p>2018/09/20 13:20</p>';
            var cnt = '<p>' + note + '</p>';
            html = html + time + cnt + '</div>';
            $(".member_note").append(html);

            $(".addNote_wrap").removeClass("active");
            $(".js-btn-addNote").parent().css("display", "block");
        }

    });

    //儲存基本資料
    $(".js-btn-save").click(function () {
        getData(putAjax);
    });
    $(".js-btn-newmember").click(function () {
        getData(postAjax);
    });

    //在snapshot畫出臉部方框
    setTimeout(() => {
        getSnapshotFrame();
    }, 2000);

    $(window).resize(function () {
        getSnapshotFrame();
    });

});

function init() {

    let urlParams = new URLSearchParams(window.location.search);

    userCloudID = urlParams.get('userID');
    userFaceID = urlParams.get('tmpID');
    headshotToken = urlParams.get('img');
    origImgToken = urlParams.get('origImgToken');

    getImgUrl(headshotToken, 'headshotPath', imgPath);
    getImgUrl(origImgToken, 'origImgPath', imgPath);

    console.log("urlParams:" + urlParams);
    console.log("userCloudID:" + userCloudID);
    console.log("userFaceID:" + userFaceID);
    console.log($(".js-snapshot").attr("src"));
    var url = "https://2k2foie16m.execute-api.ap-northeast-1.amazonaws.com/v1/customer_note?userID=" + userCloudID;

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": "GET",
        "headers": {},
        "processData": false,
        "data": ""
    }

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
        "snapshot": "",
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
    data.snapshot = $(".js-snapshot").attr("src");
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
        memberNote.snapshot = headshotToken;

        data.notes.push(memberNote);
    });

    data.origImgToken = (origImgToken === '' ? headshotToken : origImgToken);
    apiCall(data);
};

function putAjax(data) {
    var stringData = JSON.stringify(data);
    console.log(stringData);

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://2k2foie16m.execute-api.ap-northeast-1.amazonaws.com/v1/customer_note", "method": "PUT",
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

function postAjax(data) {
    var stringData = JSON.stringify(data);
    console.log(stringData);

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://2k2foie16m.execute-api.ap-northeast-1.amazonaws.com/v1/customer_note", "method": "POST",
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

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function updateImage() {
    console.log('imagePath:' + JSON.stringify(imgPath));
    console.log('headshotPath:' + imgPath.headshotPath);
    console.log('\n');
    console.log('origImgPath:' + imgPath.origImgPath);
    $(".js-snapshot").attr("src", imgPath.headshotPath);
    $(".js-snapshot-small").attr("src", imgPath.origImgPath);
    // Upadate original picture here
}

function getImgUrl(token, key, pathObj) {

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://2k2foie16m.execute-api.ap-northeast-1.amazonaws.com/v1/faceImg?file_token=" + token,
        "method": "GET",
        // "url": "http://127.0.0.1:8300/customer_note",        "method": "PUT",        
        "headers": {
            "content-type": "application/json"
        },
        "processData": false
    };
    // console.log(settings.data);

    $.ajax(settings).done(function (response) {
        console.log(JSON.stringify(response));
        pathObj[key] = response.Location;
        updateImage();
    });
}

function getSnapshotFrame() {
    let urlParams = new URLSearchParams(window.location.search);

    let top = urlParams.get('top');
    let left = urlParams.get('left');
    let width = urlParams.get('width');
    let height = urlParams.get('height');
    // console.log('top:' + top + ", left:" + left + ", width:" + width + ", height:" + height);

    var headshotImg = new Image();
    headshotImg.src = imgPath.headshotPath;
    console.log('headshotImg src:' + headshotImg.src);
    var headshotImgW = headshotImg.width;
    var headshotImgH = headshotImg.height;
    // console.log('headshot image width:' + headshotImgW + "height:" + headshotImgH);

    var snapshotWrapW = $(".snapshot_wrap").width();
    var snapshotWrapH = $(".snapshot_wrap").height();

    var frameTop = Math.round(top / headshotImgH * 100);
    var frameLeft = Math.round(left / headshotImgW * 100);
    var frameW = width / headshotImgW * snapshotWrapW;
    var frameH = height / headshotImgH * snapshotWrapH;

    $(".snapshot_frame").css({
        "top": frameTop + "%",
        "left": frameLeft + "%",
        "width": frameW + "px",
        "height": frameH + "px",
    });
}