var express = require("express");
var app = express();
var redis = require("redis");
var client = redis.createClient();

// serve static files from public directory
app.use(express.static("public"));

//from StackO
client.on("connect", () => console.log("Connected to Redis!"));
client.on("error", (err) => console.log("Redis Client Error", err));
client.connect();

// init values

// client.set(
//   "header",
//   4,
//   "left",
//   1,
//   "article",
//   3,
//   "right",
//   5,
//   "footer",
//   2
// );

async function setter() {
  await client.set("header", 1);
  await client.set("left", 2);
  await client.set("article", 3);
  await client.set("right", 4);
  await client.set("footer", 5);
}
setter();

async function data() {
  console.log("accessed data()");
  // return new Promise((resolve, reject) => {
  //   client.mGet(
  //     ["header", "left", "article", "right", "footer"],
  //     function (err, value) {
  //       const data = {
  //         header: Number(value[0]),
  //         left: Number(value[1]),
  //         article: Number(value[2]),
  //         right: Number(value[3]),
  //         footer: Number(value[4]),
  //       };
  //       err ? reject(null) : resolve(data);
  //     }
  //   );
  // });

  const heado = await client.get("header");
  console.log("value: " + heado);
  const lefto = await client.get("left");
  console.log("lefto: " + lefto);
  const righto = await client.get("right");
  console.log("righto: " + righto);
  const articlo = await client.get("article");
  console.log("articlo: " + articlo);
  const footo = await client.get("footer");
  console.log("footo: " + footo);
  return [heado, lefto, articlo, righto, footo];
}

data();

// get key data
app.get("/data", function (req, res) {
  data().then((data) => {
    console.log(data);
    res.send(data);
  });
});

// plus
app.get("/update/:key/:value", async function (req, res) {
  console.log("update route");
  const key = req.params.key;
  console.log("key: " + key);
  let value = Number(req.params.value);
  console.log("value: " + value);

  //starter code
  // client.get(key, function (err, reply) {
  //   // new value
  //   value = Number(reply) + value;
  //   console.log("new value: " + value);
  //   client.set(key, value);

  //   // return data to client
  //   data().then((data) => {
  //     console.log(data);
  //     res.send(data);
  //   });
  // });

  const respon = await client.get(key);
  console.log("value in update: " + respon);
  const updValue = Number(value) + Number(respon);
  console.log(updValue);
  client.set(key, updValue);
  const newKey = await client.get(key);
  console.log("newKey: " + newKey);
  return newKey;
});

app.listen(3000, () => {
  console.log("Running on 3000");
});

process.on("exit", function () {
  client.quit();
});
