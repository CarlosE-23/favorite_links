import bcryp from "bcryptjs";

const helpers = {};

helpers.encrypPassword = async (password) => {
  const salt = await bcryp.genSalt(10);
  const hash = await bcryp.hash(password, salt);
  console.log(salt, hash);
  return hash;
};

helpers.matchPassword = async (password, savePassword) => {
  try {
    return await bcryp.compare(password, savePassword);
  } catch (err) {
    console.log(err);
  }
};

export { helpers };
