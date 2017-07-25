var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogpostSchema = new Schema({
  postId: String,
  title: String,
  content: String,
  // date: { 
  //   type: Date, 
  //   default: Date.now 
  // },
  // published: Boolean,
  // hidden: Boolean,
  // meta: {
  //   favs: {
  //     type: Number,
  //     default: 0
  //   }
  // }
});

module.exports = mongoose.model('Blogpost', blogpostSchema)