// Importing Modules
const ig = require("./insta.js");
const {username,password} = require("./cridential.js");
require('dotenv').config();

const criusername = username;
const cripassword =password;
const tags = ["#natureshots"];

(async () => {
    await ig.initialize();
    await ig.login(criusername, cripassword);
    await ig.likeTagsProcess(tags);
    await ig.close();
})();
