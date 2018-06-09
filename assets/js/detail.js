$(function () {
    autoLeftNav();
    $(window).resize(function () {
        autoLeftNav();
    });
    // $('#myTreeSelectableFolder').tree();
    var data = [
        {
            title: '苹果公司',
            type: 'folder',
            products: [
                {
                    title: 'iPhone',
                    type: 'folder',
                    products: [
                        {
                            title: 'iMac',
                            type: 'item'
                        },
                        {
                            title: 'MacBook Pro',
                            type: 'item'
                        }
                    ]
                },
                {
                    title: 'iMac',
                    type: 'item'
                },
                {
                    title: 'MacBook Pro',
                    type: 'item'
                }
            ]
        }
    ];
    $('#myTreeSelectableFolder').tree({
        dataSource: function(options, callback) {
          // 模拟异步加载
          setTimeout(function() {
            callback({data: options.products || data});
          }, 400);
        },
        multiSelect: false,
        cacheItems: true,
        folderSelect: false
    });
    $('.admin-content-item-edit').on('click', function(){
        if($('.admin-content-item-input').attr('disabled')){
            $('.admin-content-item-input').attr('disabled', false)
        } else {
            $('.admin-content-item-input').attr('disabled', true)
        }
    })
    
    
})



// 侧边菜单开关


function autoLeftNav() {
    $('.tpl-header-switch-button').on('click', function () {
        console.log($('.left-sidebar').hasClass('active'))
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


