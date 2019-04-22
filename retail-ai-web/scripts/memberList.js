

const FACE_ROOT = 'https://di93lo4zawi3i.cloudfront.net';
var urlParams = new URLSearchParams(window.location.search);
var mac = urlParams.get('mac');

var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://2k2foie16m.execute-api.ap-northeast-1.amazonaws.com/v1/customer_note/all?mac="+mac,
    "method": "GET",
    "headers": {
        "content-type": "application/json",
    },
    "processData": false,
    "data": ""
}

$.ajax(settings).done(function (response) {
    console.log(response);
    init(response);
});

//初始化畫面
function init(data) {

    for (var i = 0; i < data.Items.length; i++) {
        var imgSrc = FACE_ROOT + '/' + data.Items[i].snapshots[0];
        var htmli_tdImg = '<td>' +'<img src='+imgSrc+' alt="">'+'</td>';
        var html_tdInfo ='<td>';
        var name_url = './member.html?userID=' + data.Items[i].userID + '&mac=' + mac;
        var html_name = '<p class="js-userName" data-th="姓名:">'+
                            '<a href=' + name_url+' class="is-link">' + data.Items[i].userName+'</a>'+
                        '</p>';
        var html_gender = '<p class="js-gender" data-th="性別:">' + data.Items[i].gender+'</p>';
        var html_birthday = '<p class="js-date" data-th="生日:">' + data.Items[i].birthday +'</p>';
        
        var html_budget = '<p class="js-budget" data-th="預算:">' + data.Items[i].budget+'</p>';
        var html_career = '<p class="js-career" data-th="職業:">' + data.Items[i].career + '</p>';
        
        var html_tr = '<tr>' + htmli_tdImg + html_tdInfo + html_name + html_gender + html_birthday + html_favorColor + html_favor + html_dealChance + html_budget + html_career+"</tr>";
        $(".member_list").append(html_tr);
        console.log(html_tr);
    }
    
}

