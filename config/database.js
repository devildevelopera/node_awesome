//Set up mongoose connection
const mongoose = require('mongoose');
const mongoDB = 'mongodb://localhost/awesome';
mongoose.set('useCreateIndex', true);
mongoose.connect(mongoDB, {
    user: "",
    pass: "",
    useUnifiedTopology: true,
    useNewUrlParser: true 
})
.then(() => console.log('DB Connected'))
.catch(err => {
    console.log(err);
});
mongoose.Promise = global.Promise;
module.exports = mongoose;