const http = require("http");
const qs = require("querystring");

const serverX = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/insert") {
    let body = "";

    req.on("data", (data) => (body += data));

    req.on("end", () => {
      const formData = qs.parse(body);
      console.log("Received form data:", formData);

      sendDataToServerY(formData);

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`
        <h1>Form Data Received on Server X</h1>
        <p>Username: ${formData.username}</p>
        <p>Mobile: ${formData.mobile}</p>
        <p>Password: ${formData.password}</p>
      `);
    });
  } else {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("Hello from Server X!");
  }
});

const PORT_X = 8080;

serverX.listen(PORT_X, () => {
  console.log(`Server is running at http://localhost:${PORT_X}`);
});

function sendDataToServerY(data) {
  const options = {
    hostname: "localhost",
    port: 8082,
    path: "/receive",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const req = http.request(options, (res) => {
    let responseData = "";
    res.on("data", (data) => (responseData += data));
    res.on("end", () => {
      console.log("Received response from Server Y:", responseData);
    });
  });

  req.on("error", (error) => {
    console.error(`Error sending data to Server Y: ${error.message}`);
  });

  req.write(JSON.stringify(data));
  req.end();
}
