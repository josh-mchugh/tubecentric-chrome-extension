import Vue from "vue";
import VideoMeta from './components/video-meta/VideoMeta.vue'
import store from "./store";
import $ from "jquery";
import browser from "webextension-polyfill";
import UriTemplate from "uri-template.js";

Vue.config.productionTip = false;

console.log("Hello, on page: " + window.location);

// Initialize the CSS styles for the content script
(function() {
  const link = $("<link>")
    .attr("rel", "stylesheet")
    .attr("href", browser.runtime.getURL("/content-scripts/css/app.css"));
  $("head").append(link);
})();

// Initialize the app when the page is loaded the url matches
(function() {
  if(isVideoEditUrl(window.location.pathname)) {
    initEditPage();
  }
})();

// URL Event Listener
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // listen for messages sent from background.js
  if (request.message === 'URL_CHANGE') {
    console.log(JSON.stringify(request));
    const pathname = new URL(request.url).pathname;
    if(isVideoEditUrl(pathname)) {
      initEditPage();
      const uriInfo = UriTemplate.extract("/video/{videoId}/edit", pathname);
      console.log(uriInfo.videoId);
    }
  }
});

function isVideoEditUrl(pathname) {
  return new RegExp(/\/video\/[\S]*\/edit/i).test(pathname);
}

function initEditPage() {

  // Observe the DOM until the element is present
  var observer = new MutationObserver(function(mutations) {
    
    const leftContainer = $("#left");
    if ($(leftContainer).length) {
      
      if($("#tcAppVideoMeta").length === 0) {
        const appComponent = $("<div>").attr("id", "tcAppVideoMeta");
        $(leftContainer).prepend(appComponent);

        new Vue({
          el: "#tcAppVideoMeta",
          store,
          data: {
            title: "test",
            description: "test",
            tags: ["test"]
          },
          methods: {
            updateTitle: (value) => { this.title = value },
            updateDescription: (value) => { this.description = value },
            initTags: (tags) => { this.tags = tags },
            addTag: (value) => { this.tags.push(value) },
            removeTag: (value) => { this.tags.remove(this.tags.indexOf(value)) }
          },
          mounted: function() {
            var self = this;
            
            // Set change event listener on title text area
            $("#left .title textarea").on("change", function() {
              self.updateTitle($(this).val());
            });

            // Set change event listener on description text area
            $("#left .description textarea").on("change", function() {
              self.updateDescription($(this).val());
            });

            // Set inital tags value
            self.initTags($("#left .tags .chip .text").map((element) => $(element).text()));

            // Add DOM observer for the tags
            var tagsObserver = new MutationObserver(function(mutations){
              mutations.forEach(function(mutation, index) {
                if($(mutation.target).hasClass("chip-and-bar")) {
                  if(mutation.addedNodes.length > 0) {
                    self.addTag($(mutation.addedNodes.item(0)).text());
                  }
                  if($(mutation.removedNodes.item(0)).hasClass("chip")) {
                    self.removeTag($(mutation.removedNodes.item(0)).text());
                  }
                }
              });
            });
            tagsObserver.observe($("#left .tags .chip-and-bar").get(0), { //document.body is node target to observe
              childList: true, //This is a must have for the observer with subtree
              subtree: true //Set to true if changes must also be observed in descendants.
            });
          },
          render: h => h(VideoMeta)
        });
      }

      //We can disconnect observer once the element exist if we dont want observe more changes in the DOM
      this.disconnect();
    }
  });

  // Start observing
  observer.observe($("#main-container").get(0), { //document.body is node target to observe
      childList: true, //This is a must have for the observer with subtree
      subtree: true //Set to true if changes must also be observed in descendants.
  });
}

