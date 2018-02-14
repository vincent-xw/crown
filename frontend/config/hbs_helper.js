module.exports = (Handlebars)=>{
    Handlebars.registerHelper('list', function(items, options) {
        var out = '';
        
        for(var i=0, l=items.length; i<l; i++) {
            out += '<div class="priseArr col-md-1 col-3 clearPadding text-center"><p>' + options.fn(items[i]) + '</p></div>';
        }
        
        return out;
    });
}