const { exec } = require("child_process");
require("dotenv").config();

const API_KEY = process.env.TYPESENSE_ADMIN_API_KEY;
const PORT = 8108;

console.log(API_KEY);
console.log(PORT);

const command = `docker run -d -p ${PORT}:8108 -v C:/Users/alflo/OneDrive/Documents/GitHub/Portafolio_Page/react-typesense-instantsearch/:/data \
typesense/typesense:0.26 --data-dir /data --api-key=${API_KEY} --listen-port ${PORT}  --enable-cors`;



console.log(command);

exec(command, (err, stdout, stderr) => {
  if (!err && !stderr) console.log("Typesense Server is running...");

  if (err) {
    console.log("Error running server: ", err);
  }

  if (stderr) {
    console.log("Error running server: ", stderr);
  }

  if (stdout) {
    console.log("Server output: ", stdout);
  }
});
