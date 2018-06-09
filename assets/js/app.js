$(function () {

    autoLeftNav();
    map_init();
    chartData();
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
    $('#myTreeSelectableFolder').on('selected.tree.amui', function (event, data) {
        // do something with data: { selected: [array], target: [object] }
        console.log(data)
        console.log(event)
    });
})


// 页面数据
function chartData() {
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
                data: [
                    { value: 335, name: '直接访问' },
                    { value: 310, name: '邮件营销' },
                    { value: 234, name: '联盟广告' },
                    { value: 135, name: '视频广告' }
                ],
                color: ['#2d8cf0', '#19be6b', '#ff9900', '#ed3f14']
            }
        ]
    };

    echartsC.setOption(optionC);
}




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


//map
function map_init(){
    var markerArr = [
        { title: "名称：广州火车站", point: "0.264531,23.157003", address: "广东省广州市广州火车站", tel: "12306" },  
        { title: "名称：广州塔（赤岗塔）", point: "10.330934,23.113401", address: "广东省广州市广州塔（赤岗塔） ", tel: "18500000000" },  
        { title: "名称：广州动物园", point: "-10.312213,23.147267", address: "广东省广州市广州动物园", tel: "18500000000" },  
        { title: "名称：天河公园", point: "3.372867,23.134274", address: "广东省广州市天河公园", tel: "18500000000" }  
      ];
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

