// var imgs = [];
var imgs = [{
    "form": "01",
    "img": "http://via.placeholder.com/500x500?text=1-1",
    "imgIdx": "1",
    "size": "small"
}, {
    "form": "02",
    "img": "http://via.placeholder.com/700x700?text=2-1",
    "imgIdx": "1",
    "size": "small"
}, {
    "form": "02",
    "img": "http://via.placeholder.com/700x700?text=2-1",
    "imgIdx": "1",
    "size": "big"
}, {
    "form": "03",
    "img": "http://via.placeholder.com/700x700?text=3-1",
    "imgIdx": "1",
    "size": "small"
}, {
    "form": "03",
    "img": "http://via.placeholder.com/700x700?text=3-2",
    "imgIdx": "2",
    "size": "small"
}, {
    "form": "03",
    "img": "http://via.placeholder.com/700x700?text=3-2",
    "imgIdx": "2",
    "size": "big"
}, {
    "form": "03",
    "img": "http://via.placeholder.com/700x700?text=3-3",
    "imgIdx": "3",
    "size": "small"
}, {
    "form": "03",
    "img": "http://via.placeholder.com/700x700?text=3-3",
    "imgIdx": "3",
    "size": "big"
}, {
    "form": "03",
    "img": "http://via.placeholder.com/700x700?text=3-4",
    "imgIdx": "4",
    "size": "small"
}, {
    "form": "03",
    "img": "http://via.placeholder.com/700x700?text=3-4",
    "imgIdx": "4",
    "size": "big"
}, {
    "form": "03",
    "img": "http://via.placeholder.com/700x700?text=3-5",
    "imgIdx": "5",
    "size": "small"
}, {
    "form": "03",
    "img": "http://via.placeholder.com/700x700?text=3-5",
    "imgIdx": "5",
    "size": "big"
}];
var currentForm = '02';
var pdOptional = false;//任選
var login = true;//登入
$(document).ready(function () {
    var options = {
        "mainPicWrap": ".pdcnt_img_group",
        "formChanger": ".pdcnt_info_form",
        "numberChanger": ".pdcnt_info_select .pdcnt_info_number",
        "thumbClass": ".pdcnt_img_group_thumb",
        "mainSlideClass": ".pdcnt_img_group_main",
        "initForm": currentForm
    }
    new pdContentUI(options).init();

    if(imgs.length > 0){
        getCorrectImg(imgs);
    }else{
        // console.log("no imgs");
        tryCatch();
    }

    $(".btn_pdarrived").magnificPopup({
        type: 'inline'
    });

    $(".pdcnt_info_function_pdQA").magnificPopup({
        type: 'inline',
        callbacks: {
            open: function () {
                $(".btn_hasQA").click(function (e) {
                    e.stopPropagation();
                    $(this).parents().find(".mfp-close").click();
                    if (login) {
                        $.magnificPopup.open({
                            type: 'inline',
                            items: {
                                src: '#popup_pdQA'
                            },
                            callbacks: {
                                open: function () {
                                    $(".mfp-close").click(function () {
                                        $("#popup_pdQA textarea").val("");
                                        $("#popup_pdQA .pdQA_putVCode").val("");
                                    });
                                    $(".btn_cancelQA").click(function () {
                                        $(".mfp-close").click();
                                    });
                                }
                            }
                        });
                    } else {
                        window.location.href = "login.html";
                    }

                });
            }
        }

    });

    //加價購
    $(".addBuy_more a").click(function () {
        $(".addBuy_cnt2").toggleClass("active");
        $(".addBuy_more").toggleClass("active");
    })

    //tabe
    var ProductTab1 = new Tab({
        nav: '.js-tab-nav-1 li',
        content: '.js-tab-cnt-1'
    });
    ProductTab1.init();

    var ProductTab2 = new Tab({
        nav: '.js-tab-nav-2 li',
        content: '.js-tab-cnt-2'
    });
    ProductTab2.init();
});


// 判斷圖存在與否
function getCorrectImg(imgarray) {

    var correctForms = [];
    var imgsLength = imgarray.length;
    var loadIdx = 0;

    //不檢查圖版本
    for (var i = 0; i < imgsLength; i++) {
        correctForms.push({
            "form": imgarray[i].form,
            "img": imgarray[i].img,
            "size": imgarray[i].size,
            "imgidx": imgarray[i].imgIdx
        });

        if (i === (imgsLength - 1)) {
            // console.log('stop: ' + correctForms);
            rearrangeImgarray(correctForms);
            return;
        }
    }

    //檢查圖版本
    // var loadImg = function (imgobj) {
    //     var img = new Image();
    //     img.onload = function () {

    //         correctForms.push({
    //             "form": imgobj.form,
    //             "img": imgobj.img,
    //             "size": imgobj.size,
    //             "imgidx": imgobj.imgIdx
    //         });

    //         if (loadIdx === (imgsLength - 1)) {
    //             // console.log('stop: ' + correctForms);
    //             rearrangeImgarray(correctForms);
    //             return;
    //         }
    //         if (loadIdx <= imgsLength) {
    //             loadIdx++;
    //             loadImg(imgarray[loadIdx]);
    //         }
    //     }
    //     img.onerror = function () {
    //         if (loadIdx === (imgsLength - 1)) {
    //             rearrangeImgarray(correctForms);
    //             return;
    //         }
    //         if (loadIdx < (imgsLength - 1)) {
    //             loadIdx++;
    //             loadImg(imgarray[loadIdx]);
    //         }
    //     }

    //     img.src = imgobj.img;
    // }

    // loadImg(imgarray[loadIdx]);
}

// 重新安排圖片物件格式
function rearrangeImgarray(imgarray) {
    this.newImgarray = {};
    this.formArray = [];
    imgarray.forEach(function (imgobj) {
        if (formArray.indexOf(imgobj.form) === -1) {
            formArray.push(imgobj.form);
            // console.log('new color ' + imgobj.color);
            // console.log('img size ' + imgobj.size);
            // console.log('img index ' + imgobj.imgidx);
            newImgarray[imgobj.form] = {};
            newImgarray[imgobj.form][imgobj.imgidx] = {};
            newImgarray[imgobj.form][imgobj.imgidx][imgobj.size] = imgobj.img;
        } else {
            if (newImgarray[imgobj.form][imgobj.imgidx] === undefined) {
                // console.log('not yet has this img');
                newImgarray[imgobj.form][imgobj.imgidx] = {};
                newImgarray[imgobj.form][imgobj.imgidx][imgobj.size] = imgobj.img;
            } else {

                newImgarray[imgobj.form][imgobj.imgidx][imgobj.size] = imgobj.img;
                // console.log('had this img ' + newImgarray[imgobj.form][imgobj.imgidx][imgobj.size]);
            }

        }
    });

    buildHTML(newImgarray);
    // console.log('rearrange image array ' + JSON.stringify(newImgarray));
}

function buildHTML(imgs) {

    var finalHTML = '';

    for (var formkey in imgs) {
        var imgGroupHTML = '<div class="pdcnt_img_group is-clearfix" data-form="' + formkey + '">';
        var mainImgHTML = '<div class="pdcnt_img_group_main">';
        var thumbImgHTML = '<div class="pdcnt_img_group_thumb">';

        for (formimg in imgs[formkey]) {
            // console.log('000 ' + imgs[colorkey][colorimg]);
            // console.log('001 ' + imgs[colorkey][colorimg]["small"]);
            // console.log('002 ' + imgs[colorkey][colorimg]["big"]);

            mainImgHTML = mainImgHTML + '<img src="' + imgs[formkey][formimg].small + '" alt="">';
            thumbImgHTML = thumbImgHTML + '<img src="' + imgs[formkey][formimg].small + '" alt="">';

        };

        mainImgHTML = mainImgHTML + '</div>';
        thumbImgHTML = thumbImgHTML + '</div>';
        pdCodeHTML = '<p class="is-txt-center pdcnt_img_Code">商品編號：<span></span></p>';
        imgGroupHTML = imgGroupHTML + mainImgHTML + thumbImgHTML + pdCodeHTML + '</div>';

        finalHTML = finalHTML + imgGroupHTML;
        // console.log('final html: ' + finalHTML);
    }

    $('.pdcnt_img').append(finalHTML);

    tryCatch();

}

function tryCatch() {
    try {
        $('.pdcnt_info_form option').each(function () {
            if (($(this).data('form')).toString() === currentForm) {
                $(this).prop("selected", true);
            }
            $('.pdcnt_info_form').change();
        });

    } catch (e) { //colorCode not defined
        $('.pdcnt_info_form option').eq(0).prop("selected", true);
        $('.pdcnt_info_form').change();
    }

    if ($('.pdcnt_info_form option').length > 1) {
        //子母商品
        $('.pdcnt_info_form').addClass("show");
        $(".pdcnt_info_select .pdcnt_info_number").addClass("show");
        $(".pdcnt_info_btn").addClass("notOpt");
    } else {
        if (pdOptional) {
            //任選商品
            $(".pdcnt_info_btn").addClass("isOpt");
        }else{
            //不是任選商品, 不是子母商品 
            $(".pdcnt_info_select .pdcnt_info_number").addClass("show");
            $(".pdcnt_info_btn").addClass("notOpt");
        }
    }
}

function pdContentUI(options) {

    this.mainSlideClass = options.mainPicWrap;
    this.formChanger = $(options.formChanger);
    this.numberChanger = $(options.numberChanger);
    this.mainSlide = options.mainSlideClass;
    this.thumb = options.thumbClass;
    this.currentForm = options.initForm;
    this.currentNumber;
    this.currentQty;
    this.currentIsNotice;
    this.currentpdCode;
    this.currentSalePrice;
    this.currentOriginPrice;

    this.init = function () {
        var self = this;
        this.formEvent();
        this.qtyChangEvent();
    }

}

//pdcontent點組合商品 換左邊整組圖片&數量
pdContentUI.prototype.formEvent = function () {
    var self = this;
    this.formChanger.on('change', function (e) {
        e.preventDefault();
        var formValue = $(this).find("option:selected").data('form');
        self.currentForm = formValue;
        
        var formQty = $(this).find("option:selected").data('qty');
        self.currentQty = formQty;

        var isNotice = $(this).find("option:selected").data('isnotice');
        self.currentIsNotice = isNotice;

        var pdCode = $(this).find("option:selected").data('pdcode');
        self.currentpdCode = pdCode;

        var pdSalePrice = $(this).find("option:selected").data('saleprice');
        self.currentSalePrice = pdSalePrice;

        var pdOriginPrice = $(this).find("option:selected").data('originprice');
        self.currentOriginPrice = pdOriginPrice;

        //換左邊整組圖片
        self.activeTargetSlide();

        //換最大數量
        self.activeTargetQty();

        //換商品金額
        self.activeTargetPrice();

    });
}

pdContentUI.prototype.activeTargetSlide = function () {
    var self = this;
    // console.log('active target ' + $(this.mainSlideClass).length);
    $(this.mainSlideClass).removeClass('active');
    $(this.mainSlideClass).each(function () {
        if ($(this).data('form') === self.currentForm) {
            $(this).addClass('active');
            //only active slick slide if it has not been activated
            if (!$(this).find(self.mainSlide).hasClass('slick-slider')) {
                $(this).find(self.mainSlide).slick({
                    // autoplay: true,
                    // autoplaySpeed: 2000,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    dots: true,
                    asNavFor: $(this).find(self.thumb)
                });
                $(this).find(self.thumb).slick({
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    asNavFor: $(this).find(self.mainSlide),
                    arrows: true,
                    dots: false,
                    vertical: false,
                    focusOnSelect: true
                });
            }else{
                $(this).find(self.mainSlide).slick("refresh");
                $(this).find(self.thumb).slick("refresh");
            }
        }
    });
    // console.log(self.currentpdCode);
    $(".pdcnt_img_Code span").text(self.currentpdCode);
}
pdContentUI.prototype.activeTargetQty = function () {
    var self = this;
    if (self.currentQty>0){
        self.numberChanger.attr("data-minval", 0);
        self.numberChanger.attr("data-maxval", self.currentQty);

        $('.pdcnt_info_btn').removeClass('empty');
        $('.pdcnt_info_btn').removeClass('notify');

        self.numberChanger.find("input").trigger("touchspin.updatesettings", { min: 1, max: self.currentQty, initval: 1 }); 

        //更新hidden值
        self.currentNumber = 1;
        self.fillHiddenInput();
    }else{
        self.numberChanger.attr("data-minval", 0);
        self.numberChanger.attr("data-maxval", 0);

        if (self.currentIsNotice=="Y"){
            $('.pdcnt_info_btn').addClass('notify');
            $('.pdcnt_info_btn').removeClass('empty');
        }else{
            $('.pdcnt_info_btn').addClass('empty');
            $('.pdcnt_info_btn').removeClass('notify');
        }
        self.numberChanger.find("input").trigger("touchspin.updatesettings", { min: 0, max: self.currentQty, initval: 0 }); 

        //更新hidden值
        self.currentNumber = 0;
        self.fillHiddenInput();
    }
    
}

pdContentUI.prototype.activeTargetPrice = function () {
    var self = this;
    var html ='';
    if (self.currentSalePrice == self.currentOriginPrice) {
        html = '<p class="pdcnt_info_price-sale">＄' + self.currentOriginPrice + '</p>'     
    } else {
        var html_OriginPrice = '<p class="pdcnt_info_price-origin">原價$' + self.currentOriginPrice + '</p>'
        var html_SalePrice = '<p class="pdcnt_info_price-sale">促銷價 <span>＄' + self.currentSalePrice + '</span> </p>'
        html = html_OriginPrice + html_SalePrice;
    }
    $(".pdcnt_info_price").html("");
    $(".pdcnt_info_price").html(html);
}

pdContentUI.prototype.qtyChangEvent = function () {
    var self = this;
    self.numberChanger.find("input").on('change', function () {
        var num = parseInt(self.numberChanger.find("input").val());
        self.currentNumber = num;
        self.fillHiddenInput();
    });
}

pdContentUI.prototype.fillHiddenInput = function () {
    var self=this;
    $('.js-pdGroup input[name="pdform"]').val(self.currentForm);
    $('input[name="pdnumber"]').val(self.currentNumber);
    // console.log('form: ' + $('input[name="pdform"]').val() + ',number: ' + $('input[name="pdnumber"]').val());
}
    