define(function(require, exports, module) {
    var MetaHandler = function(){
        //MONOSTATE
        if(MetaHandler.prototype.instance){
            return MetaHandler.prototype.instance;
        }
       var me = this;
       var meta = {},_els;
       /**
        * 初始化
        * _els
        * meta = {name:{content:String,seriation:Array,store:{property:String},...},...}
        * @method init
        */
       function init(){
           _els = document.getElementsByTagName('meta');
           for(var i=0;i<_els.length;i++){
               var name = _els[i].name;
               if(name){
                   meta[name] = {};
                   meta[name].el = _els[i];
                   meta[name].content = _els[i].content;
                   meta[name].seriation = meta[name].content.split(',');
                   meta[name].store = getContentStore(name);
               }
           }    
           return me;
       }
       function getContentStore(name){
           var content = meta[name].seriation,store = {};
           for(var i=0;i<content.length;i++){
               if(content[i].length<1){
                   content[i] = null;
                   delete content[i];
                   content.length--;
               }else{
                   var ct = content[i].split('='),
                       pp = ct[0];
                   if(pp){
                       store[pp] = ct[1];
                   }
               }
           }               
           return store;
       }
       this.hasMeta = function(name){
           return meta[name]?1:0;
       }
       this.createMeta = function(name){
           if(!this.hasMeta(name)){
               var el = document.createElement('meta');
               el.name = name;
               document.head.appendChild(el);
               meta[name] = {};
               meta[name].el = el;
               meta[name].content = '';
               meta[name].seriation = [];
               meta[name].store = {};
           }
           return me;
       }
       this.setContent = function(name,value){
           meta[name].content = value;
           meta[name].el.content = value;
           return me;
       }
       this.getContent = function(name){
           return meta[name] && meta[name].content;
       }
       function updateContent(name){
           meta[name].content = meta[name].seriation.join(',');
           me.setContent(name,meta[name].content);
           return me;
       }
       this.removeContentProperty = function(name,property){
           var _property = property;
           if(meta[name]){
               if(meta[name].store[_property]!=null){
                   for(var i = 0;i<meta[name].seriation.length;i++){
                       if(meta[name].seriation[i].indexOf(property+'=')!=-1){
                           meta[name].seriation[i] = null;
                           delete meta[name].seriation[i];
                           break;
                       }
                   }
               }     
               updateContent(name); 
           }
           return me;       
       }
       this.getContentProperty = function(name,property){
           return meta[name] && meta[name].store[property];
       }
       this.setContentProperty = function(name,property,value){
           var _property = property,
               pv = property+'='+value;
           if(meta[name]){
               if(meta[name].store[_property]!=null){
                   meta[name].store[_property] = value;
                   for(var i = 0;i<meta[name].seriation.length;i++){
                       if(meta[name].seriation[i].indexOf(property+'=')!=-1){
                           meta[name].seriation[i] = pv;
                           break;
                       }
                   }
               }else{
                   meta[name].store[_property] = value;
                   meta[name].seriation.push(pv);
               }
               updateContent(name);
           }
           return me;
       }
       init();
        //MONOSTATE
        MetaHandler.prototype.instance = this;
    };
    
    return new MetaHandler;
});
