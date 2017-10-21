"use strict";

var post_api_url = "https://awiclass.monoame.com/api/command.php?type=get&name=post";

Vue.component('postbox', {
  template: "#post",
  props: ['post', 'catas'],
  data: function data() {
    return {};
  },

  computed: {
    coverurl: function coverurl() {
      if (this.post.cover[0] == "/") return "http://zashare.org/" + this.post.cover;else return this.post.cover;
    },
    covercss: function covercss() {
      return { 'background-image': 'url(' + this.coverurl + ')' };
    },
    cata_name: function cata_name() {
      var _this = this;

      return this.catas.filter(function (cata) {
        return cata.tag == _this.post.tag;
      })[0].name;
    }
  },
  methods: {
    openlink: function openlink() {
      window.open("http://zashare.org/post/n/" + this.post.title);
    }
  }
});
var vm = new Vue({
  el: "#app",
  data: {
    posts: [],
    catas: [],
    filter: ""
  },
  mounted: function mounted() {
    var vobj = this;
    $.get(post_api_url).then(function (res) {
      vobj.posts = JSON.parse(res);
    });
    $.get("https://awiclass.monoame.com/api/command.php?type=get&name=cata").then(function (res) {
      vobj.catas = JSON.parse(res);
    });
  },

  computed: {
    filtered_post: function filtered_post() {
      var _this2 = this;

      return this.posts.filter(function (p) {
        var field = ["title", "description", "name_short"];
        var contain_flag = false;
        field.forEach(function (f) {
          if (p[f].toLowerCase().indexOf(_this2.filter.toLowerCase()) != -1) contain_flag = true;
        });
        return contain_flag;
      }).map(function (p) {
        p.description = p.description.substr(0, 90) + "...";
        return p;
      }).map(function (p) {
        if (_this2.filter == "") return p;
        var cache = JSON.parse(JSON.stringify(p));
        var field = ["title", "description", "name_short"];
        field.forEach(function (f) {
          var regex = new RegExp(_this2.filter, "i");
          var match = cache[f].match(regex);
          console.log(match);
          if (match) cache[f] = cache[f].replace(regex, "<span class='highlight'>" + match[0] + "</span>");
        });

        console.log(cache.tag);
        return cache;
      }).sort(function (a, b) {
        return a.tag.charCodeAt(0) - b.tag.charCodeAt(0);
      });
    }
  }

});
