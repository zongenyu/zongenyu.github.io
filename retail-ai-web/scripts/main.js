var userCloudID = "";
var userFaceID = "";
var headshotPath = "";

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
        getData();
    });

});

function init() {
    let urlParams = new URLSearchParams(window.location.search);

    userCloudID = urlParams.get('userID');
    userFaceID = urlParams.get('tmpID');
    headshotPath = urlParams.get('img=');
    let indexImgKey = window.location.search.indexOf('img=');
    headshotPath = window.location.search.substring(indexImgKey+'img='.length, window.location.search.length+1);

    $(".js-snapshot").attr("src", headshotPath);


    console.log("urlParams:"+urlParams);
    console.log("userCloudID:"+userCloudID);
    console.log("userFaceID:"+userFaceID);
    console.log($(".js-snapshot").attr("src"));
    var url = "https://2k2foie16m.execute-api.ap-northeast-1.amazonaws.com/v1/customer_note?userID="+userCloudID;
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": "GET",
        "headers": {},
        "processData": false,
        "data": ""
    }

    var initData={};
    $.ajax(settings).done(function (response) {
        // console.log(response);
        initData=response;
        // console.log(initData);

        //put data to html
        $(".headerLine").attr("data-id", userCloudID);
        $(".headerLine").text(initData.userName);
        $(".js-userName").val(initData.userName);
        $(".visitTime span:last-child").text(initData.lastVisitTime);
        $(".js-snapshot").attr("src", headshotPath);
        $("input[name='gender']").each(function () {
            if ($(this).val() == initData.gender) {
                $(this).prop("checked", true);
            }
        });
        $("input[type='date']").val(initData.birthday);
        $("input[name='figure']").each(function () {
            if ($(this).val() == initData.figure) {
                $(this).prop("checked", true);
            }
        });
        for (var i = 0; i < initData.favor.length; i++) {
            $("input[name='favor']").each(function () {
                if ($(this).val() == initData.favor[i]) {
                    $(this).prop("checked", true);
                }
            });
        }
        for (var j = 0; j < initData.familyRole.length; j++) {
            $("input[name='familyrole']").each(function () {
                if ($(this).val() == initData.familyRole[j]) {
                    $(this).prop("checked", true);
                }
            });
        }
        for (var k = 0; k < initData.notes.length; k++) {
            var html ='<div class="member_note_item js-note">';
            var p1 = '<p>' + initData.notes[k].time+'</p>';
            var p2 = '<p>' + initData.notes[k].note + '</p>';
            html=html+p1+p2+'</div>';
            $(".member_note").append(html);
        }

    }); 
    
}

function getData() {
    var data = {
        "userID": "",
        "userName": "",
        "lastVisitTime": "",
        "snapshot": "",
        "gender": "",
        "birthday": "",
        "figure": "",
        "favor": [],
        "familyRole": [],
        "notes": []
    };

    data.userID = userCloudID;
    data.userName = $(".js-userName").val();
    data.lastVisitTime ="2018/10/01 11:35";
    data.snapshot = $(".js-snapshot").attr("src");
    data.gender = $("input[name='gender']:checked").val();
    data.birthday = $("input[type='date']").val();
    data.figure = $("input[name='figure']:checked").val();

    if (userFaceID!=='undefined'){
        data.faceId = userFaceID;
    }
    $("input[name='favor']:checked").each(function () {
        data.favor.push($(this).val());
    });
    $("input[name='familyrole']:checked").each(function () {
        data.familyRole.push($(this).val());
    });
    $(".js-note").each(function () {
        var memberNote={
            "time":"",
            "note":""
        };
        memberNote.time=$(this).find("p:first-child").text();
        memberNote.note = $(this).find("p:last-child").text();
        data.notes.push(memberNote);
    });
  
    putAjax(data);
};

function putAjax(data) {
    var stringData=JSON.stringify(data);
    console.log(stringData);

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://2k2foie16m.execute-api.ap-northeast-1.amazonaws.com/v1/customer_note",        "method": "PUT",
        "headers": {
            "content-type": "application/json"
        },
        "processData": false,
        "data": stringData
    };
    // console.log(settings.data);

    $.ajax(settings).done(function (response) {
        console.log(JSON.stringify(response));
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