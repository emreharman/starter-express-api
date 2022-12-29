const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const Form = require("./models/Form");
const Subscribe = require("./models/Subscribers");
const PORT = process.env.PORT || 3004;
const axios=require("axios")

//connect db
mongoose.connect(
  "mongodb+srv://emrehrmn:05101990emre.@cluster0.qdewo.mongodb.net/onecv-landing?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    app.listen(PORT, () =>
      console.log(`DB Connection is ok, listening port:${PORT}`)
    );
  }
);
app.get("/", (req, res) => {
  res.send("Welcome to OneCV landing server");
});
app.use(express.json());
app.use(cors({ origin: "*" }));

app.post("/get-forms", async (req, res) => {
  try {
    const body = req.body;
    if (!body.username || !body.pass) {
      return res.json({ status: 400, message: "Yetkisiz işlem" });
    }
    if (body.username !== "emrehrmn" || body.pass !== "onecvlandingapi") {
      return res.json({ status: 400, message: "Yetkisiz işlem" });
    }
    const forms = await Form.find({});
    res.json({ status: 200, forms });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: "Server'da bir hata oluştu" });
  }
});

app.post("/add-form", async (req, res) => {
  try {
    const { body } = req;
    const form = new Form({
      name: body.name,
      surname: body.surname,
      email: body.email,
      message: body.message,
      date: body.date,
    });
    const savedForm = await form.save();
    const subscribers = await Subscribe.find({});
    console.log("------",subscribers)
    for(let i=0;i<subscribers.length;i++){
      var data = JSON.stringify({
        "data": {},
        "notification": {
          "body": `${body.email} kişisinden yeni iletiniz var.`,
          "title": "Yeni Mesaj"
        },
        "to": subscribers[i].token
      });
      
      var config = {
        method: 'post',
        url: 'https://fcm.googleapis.com/fcm/send',
        headers: { 
          'Authorization': 'key=AAAARd-8OUQ:APA91bF-CNlLU1CRXFSDegNTyRZmtcANZlXDxNyXyW-o1f4yphd936Il7xCakkvuo4uOepUe6CDnN6HO44-_B4ROUyAcKKcXS5iDB_VVj5wgR-7Bm8XS_6Xk1uSqjG6pz32Od9fdQqif', 
          'Content-Type': 'application/json'
        },
        data : data
      };
      
      axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
    }
    
    res.json({ status: 200, message: "Form başarıyla gönderildi", savedForm });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: "Server'da bir hata oluştu" });
  }
});

app.post("/add-subscriber", async (req, res) => {
  try {
    const { body } = req;
    const isExist=await Subscribe.findOne({token:body.token})
    if(isExist) return res.json({status:400,message:"Kullanıcı zaten var"})
    const subscribe = new Subscribe({
      token: body.token,
    });
    const saved = await subscribe.save();
    res.json({ status: 200, message: "Başarıyla eklendi", saved });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: "Server'da bir hata oluştu" });
  }
});
