const http = require("http");
const fs = require("fs");

const serverY = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/receive") {
    let body = "";

    req.on("data", (data) => (body += data));

    req.on("end", () => {
      const formData = JSON.parse(body);
      console.log("Received form data on Server Y:", formData);

      saveDataToJSON(formData);

      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Data received on Server Y!");
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("Page Not Found!");
  }
});

const PORT_Y = 8082;

serverY.listen(PORT_Y, () => {
  console.log(`Server Y is running at http://localhost:${PORT_Y}`);
});

function saveDataToJSON(newUserData) {
  let jsonData = fs.readFileSync("data.json", "utf8");

  let usersArray = jsonData ? JSON.parse(jsonData) : [];

  if (!Array.isArray(usersArray)) {
    usersArray = [];
  }

  usersArray.push(newUserData);

  jsonData = JSON.stringify(usersArray, null, 2);

  fs.writeFileSync("data.json", jsonData);
}
