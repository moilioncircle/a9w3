/* load class */
var text = document.body.innerText || document.body.textContent;
var root = A9Loader.getPagePath();
var base = document.getElementsByTagName("BASE");
if(base != null && base.length>0) root = base[0].href;

A9Loader.asyncLoadClass('com.trydofor.a9js.ui.pgbar');
A9Loader.asyncLoadClass('com.trydofor.a9text.parser.a9text');
A9Loader.asyncLoadClass('com.trydofor.a9text.render.html.a9text');
A9Loader.runAfterClassLoaded(function(){
try{
    var pgbar = new ProgressBar(window.document);
    pgbar.show();
    pgbar.work(1,'parsing ...');
    var a9dom = new A9Dom(null,A9Dom.type.root); //com.trydofor.a9text.A9Dom
    a9dom.setText(text.replace(/^[\r\n]+/,''));
    a9dom.putInfo(A9Dom.type.root$path,root);
    var a9tParser = new A9TextParser();
    a9tParser.setProgressBar(pgbar);
    a9tParser.parse(a9dom,function(prdom){
            var a9tRender = new A9TextRender();
            pgbar.work(-100,'rendering ...');
            a9tRender.setProgressBar(pgbar);
            a9tRender.render(prdom,function(rrdom){
                pgbar.done();
                var data = rrdom.getData();
                var linkCss = "";
                for(var i =0; i< data['linkcss'].length; i++)
                    linkCss += "<link href='"+data['linkcss'][i]+"' rel='stylesheet' type='text/css' />";
                var linkJs = "";
                for(var i =0; i< data['linkjs'].length; i++)
                    linkJs += "<scr"+"ipt type='text/javascript' src='"+data['linkjs'][i]+"'></scr"+"ipt>";
                var a9htm = linkCss+linkJs+data['htmltext'];
                
                // ie problem
                window.setTimeout(function (){
                    var baseHtm = "<base href='";
                    var basetags = document.getElementsByTagName("base");
                    if(basetags != null && basetags.length>0){
                        baseHtm+=basetags[0].href;
                    }else{
                        baseHtm+=window.location;
                    }
                    baseHtm+="'>\n";
                    document.body.innerHTML="";
                    document.open();
                    document.write(baseHtm+a9htm);
                    document.close();
                },1000);
        });
    });
}catch(e){
    alert(e);
}
});
