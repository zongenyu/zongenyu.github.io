
$(document).ready(function () {
    $(".js_carousel_addBuy").slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        infinite: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2
                }
            }
        ]
    });

    $(".pdcnt_info_number").each(function () {
        var minval = $(this).data("minval");
        var maxval = $(this).data("maxval");
        //    console.log(minval);
        $(this).find("input").TouchSpin({
            min: minval,
            max: maxval,
            initval: minval,
            step: 1
        });
    });

    $(".addrBook_table input").click(function () {
        $(".addrBook_table tr").removeClass("active");
        $(this).parent().parent().addClass("active");
    });

    //付款方式
    drawPayCountrySelect(PaymentCountryList);

    //地址
    drawCitySelect(cityList);
    drawOutlyingCitySelect(outlyingCityList);

    //日藥門市地址
    drawJPMAtoreSelect(collectList);

    $(".invoiceType_label").click(function () {
        var index = $(this).index();
        $(".invoiceType_info").removeClass("active");
        $(".invoiceType_info").eq(index).addClass("active");
    });

    $('.popup_with_addrBook').magnificPopup({
        type: 'inline',
    });

    $(".popup_with_invoiceNote").magnificPopup({
        type: 'inline',
    });

    //載入時進入等待圖
    $(".js-shoppingBtn").click(function () {
        $(".waitMore").addClass("active");
        setTimeout(function(){
            window.location = "orderfinish.html";
        }, 3000);
    });

});

//付款方式
function drawPayCountrySelect(data) {
    var html = '<option value="-1" data-index="-1">國家</option>';
    for (var i = 0; i < data.length; i++) {
        // console.log(data[i].CountryTitle);
        var option = '<option value=' + data[i].CountryID + ' data-index=' + i + '>' + data[i].CountryTitle + '</option>';
        html = html + option;
    }
    $(".payway_country").html("");
    $(".payway_country").append(html);

    drawPayWaySelect(data);
}

function drawPayWaySelect(data) {
    $(".payway_country").change(function () {
        var index = $(this).find("option:selected").data("index");
        // console.log(index);
        var html = '<option value="-1" data-countryindex=' + index + ' data-payindex="-1">付款方式</option>';
        if (index != "-1") {
            for (var i = 0; i < data[index].PaymentList.length; i++) {
                var option = '<option value=' + data[index].PaymentList[i].PaymentCode + ' data-countryindex=' + index + ' data-payindex=' + i + '>' + data[index].PaymentList[i].PaymentName + '</option>';
                html = html + option;
            }
        }

        $(".payway_pay").html("");
        $(".payway_pay").append(html);

        //取貨方式清空
        $(".payway_transport").html("");
        $(".payway_transport").append('<option value="-1">取貨方式</option>');

        //收件人資料清空
        $(".js-recipientInfo_box").removeClass("active");

        drawPayTransportSelect(data);

    });

    initCity("TW");
}

function drawPayTransportSelect(data) {
    $(".payway_pay").change(function () {
        var countryIndex = $(this).find("option:selected").data("countryindex");
        var payIndex = $(this).find("option:selected").data("payindex");
        // console.log(countryIndex+", "+payIndex);
        var html = '<option value="-1">取貨方式</option>';
        if (payIndex != "-1") {
            for (var i = 0; i < data[countryIndex].PaymentList[payIndex].DeliveryList.length; i++) {
                // console.log(data[countryIndex].PaymentList[payIndex].DeliveryList[i].DeliveryName);
                var option = '<option value=' + data[countryIndex].PaymentList[payIndex].DeliveryList[i].DeliveryCode + ' data-countryindex=' + countryIndex + ' data-payindex=' + payIndex + ' data-deliveryindex=' + i + '>' + data[countryIndex].PaymentList[payIndex].DeliveryList[i].DeliveryName + '</option>';
                html = html + option;
            }
        }
        $(".payway_transport").html("");
        $(".payway_transport").append(html);

        //收件人資料清空
        $(".js-recipientInfo_box").removeClass("active");

        targetRecipientInfo(data);
    });

}

function targetRecipientInfo(data) {
    $(".payway_transport").change(function () {
        var transport = $(this).find("option:selected").val();
        var countryIndex = $(this).find("option:selected").data("countryindex");
        var payIndex = $(this).find("option:selected").data("payindex");
        var deliveryIndex = $(this).find("option:selected").data("deliveryindex");
        // console.log(transport + ", " + countryIndex + ", " + payIndex + ", " + deliveryIndex);

        $(".js-recipientInfo_box").removeClass("active");
        switch (transport) {
            case "1"://宅配
                $(".js-recipientInfo_box[data-type='宅配']").addClass("active");
                
                // var html = '<option value="-1">配送時段</option>';
                // for (var i = 0; i < data[countryIndex].PaymentList[payIndex].DeliveryList[deliveryIndex].DeliveryTimeList.length; i++) {
                //     console.log(data[countryIndex].PaymentList[payIndex].DeliveryList[deliveryIndex].DeliveryTimeList[i].DeliveryTimeName);
                //     var option = '<option value=' + data[countryIndex].PaymentList[payIndex].DeliveryList[deliveryIndex].DeliveryTimeList[i].DeliveryTimeID + '>' + data[countryIndex].PaymentList[payIndex].DeliveryList[deliveryIndex].DeliveryTimeList[i].DeliveryTimeName + '</option>';
                //     html = html + option;
                // }
                // $(".js-recipientInfo_box[data-type='宅配']").find(".js-recipientTime").html("");
                // $(".js-recipientInfo_box[data-type='宅配']").find(".js-recipientTime").append(html);

                break;
            case "ISL"://宅配離島
                $(".js-recipientInfo_box[data-type='宅配離島']").addClass("active");

                break;
            case "3"://門市取貨
                $(".js-recipientInfo_box[data-type='門市取貨']").addClass("active");
                break;
            case "2"://超商取貨
                $(".js-recipientInfo_box[data-type='超商取貨']").addClass("active");
                break;
            case "LF"://空運
                var country = $(".payway_country").find("option:selected").val();

                // var html = '<option value="-1">配送時段</option>';
                // for (var i = 0; i < data[countryIndex].PaymentList[payIndex].DeliveryList[deliveryIndex].DeliveryTimeList.length; i++) {
                //     console.log(data[countryIndex].PaymentList[payIndex].DeliveryList[deliveryIndex].DeliveryTimeList[i].DeliveryTimeName);
                //     var option = '<option value=' + data[countryIndex].PaymentList[payIndex].DeliveryList[deliveryIndex].DeliveryTimeList[i].DeliveryTimeID + '>' + data[countryIndex].PaymentList[payIndex].DeliveryList[deliveryIndex].DeliveryTimeList[i].DeliveryTimeName + '</option>';
                //     html = html + option;
                // }

                if (country == "02") {
                    //中國
                    $(".js-recipientInfo_box[data-type='中國空運']").addClass("active");
                    // $(".js-recipientInfo_box[data-type='中國空運']").find(".js-recipientTime").html("");
                    // $(".js-recipientInfo_box[data-type='中國空運']").find(".js-recipientTime").append(html);
                } else {
                    //海外空運
                    $(".js-recipientInfo_box[data-type='海外空運']").addClass("active");
                    // $(".js-recipientInfo_box[data-type='海外空運']").find(".js-recipientTime").html("");
                    // $(".js-recipientInfo_box[data-type='海外空運']").find(".js-recipientTime").append(html);
                }
                break;
            case "":
                break;
        }

    });
}

// 配送地址
function drawCitySelect(data) {
    var html = '<option value="-1" data-index="-1">縣市</option>';
    for (var i = 0; i < data.length; i++) {
        var option = '<option value=' + data[i].CityID + ' data-index=' + i + '>' + data[i].CityTitle + '</option>';
        html = html + option;
    }
    $(".js-city").html("");
    $(".js-city").append(html);

    targetCity(data);
}

function targetCity(data) {
    $(".js-city").change(function () {
        var index = $(this).find("option:selected").data("index");
        var selectorClass = $(this).parent().attr("class");
        // console.log(index + "," + selectorClass);
        drawAreaSelect(data, index, selectorClass);
    });
}

function drawAreaSelect(data, index, selectorClass) {
    var html = '<option value="-1" data-zipcode="">鄉鎮市區</option>';
    if (index != "-1") {
        for (var i = 0; i < data[index].AreaList.length; i++) {
            var option = '<option value=' + data[index].AreaList[i].AreaID + ' data-zipcode=' + data[index].AreaList[i].ZipCode + '>' + data[index].AreaList[i].AreaTitle + '</option>';
            html = html + option;
        }
    }
    $("." + selectorClass).find(".js-area").html("");
    $("." + selectorClass).find(".js-area").append(html);
    $("." + selectorClass).find(".js-zipCode").val("");

    targetArea();
}

function targetArea() {
    $(".js-area").change(function () {
        var zipcode = $(this).find("option:selected").data("zipcode");
        //    console.log(zipcode);
        $(this).parent().find(".js-zipCode").val(zipcode);
    });
}

// 離島配送地址
function drawOutlyingCitySelect(data) {
    var html = '<option value="-1" data-index="-1">縣市</option>';
    for (var i = 0; i < data.length; i++) {
        var option = '<option value=' + data[i].CityID + ' data-index=' + i + '>' + data[i].CityTitle + '</option>';
        html = html + option;
    }
    $(".js-city-outlying").html("");
    $(".js-city-outlying").append(html);

    targetOutlyingCity(data);
}

function targetOutlyingCity(data) {
    $(".js-city-outlying").change(function () {
        var index = $(this).find("option:selected").data("index");
        var selectorClass = $(this).parent().attr("class");
        // console.log(index + "," + selectorClass);
        drawOutlyingAreaSelect(data, index, selectorClass);
    });
}

function drawOutlyingAreaSelect(data, index, selectorClass) {
    var html = '<option value="-1" data-zipcode="">鄉鎮市區</option>';
    if (index != "-1") {
        for (var i = 0; i < data[index].AreaList.length; i++) {
            var option = '<option value=' + data[index].AreaList[i].AreaID + ' data-zipcode=' + data[index].AreaList[i].ZipCode + '>' + data[index].AreaList[i].AreaTitle + '</option>';
            html = html + option;
        }
    }
    $("." + selectorClass).find(".js-area-outlying").html("");
    $("." + selectorClass).find(".js-area-outlying").append(html);
    $("." + selectorClass).find(".js-zipCode-outlying").val("");

    targetOutlyingArea();
}

function targetOutlyingArea() {
    $(".js-area-outlying").change(function () {
        var zipcode = $(this).find("option:selected").data("zipcode");
        //    console.log(zipcode);
        $(this).parent().find(".js-zipCode-outlying").val(zipcode);
    });
}


function drawJPMAtoreSelect(data) {
    var html = '<option value="-1">選擇門市</option>';
    for (var i = 0; i < data.length; i++) {
        var opt = '<option value=' + data[i].CollectId + ' data-index=' + i + '>' + data[i].CollectName + '</option>';    
        html = html + opt;
    }
    $(".jpm_store_select").html("");
    $(".jpm_store_select").append(html);

    targetJPMStore(data);
}

function targetJPMStore(data) {
    $(".jpm_store_select").change(function () {
        if ($(this).find("option:selected").data("index")>=0){
            var index = $(this).find("option:selected").data("index");
            var storeAddr = data[index].CollectAddr;
            var storeTime = "門市電話：".concat(data[index].Phone);

            $(".jpm_storeName").val(data[index].CollectName);
            $(".jpm_storeAddr").text(storeAddr);
            $(".jpm_storeTime").text(storeTime);
        }else{
            $(".jpm_storeAddr").text("");
            $(".jpm_storeTime").text("");
        }
        
    });
}

function initCity(cityId) {
    for (let i = 0; i < $(".payway_country option").length; i++) {
        // console.log($(".payway_country option").eq(i).val());
        if ($(".payway_country option").eq(i).val() == cityId) {
            $(".payway_country option").eq(i).prop("selected", true);
            $(".payway_country option").change();
            break;
        }

    }
}