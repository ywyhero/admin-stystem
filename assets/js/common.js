$(function () {
    //左侧菜单
    autoLeftNav();
    $(window).resize(function () {
        autoLeftNav();
    });
    $('.admin-login-out').on('click', function() {
        window.sessionStorage.removeItem('token');
        window.sessionStorage.removeItem('aid');
        window.sessionStorage.removeItem('loginInfo');
        window.sessionStorage.removeItem('adminMenu');
        window.location.href = '/index.html'
    })
})


// 侧边菜单开关


function autoLeftNav() {
    $('.tpl-header-switch-button').on('click', function () {
        if ($('.left-sidebar').hasClass('active')) {
            if ($(window).width() > 1024) {
                $('.tpl-content-wrapper').removeClass('active');
            }
            $('.left-sidebar').removeClass('active');

        } else {
            if ($(window).width() > 1024) {
                $('.tpl-content-wrapper').addClass('active');
            }
            $('.left-sidebar').addClass('active');

        }
    })

    if ($(window).width() < 1024) {
        $('.left-sidebar').addClass('active');
    } else {
        $('.left-sidebar').removeClass('active');
    }
}


// 侧边菜单
$('.sidebar-nav-sub-title').on('click', function () {
    $(this).siblings('.sidebar-nav-sub').slideToggle(80)
        .end()
        .find('.sidebar-nav-sub-ico').toggleClass('sidebar-nav-sub-ico-rotate');
})