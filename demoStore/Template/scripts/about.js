$(document).ready(function () {
    // console.log(window.location.href); 
    var href = window.location.href;
    var arry=href.split("id=");
    arry=arry[1].split(".html");
    var id=arry[0];
    id = "#".concat(id);
    // console.log(id + "," + $(id).find("h3").text() + ", " + $(id).offset().top);
    var h = $(id).offset().top;
    if ($(window).width()>=1024){
        h = h - 183 - 105;//header fixed height
    }else{
        h = h - 100;//header fixed height
    }
    
    $('html, body').animate({
        scrollTop: h
    }, 500);
});