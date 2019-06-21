<template>
  <div id="ddos">
    <div id="map"></div>
  </div>
</template>

<script>
import echarts from "echarts";
// 引入每个地址的坐标
import geoCoordData from "../data/geoCoordData.json";
// 引入北上广和其他城市相关联的数据
import BJData from "../data/BJData.json";
import SHData from "../data/SHData.json";
import GZData from "../data/BJData.json";
// 引入地图样式
import MapStyle from "../data/MapStyle.json";
export default {
  name: "Ddos",
  data() {
    return {};
  },
  mounted() {
    this.options();
  },
  methods: {
    options() {
      let geoCoorddata = geoCoordData;
      let citys = [];
      for (let prop in geoCoorddata) {
        citys.push({ name: prop, coord: geoCoorddata[prop] });
      }

      var datas = [];
      // 注意：foreach只能遍历数组，三个参数位置不能颠倒
      // city：citys里面的单条数据
      // index：下标
      // citys：整个数组
      citys.forEach((city, idnex, citys) => {
        // Math.floor() 向下取整
        // Math.random() 函数返回一个浮点,  伪随机数在范围[0，1)
        let temp = Math.floor(Math.random() * citys.length);
        datas.push({
          name: city.name,
          toname: citys[temp].name,
          coords: [city.coord, citys[temp].coord]
        });
      });
      let series = []; //在地图上显示的数据
      [["北京", BJData], ["上海", SHData], ["广州", GZData]].forEach(
        (item, index) => {
          series.push(
            {
              type: "lines",
              map: "china",
              coordinateSystem: "bmap",
              //所有图形的 zlevel 值。zlevel用于 Canvas 分层，
              // 不同zlevel值的图形会放置在不同的 Canvas 中，Canvas 分层是一种常见的优化手段。我们可以把一些图形变化频繁（例如有动画）的组件设置成一个单独的zlevel。
              // 需要注意的是过多的 Canvas 会引起内存开销的增大，在手机端上需要谨慎使用以防崩溃。zlevel 大的 Canvas 会放在 zlevel 小的 Canvas 的上面。
              zlevel: 1,
              // 线数据集。  从哪个城市to哪个城市
              data: datas,
              //线上面的动态特效
              effect: {
                show: true, //是否显示特效。
                period: 4, //特效动画的时间，单位为 s。
                trailLength: 0.2, //特效尾迹的长度。取从 0 到 1 的值，数值越大尾迹越长。
                color: "#fff", //射线颜色
                symbolSize: [3, 5] //特效标记的大小，可以设置成诸如 10 这样单一的数字，也可以用数组分开表示高和宽，例如 [20, 10] 表示标记宽为20，高为10。
              },
              lineStyle: {
                //normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式。
                normal: {
                  width: "", //线宽。
                  color: "#a6c84c", //线的颜色。 默认从option.color 调色盘 获取颜色
                  curveness: 0.3 //边的曲度，支持从 0 到 1 的值，值越大曲度越大。
                }
              }
            },
            {
              // effectScatter：带有涟漪特效动画的散点（气泡）
              type: "effectScatter",
              mapType: "china",
              name: "BeiJing",
              coordinateSystem: "bmap",
              zlevel: 3,
              data: [
                {
                  name: "",
                  value: geoCoorddata["北京"]
                }
              ],
              //rippleEffect:涟漪特效相关配置
              rippleEffect: {
                period: 1, //动画的周期，秒数。
                scale: 2.5, //动画中波纹的最大缩放比例
                brushType: "fill" //波纹的绘制方式，可选 'stroke' 和 'fill'。
              }
            },
            {
              type: "effectScatter",
              coordinateSystem: "bmap",
              zlevel: 2,
              rippleEffect: {
                brushType: "stroke" //波纹的绘制方式，还有一种就是“fill(默认)”
              },
              // symbolSize:标记的大小，可以设置成诸如 10 这样单一的数字，也可以用数组分开表示宽和高，例如 [20, 10] 表示标记宽为20，高为10。
              //散点的尺寸，当数据加载完成之后执行回调，通过返回值来设置大小
              symbolSize: function(val) {
                if (val[2] >= 10000) {
                  return val[2] / 200 + 30;
                } else if (val[2] >= 5000) {
                  return val[2] / 250 + 30;
                } else if (val[2] >= 1000) {
                  return val[2] / 100 + 10;
                } else if (val[2] >= 10) {
                  return 20;
                } else {
                  return 10;
                }
              },
              showEffectOn: "render", //配置何时显示特效。'render' 绘制完成后显示特效。'emphasis' 高亮（hover）的时候显示特效。
              //图形样式。
              itemStyle: {
                normal: {
                  color: "#a6c84c", //图形的颜色
                  opacity: 0.05 //图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                }
              },
              data: item[1].map(function(dataItem) {
                return {
                  name: dataItem[1].name.concat(":" + [dataItem[1].value]),
                  value: geoCoorddata[dataItem[1].name].concat([
                    dataItem[1].value
                  ])
                };
              })
            }
          );
        }
      );
      let options = {
        //设置标题文本
        title: {
          text: "模拟迁徙",
          subtext: "数据纯属虚构", //副标题
          left: "center", //组件离左侧的距离
          top: "4%", //标题距离顶部的距离
          textStyle: {
            //文本样式
            color: "#fff"
          }
        },
        bmap: {
          center: [113.65, 34.76],
          zoom: 5,
          roam: true,
          mapStyle: MapStyle
        },
        tooltip: {
          show: true, //是否显示提示框组件，包括提示框浮层和 axisPointer。
          trigger: "item", //触发类型。
          formatter: "{b}", //提示框浮层内容格式器，支持字符串模板和回调函数两种形式。
          padding: [5, 10],
          transitionDuration: 0.2
        },
        series: series
      };
      options.series[0].data = datas;
      let myChart = this.$echarts.init(document.getElementById("map"));
      myChart.setOption(options);
    }
  }
};
</script>

<style lang="less" scoped>
#map {
  width: 100%;
  height: 100vh;
}
</style>