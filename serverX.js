const http = require("http");
const qs = require("querystring");

const serverX = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

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
  } else if (req.method === "GET" && req.url === "/getList") {
    const options = {
      hostname: "localhost",
      port: 8082,
      path: "/getList",
      method: "GET",
    };

    const reqY = http.request(options, (resY) => {
      let responseData = "";

      resY.on("data", (data) => (responseData += data));

      resY.on("end", () => {
        console.log("Response from Server Y:", responseData); // Log the response

        if (resY.statusCode === 200) {
          try {
            const userList = JSON.parse(responseData);
            res.writeHead(200, {
              "Content-Type": "application/json",
            });
            res.end(JSON.stringify(userList));
          } catch (error) {
            console.error(
              "Error parsing user list from Server Y:",
              error.message
            );
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal Server Error");
          }
        } else {
          console.error(
            "Error in response from Server Y. Status code:",
            resY.statusCode
          );
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
        }
      });
    });

    reqY.on("error", (error) => {
      console.error(`Error making request to Server Y: ${error.message}`);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    });

    reqY.end();
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("Page Not Found!");
  }
});

const PORT_X = 8080;

serverX.listen(PORT_X, () => {
  console.log(`Server X is running at http://localhost:${PORT_X}`);
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
