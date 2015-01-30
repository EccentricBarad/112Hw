var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        default: 'New Comment'
    },
    text: String,
    belongsto: {
        type: String,
        required: true,
    }
});

commentSchema.static({
    list: function(callback){
        this.find({}, null, {sort: {_id:-1}}, callback);
    }
})

module.exports = mongoose.model('Comments', commentSchema);
