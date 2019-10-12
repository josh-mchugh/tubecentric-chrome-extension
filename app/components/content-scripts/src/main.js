import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import $ from "jquery";
import browser from "webextension-polyfill";
import "./styles/main.scss";

Vue.config.productionTip = false;

console.log("Hello Hello! Content script");

(function() {

  const link = $("<link>").attr("rel", "stylesheet")
    .attr("href", browser.runtime.getURL("/content-scripts/css/app.css"));
  
    $("head").append(link);

  const container = $('.input-container.playlists');

  if (container.length > 0) {

    const appComponent = $("<div>").attr("id", "tcApp");
    $(container).append(appComponent)

    new Vue({
      el: "#tcApp",
      router,
      store,
      render: h => h(App)
    });
  }
})();
