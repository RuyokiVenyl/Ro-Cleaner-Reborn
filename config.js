require("dotenv").config();

module.exports = {
  serverID: "", // a common server between the self bot and the user (must be joined in)
  token: "", // your discord token

  emojis: {
    online: "\🟢",
    idle: "\🌙",
    dnd: "\⛔",
    offline: "\💿",
  },

  presence: {
    emoji: "👾",
    customStatus: "idk",
    status: "invisible", // online | invisible | dnd | idle
  },
};
