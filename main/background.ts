import { BrowserWindow, app } from "electron";
import serve from "electron-serve";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { initIpcPuppeteer } from "./puppetter";

puppeteer.use(StealthPlugin());

const isProd: boolean = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();
  initIpcPuppeteer();

  const mainWindow = new BrowserWindow({
    width: 450,
    height: 700,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
    },
    show: false,
  });

  if (isProd) {
    mainWindow.setMenu(null);
    await mainWindow.loadURL("app://./home.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
})();

app.on("window-all-closed", () => {
  app.quit();
});
