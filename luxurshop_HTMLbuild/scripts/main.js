// var startAd=false;
$(document).ready(function() {

    //phone menu
    $(".header_phone_menu").click(function() {
        $("body").addClass("menuOpen");
    });

    $(".pageCover").click(function() {
        $("body").removeClass("menuOpen");
    });

    // phone submenu
    $(".phoneMenu .submenuTitle").click(function() {
        var n = $(this).hasClass("active");
        // console.log(n);
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
            $(this).parent().find(".submenu").removeClass("active");
        } else {
            $(".phoneMenu .submenuTitle").removeClass("active");
            $(".phoneMenu .submenu").parent().find(".submenu").removeClass("active");
            $(this).addClass("active");
            $(this).parent().find(".submenu").addClass("active");
            return false;
        }
    });

    $('.js_hamburger').on('click', function(e) {
        e.stopPropagation();
        $('.js_subMenu').slideDown();
    });

    $('.js_subTitle').on('click', function() {
        self = $(this);

        if (self.hasClass('active')) {
            self.removeClass('active');
            self.siblings('.js_subList').stop().slideUp();
            $('.js_subTitle i').removeClass('fa-minus').addClass('fa-plus');
        } else {
            $('.js_subTitle i').removeClass('fa-minus').addClass('fa-plus');
            $(this).find('i').removeClass('fa-plus').addClass('fa-minus');
            $('.js_subTitle').removeClass('active');
            self.addClass('active');
            $('.js_subList').stop().slideUp();
            self.siblings('.js_subList').stop().slideDown();
        }
    });

    $(".pdcnt_info_number").each(function () {
        var minval = $(this).data("minval");
        var maxval = $(this).data("maxval");
        // console.log(minval)
        $(this).find("input").TouchSpin({
            min: minval,
            max: maxval,
            initval: minval,
            step: 1
        });
    });

    $('.js-mfp-inline').each(function (index, ele) {
        $(ele).magnificPopup({
            type: 'inline'
        });
    });

    //偵測ie11以下警示
    // alert(navigator.userAgent);
    if (navigator.userAgent.indexOf('MSIE') !== -1 ) {
        // MSIE
        alert("本網站不支援 IE11 以下的瀏覽器, 建議您使用其他瀏覽器瀏覽本網站, 您將會有更流暢的瀏覽體驗。");
    }
});

function Tab(options) {
    this.nav = $(options.nav);
    this.cnt = $(options.content);
}
Tab.prototype.init = function () {
    this.navClick();
    this.nav.eq(0).click();
}
Tab.prototype.navClick = function () {
    var self = this;
    this.nav.on('click', function () {
        self.nav.removeClass('active');
        self.cnt.removeClass('active');
        $(this).addClass('active');
        var index = $(this).index();
        self.cnt.eq(index).addClass('active');

        $(".js_carousel").slick("refresh");

    });
}