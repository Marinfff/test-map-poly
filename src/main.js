import Vue from "vue";
import App from "./App.vue";
import { Loader } from "google-maps";
const loader = new Loader("AIzaSyB1SpMpjZYjPiFX8289GrH4eNXd4ZUNy9w", {});
Vue.prototype.$google = loader.load();

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
