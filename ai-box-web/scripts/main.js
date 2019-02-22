
$(document).ready(function () {
    $(".js-btn_URL").click(function () {
        var url = $(".urlIpt").val();
        console.log(url);
    });
    //在snapshot畫出臉部方框
    $(".js-btn_snapshotFrame").click(function () {
        var x1 = $(".axis_x1").val();
        var y1 = $(".axis_y1").val();
        var x2 = $(".axis_x2").val();
        var y2 = $(".axis_y2").val();
        console.log(x1+", "+y1+", "+x2+", "+y2);
        setSnapshotFrame(x1, y1, x2, y2);
    });
    

});

function setSnapshotFrame(x1, y1, x2, y2) {

    var snapshotWrapW = $(".snapshot_wrap").width();
    var snapshotWrapH = $(".snapshot_wrap").height();

    var frameTop = y1;
    var frameLeft = x1;
    var frameW = (x2-x1) / 100 * snapshotWrapW;
    var frameH = (y2-y1) / 100 * snapshotWrapH;

    $(".snapshot_frame").css({
        "top": frameTop + "%",
        "left": frameLeft + "%",
        "width": frameW + "px",
        "height": frameH + "px",
    });
}