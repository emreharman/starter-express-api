const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const Form = require("./models/Form");
const Subscribe = require("./models/Subscribers");
const PORT = process.env.PORT || 3004;

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
    console.log("------"), subscribers;
    var myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        "key=AAAARd-8OUQ:APA91bF-CNlLU1CRXFSDegNTyRZmtcANZlXDxNyXyW-o1f4yphd936Il7xCakkvuo4uOepUe6CDnN6HO44-_B4ROUyAcKKcXS5iDB_VVj5wgR-7Bm8XS_6Xk1uSqjG6pz32Od9fdQqif"
      );
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        data: {},
        notification: {
          body: "test test test",
          title: "test",
        },
        to: "dKF6Qt4GQMiab_lHaRgBz0:APA91bELXcildLhCgbbHI78sk53bi3eXF9GCHVdCSIXMrcPoh6dpFDcvo5aveW66BFFm9d3MMAo4yk1j83JLvyeLxsvQgEvnEZ_0omY09hGviCdjE-Gdcx3WTfQZlLzTk8b_VOiFDFhk",
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch("https://fcm.googleapis.com/fcm/send", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));
    res.json({ status: 200, message: "Form başarıyla gönderildi", savedForm });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: "Server'da bir hata oluştu" });
  }
});

app.post("/add-subscriber", async (req, res) => {
  try {
    const { body } = req;
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
