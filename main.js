const http = require("http");
const qs = require("querystring");

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/insert") {
    let body = "";

    req.on("data", (data) => (body += data));

    req.on("end", () => {
      const formData = qs.parse(body);
      console.log("Received form data:", formData);

      res.writeHead(200, { "Content-Type": "text/html" });
      res.write("<h1>Form Data Received</h1>");
      res.write(`<p>Username: ${formData.username}</p>`);
      res.write(`<p>Mobile: ${formData.mobile}</p>`);
      res.write(`<p>Password: ${formData.password}</p>`);
      res.end();
    });
  } else {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("Hello World!!");
    res.end();
  }
});

const PORT = 8080;

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
