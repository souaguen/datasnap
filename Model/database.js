const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27042/myNoSQl', { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

module.exports.mongoose = mongoose;