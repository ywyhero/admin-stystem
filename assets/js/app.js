$(function () {
    var token = window.sessionStorage.getItem('token'); //获取token
    var id =  window.sessionStorage.getItem('aid'); //获取用户id
    //点击头像跳转
    $('.admin-user-info').on('click', function() {
        window.location.href = '/info.html?aid=' + id;
    })
    //获取页面信息
    $.ajax({
        type: 'GET',
        url: 'http://47.52.236.134:3389/v1/admins?aid=' + id,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function(res) {
            if(res.code == 0) {
                $('.admin-username').text(res.admin.info.nickName);
                $('.admin-user-avatar').attr('src',res.admin.info.avatarUrl);
                var loginInfo = {
                    name: res.admin.info.nickName,
                    avatarUrl: res.admin.info.avatarUrl
                }
                window.sessionStorage.setItem('loginInfo', JSON.stringify(loginInfo))
                var gwLists = res.admin.gwList.list;
                var tempData = [];
                var gateWaysTotal = gwLists.length;
                var usePercent = 0, 
                    availableLocks = 0,
                    totalLocks = 0,
                    batteryLowLocks = 0,
                    menu = [],
                    mapArr = [],
                    htmls = [],
                    usePeople = 0;
                
                $('.admin-gateways-total').text(gateWaysTotal)
                for(var i = 0, len = gwLists.length; i < len; i++) {
                    var obj = {
                        value: gwLists[i].totalLocks,
                        name: gwLists[i].alias
                    }
                    var menuObj = {
                        title: '网关#' + gwLists[i].gid,
                        type: 'folder',
                        products: [
                            {
                                title: gwLists[i].alias,
                                type: 'item',
                                id: gwLists[i].gid,
                            }
                        ]
                    }
                    var mapObj = {
                        point: gwLists[i].latitude + ',' + gwLists[i].longitude  
                    }
                    //地图数据
                    mapArr.push(mapObj)
                    //多级菜单
                    menu.push(menuObj)
                    //饼图数据
                    tempData.push(obj)
                    availableLocks += gwLists[i].availableLocks; //该网关下管理的锁当前空闲可用总数
                    totalLocks += gwLists[i].totalLocks; //该网关下管理的锁设备总数
                    batteryLowLocks += gwLists[i].batteryLowLocks; //电量低
                    usePeople += (gwLists[i].totalLocks - gwLists[i].bannedLocks - gwLists[i].availableLocks - gwLists[i].batteryLowLocks) //使用人数
                    //网关状态
                    var status = null;
                    if( gwLists[i].status == 1) {
                        status = '正常'
                    } else if(gwLists[i].status == 0) {
                        status = '离线'
                    } else if(gwLists[i].status == -1) {
                        status = '禁用'
                    }
                    //网关列表
                    var html = '<div class="am-u-sm-12 am-u-md-6 am-u-lg-3 admin-gateway-list">'
                                + '<div class="am-cf">'
                                +   '<ul class="am-list am-list-static am-list-border">'
                                +       '<li class="admin-content-item-list" data-id=' + gwLists[i].gid + '>'
                                +           '<img class="admin-content-item-img" src="'+ gwLists[i].qrcode +'" />'
                                +            '<div class="admin-content-item-name">'
                                +                '<span>网关'+ gwLists[i].gid +'</span>'
                                +               ' <span>别名：'+ gwLists[i].alias +'</span>'
                                +           ' </div>'
                                +        '</li>'
                                +        '<li class="admin-content-item">'
                                +            '地址：'+ gwLists[i].formatted_address +''
                                +        '</li>'
                                +        '<li class="admin-content-item">'
                                +            '<span>当前状态</span>'
                                +            '<span>' + status+ '</span>'
                                +        '</li>'
                                +        '<li class="admin-content-item"> '
                                +            '<span>可使用设备</span>'
                                +            '<span>'+ gwLists[i].availableLocks +'</span>'
                                +        '</li>'
                                +        '<li class="admin-content-item">'
                                +            '<span>总设备数</span>'
                                +            '<span>'+ gwLists[i].totalLocks +'</span>'
                                +        '</li>'
                                +    '</ul>'
                                +'</div>'
                           +'</div>';
                           htmls.push(html)
                }
                $('.admin-gateways-lists').append(htmls.reverse())
                usePercent = Math.round((totalLocks - availableLocks) / totalLocks) + '%'
                $('.admin-use-percent').text(usePercent);
                $('.admin-electric-low').text(batteryLowLocks);
                $('.admin-use-people').text(usePeople)
                chartData(tempData); //echarts饼图
                map_init(mapArr);//地图初始化
                window.sessionStorage.setItem('adminMenu', JSON.stringify(menu))
                //多级菜单
                $('#myTreeSelectableFolder').tree({
                    dataSource: function(options, callback) {
                      // 模拟异步加载
                      setTimeout(function() {
                        callback({data: options.products || menu});
                      }, 400);
                    },
                    multiSelect: false,
                    cacheItems: true,
                    folderSelect: false
                });
                //多级菜单点击事件-网管详情
                $('#myTreeSelectableFolder').on('selected.tree.amui', function (event, data) {
                    var gid = data.target.id;
                    window.location.href = '/detail.html?aid=' + id  + '&gw=' + gid
                    
                });

                //网关点击事件-网管详情
                $(".admin-content-item-list").on('click', function(e) {
                    var gid = e.target.dataset.id;
                    window.location.href = '/detail.html?aid=' + id  + '&gw=' + gid

                })  
            } else if(res.code == -1) {
                window.location.href = '/index.html'
            }
           
        },
        error: function(err) {
            window.location.href = '/index.html'
        }
    })
    autoLeftNav();
   
    $(window).resize(function () {
        autoLeftNav();
    });
   
    
})


// 页面数据
function chartData(data) {
    // ==========================
    // 百度图表A http://echarts.baidu.com/
    // ==========================

    var echartsC = echarts.init(document.getElementById('tpl-echarts'));


    optionC = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: [
            {
                name: '设备状态',
                type: 'pie',
                radius: ['70%', '90%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '20',
                            fontWeight: 'bold'
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            formatter: '{b}\r\n{c}'
                        },
                        abelLine: { show: true }
                    }
                },
                data: data,
                color: ['#2d8cf0', '#19be6b', '#ff9900', '#ed3f14']
            }
        ]
    };

    echartsC.setOption(optionC);
}




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


//map
function map_init(markerArr){
    var map = new BMap.Map("allmap"); // 创建Map实例  
    map.centerAndZoom(new BMap.Point(0, 0), 1); // 初始化地图,设置中心点坐标和地图级别。  
    map.enableScrollWheelZoom(true); //启用滚轮放大缩小  
    //向地图中添加缩放控件  
    var ctrlNav = new window.BMap.NavigationControl({  
        anchor: BMAP_ANCHOR_TOP_LEFT,  
        type: BMAP_NAVIGATION_CONTROL_LARGE  
    });  
    map.addControl(ctrlNav);  

    //向地图中添加缩略图控件  
    var ctrlOve = new window.BMap.OverviewMapControl({  
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT,  
        isOpen: 1  
    });  
    map.addControl(ctrlOve);  

    var point = new Array(); //存放标注点经纬信息的数组  
    var marker = new Array(); //存放标注点对象的数组  
    var info = new Array(); //存放提示信息窗口对象的数组  
    for (var i = 0; i < markerArr.length; i++) {  
        var p0 = markerArr[i].point.split(",")[0]; //  
        var p1 = markerArr[i].point.split(",")[1]; //按照原数组的point格式将地图点坐标的经纬度分别提出来  
        point[i] = new window.BMap.Point(p0, p1); //循环生成新的地图点  
        marker[i] = new window.BMap.Marker(point[i]); //按照地图点坐标生成标记  
        map.addOverlay(marker[i]);  
        marker[i].setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画  
        // let label = new window.BMap.Label(markerArr[i].title, { offset: new window.BMap.Size(20, -10) });  
        // marker[i].setLabel(label);  
        // info[i] = new window.BMap.InfoWindow("<p style=’font-size:12px;lineheight:1.8em;’>" + markerArr[i].title + "</br>地址：" + markerArr[i].address + "</br> 电话：" + markerArr[i].tel + "</br></p>"); // 创建信息窗口对象  
    }  
}

