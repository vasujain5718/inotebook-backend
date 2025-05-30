const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URI;
const connectToMongo = async () => {

    await mongoose.connect(mongoURI).then(() => console.log("Connected to mongo db")).catch((e) => console.log(e.message))


}
module.exports = connectToMongo;