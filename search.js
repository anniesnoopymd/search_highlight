var post_api = "https://awiclass.monoame.com/api/command.php?type=get&name=post";

Vue.component("postbox",{
   template: "#post",
   props: ["post"],
   computed: {
      coverurl (){
         console.log(this.post.cover);
         if(this.post.cover.indexOf("http")!=-1){
            return this.post.cover;
         }else{
            return "http://zashare.org" + this.post.cover;
         }
      },
      covercss (){
         return {"background-image":'url('+this.coverurl+')'};
      }
   }
});
var vm = new Vue({
   el: "#app",
   data: {
      posts: [],
      filter: ""
   },mounted (){
      var vobj = this;
      $.get(post_api).then(function(res){
         console.log(res);
         vobj.posts = JSON.parse(res);
      });
   },computed:{
      filtered_post: function(){
         var vobj = this;
         return this.posts.filter((post)=>{
            var tag=["title","description","name_short"];
            var flag = false;
            tag.forEach(function(now_tag){
               console.log(post[now_tag]);
               if (post[now_tag].indexOf(vobj.filter)!= -1){
                  flag = true;
               }
            });
            return flag;
         }).map(function(post){
            var temp_post = JSON.parse(JSON.stringify(post));
            temp_post.description = temp_post.description.substr(0,60);

            if(vobj.filter==""){
               return temp_post;
            }
            var tag=["title","description","name_short"];
            tag.forEach(function(now_tag){
               temp_post[now_tag] = temp_post[now_tag].replace(vobj.filter,"<span class=highlight>"+vobj.filter+"</span>");
            });
            temp_post.title = temp_post.title.replace(vobj.filter,"<span class=highlight>"+vobj.filter+"</span>");
            return temp_post;
         });
      }
   }
});
