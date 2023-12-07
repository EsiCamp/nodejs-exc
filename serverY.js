const http = require("http");
const fs = require("fs");

const serverY = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

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
  } else if (req.method === "GET" && req.url === "/getList") {
    try {
      const jsonData = fs.readFileSync("data.json", "utf8");
      const userList = JSON.parse(jsonData);

      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      });
      res.end(JSON.stringify(userList));
    } catch (error) {
      console.error("Error reading data from JSON file:", error.message);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    }
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
