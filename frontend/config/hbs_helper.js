module.exports = (Handlebars)=>{
    Handlebars.registerHelper('list', function(items, options) {
        var out = '';
        
        for(var i=0, l=items.length; i<l; i++) {
            out += '<div class="col-1 clearPadding text-center" ><p>' + options.fn(items[i]) + '</p></div>';
        }
        
        return out;
    });
}