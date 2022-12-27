const mongoose = require("mongoose");

const subscriberSchema = mongoose.Schema({
  token: {
    type: String,
    default:'',
  }
});

module.exports = mongoose.model("Subscribe", subscriberSchema);