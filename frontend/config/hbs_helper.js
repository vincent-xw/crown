module.exports = (Handlebars)=>{
    Handlebars.registerHelper('list', function(items, options) {
        var out = '';
        
        for(var i=0, l=items.length; i<l; i++) {
            let value = items[i] ? items[i]:{'number':"----"};
            out += '<div class="priseArr col-md-1 col-3 clearPadding text-center"><p>' + options.fn(value) + '</p></div>';
        }
        
        return out;
    });
}