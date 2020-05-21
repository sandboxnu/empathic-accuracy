const bcrypt = require("bcrypt");

if (require.main === module) {
  console.log(bcrypt.hashSync(process.argv[2], 10));
}
