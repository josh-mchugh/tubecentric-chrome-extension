import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

(function() {

  const playlists = document.getElementsByClassName("input-container playlists");
  const right = document.getElementById("right");

  console.log('Hello...');

  if (playlists.length > 0) {

    console.log("Hello Hello! Content script");
    
    const appElement = document.createElement("div");
    appElement.setAttribute("id", "tcApp");

    right.insertBefore(appElement, playlists.nextSibling);

    new Vue({
      el: "#tcApp",
      router,
      store,
      render: h => h(App)
    });
  }
})();
