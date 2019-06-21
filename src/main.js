import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
// import Antd from 'ant-design-vue'
import "echarts/extension/bmap/bmap";
// import 'ant-design-vue/dist/antd.css'
import echarts from 'echarts'


Vue.prototype.$echarts = echarts;
// Vue.use(Antd);


Vue.config.productionTip = true;
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");