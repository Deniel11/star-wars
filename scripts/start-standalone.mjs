import os from "node:os";

const port = process.env.PORT || "3000";
const interfaces = os.networkInterfaces();

const localIp = Object.values(interfaces)
  .flat()
  .find(
    (network) =>
      network &&
      network.family === "IPv4" &&
      !network.internal
  )?.address;

process.env.HOSTNAME = "0.0.0.0";
process.env.PORT = port;

const originalLog = console.log.bind(console);

console.log = (...args) => {
  if (typeof args[0] === "string") {
    if (args[0].includes("- Local:")) {
      args[0] = args[0].replace(
        "http://0.0.0.0:",
        "http://localhost:"
      );
    }

    if (args[0].includes("- Network:")) {
      args[0] = args[0].replace(
        "http://0.0.0.0:",
        `http://${localIp || "localhost"}:`
      );
    }
  }

  originalLog(...args);
};

await import("../.next/standalone/server.js");