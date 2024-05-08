import HTTP from "http";
import FS from "fs/promises";
import path, { extname } from "path";
import url from "url";

const readFile = async (file_name) => {
  try {
    const content = await FS.readFile(file_name, "utf-8");
    return content;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const PORT = process.env.PORT || 8080;
const Server = () =>
  HTTP.createServer(async (req, res) => {
    const q = url.parse(req.url);
    let file_name = "./public" + (req.url === "/" ? "/index" : q.pathname);
    console.log(req.url);
    const Extension = extname(file_name);
    if (!Extension) {
      file_name += ".html";
    }
    let ContentType;
    switch (Extension) {
      case ".js":
        ContentType = "text/javascript";
        break;

      case ".css":
        ContentType = "text/css";
        break;
      case ".json":
        ContentType = "application/json";
        break;
      case ".png":
        ContentType = "image/png";
        break;
      case ".jpeg":
        ContentType = "image/jpeg";
        break;
      default:
        ContentType = "text/html";
    }

    try {
      const content = await readFile(file_name);
      res.writeHead(200, { "Content-Type": ContentType });
      res.write(content);
      console.log("Server is running on port:", PORT);
      return res.end();
    } catch (error) {
      const not_found = await FS.readFile("./public/404.html");
      res.writeHead(404, { "Content-Type": "text/html" });
      res.write(not_found);
      console.log("File not found!");
      return res.end();
    }
  }).listen(PORT, () => {
    console.log("Server is running on ", PORT);
  });

Server();
