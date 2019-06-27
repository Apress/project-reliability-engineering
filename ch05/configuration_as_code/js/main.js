const cfg = require('./config').cfg;
for (let fan of cfg.fans) {
  console.log(`${fan.name} uses gpio ${fan.gpio}`);
}