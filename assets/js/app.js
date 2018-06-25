$(function () {
    var token = window.sessionStorage.getItem('token'); //获取token
    var id =  window.sessionStorage.getItem('aid'); //获取用户id
    //点击头像跳转
    $('.admin-user-info').on('click', function() {
        window.location.href = '/info.html?aid=' + id;
    })
    $('.admin-user-avatar-head').on('click', function(e) {
        e.stopPropagation();
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
                $('.admin-user-avatar-head').attr('src',res.admin.info.avatarUrl);
                $('.admin-user-avatar').attr('src',res.admin.info.avatarUrl);
                var loginInfo = {
                    name: res.admin.info.nickName,
                    avatarUrl: res.admin.info.avatarUrl
                }
                window.sessionStorage.setItem('loginInfo', JSON.stringify(loginInfo))
                var gwLists = res.admin.gwList;
                var tempData = [];
                var gateWaysTotal = gwLists.length;
                var usePercent = 0, 
                    availableLocks = 0,
                    totalLocks = 0,
                    batteryLowLocks = 0,
                    bannedLocks = 0,
                    menu = [{
                        title: '设备列表',
                        type: 'folder',
                        products: []
                    }],
                    mapArr = [],
                    htmls = [],
                    usePeople = 0;
                
                $('.admin-gateways-total').text(gateWaysTotal)
                for(var i = 0, len = gwLists.length; i < len; i++) {
                   
                    var menuObj = {
                                title: '网关#' + gwLists[i].gid,
                                type: 'item',
                                id: gwLists[i].gid,
                            }
                        
                
                    var mapObj = {
                        point: gwLists[i].address.location.longitude + ',' + gwLists[i].address.location.latitude ,
                        title: gwLists[i].address.formatted_address
                    }
                    //地图数据
                    mapArr.push(mapObj)
                    //多级菜单
                    menu[0].products.push(menuObj)
                   
                    availableLocks += Number(gwLists[i].availableLocks); //该网关下管理的锁当前空闲可用总数
                    totalLocks += Number(gwLists[i].totalLocks); //该网关下管理的锁设备总数
                    batteryLowLocks += Number(gwLists[i].batteryLowLocks) //电量低
                    bannedLocks += Number(gwLists[i].bannedLocks) //禁用设备
                    usePeople += (gwLists[i].totalLocks - gwLists[i].bannedLocks - gwLists[i].availableLocks - gwLists[i].batteryLowLocks) //使用人数
                    //网关状态
                    var status = null;
                    if( gwLists[i].currentStatus == 1) {
                        status = '正常'
                    } else if(gwLists[i].currentStatus == 0) {
                        status = '空闲'
                    } else if(gwLists[i].currentStatus == -1) {
                        status = '禁用'
                    }
                    var imgSrc = gwLists[i].qrcode ? gwLists[i].qrcode : 'assets/img/user01.png'
                    //网关列表
                    var html = '<div class="am-u-sm-12 am-u-md-6 am-u-lg-3 admin-gateway-list">'
                                + '<div class="am-cf">'
                                +   '<ul class="am-list am-list-static am-list-border">'
                                +       '<li class="admin-content-item-list" data-id=' + gwLists[i].gid + '>'
                                +           '<img class="admin-content-item-img" data-id=' + gwLists[i].gid + ' src="'+ imgSrc +'" />'
                                +            '<div class="admin-content-item-name" data-id=' + gwLists[i].gid + '>'
                                +                '<span data-id=' + gwLists[i].gid + '>网关'+ gwLists[i].gid +'</span>'
                                +               ' <span class="admin-content-item-other-name" data-id=' + gwLists[i].gid + '>别名：'+ gwLists[i].alias +'</span>'
                                +           ' </div>'
                                +        '</li>'
                                +        '<li class="admin-content-item admin-content-address" title="'+gwLists[i].address.formatted_address+'">'
                                +            '地址：'+ gwLists[i].address.formatted_address +''
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
                menu[0].products.reverse()
                $('.admin-gateways-lists').append(htmls.reverse())
                usePercent = Math.round(usePeople / totalLocks * 100) + '%'
                $('.admin-use-percent').text(usePercent);
                $('.admin-electric-low').text(batteryLowLocks);
                $('.admin-use-people').text(usePeople)
                 //饼图数据
                tempData = [{
                        value:  Number(Math.round(usePeople / totalLocks * 100) ) ,
                        name: '正在使用的设备'
                    }, {
                        value: Number(Math.round(availableLocks / totalLocks * 100)) ,
                        name: '空闲设备'
                    }, {
                        value: Number(Math.round(bannedLocks / totalLocks * 100)),
                        name: '禁用的设备'
                    }, {
                        value: Number(Math.round(batteryLowLocks / totalLocks * 100)),
                        name: '低电量设备'
                    }]
                    console.log(tempData)
                chartData(tempData); //echarts饼图
                var x = mapArr[0].point.split(',')[0];
                var y = mapArr[0].point.split(',')[1];
                map_init(x, y, mapArr);//地图初始化
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
                //多级菜单点击事件-网关详情
                $('#myTreeSelectableFolder').on('selected.tree.amui', function (event, data) {
                    var gid = data.target.id;
                    window.location.href = '/detail.html?aid=' + id  + '&gw=' + gid
                    
                });

                //网关点击事件-网关详情
                $(".admin-content-item-list").on('click', function(e) {
                    var gid = e.target.dataset.id;
                    window.location.href = '/detail.html?aid=' + id  + '&gw=' + gid

                })  
                

                // $('.admin-main-electric-low').on('click', function() {
                //     window.location.href = '/detail.html?from=header'
                // })
            } else if(res.code == -1) {
                window.location.href = '/index.html'
            }
           
        },
        error: function(err) {
            window.location.href = '/index.html'
        }
    })
  
    
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
            formatter: "{a} <br/>{b}: {d}%"
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
                            formatter: '{b}\r\n{c}%'
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

//map
function map_init(x, y, markerArr){  
    var map = new BMap.Map("allmap"); // 创建Map实例  
    map.centerAndZoom(new BMap.Point(x, y), 4); // 初始化地图,设置中心点坐标和地图级别。  
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
        var p0 = Number(markerArr[i].point.split(",")[0]); //  
        var p1 = Number(markerArr[i].point.split(",")[1]); //按照原数组的point格式将地图点坐标的经纬度分别提出来  
        point[i] = new window.BMap.Point(p0, p1); //循环生成新的地图点  
        marker[i] = new window.BMap.Marker(point[i]); //按照地图点坐标生成标记  
       
        map.addOverlay(marker[i]);  
        marker[i].setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画  
        let label = new window.BMap.Label(markerArr[i].title, { offset: new window.BMap.Size(20, -10) });  
        marker[i].setLabel(label);  
        info[i] = new window.BMap.InfoWindow("<p style=’font-size:12px;lineheight:1.8em;’>" + markerArr[i].title + "</p>"); // 创建信息窗口对象    
    }  
}

