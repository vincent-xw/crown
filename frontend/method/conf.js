module.exports = function(){
    var mongoose = require('mongoose');
    mongoose.connection.openUri('mongodb://xuewen:abc456@localhost:33306/crown');
    var db = mongoose.connection;
    return {
        insert:function(obj,callback){
            
            db.on('error', console.error.bind(console, 'connection error:'));
            // Use connect method to connect to the Server
            return db.once('open',function(err, db) {
                if(err){
                    console.log(err);
                }else{
                    
                }
            });
        }
    };
    
}
