const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/inotebook";
const connectToMongo = async () => {

    await mongoose.connect(mongoURI).then(() => console.log("Connected to mongo db")).catch((e) => console.log(e.message))


}
module.exports = connectToMongo;