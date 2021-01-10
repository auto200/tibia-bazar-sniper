import { ipcMain } from "electron";
import { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { AuctionInfo, Character } from "../../shared/interfaces";
import { SELECTORS, URLS } from "./enums";
puppeteer.use(StealthPlugin());

export const initIpcPuppeteer = () => {
  let browser: Browser;

  // step 1
  ipcMain.on("login", async (e, { login, password, showBrowser }) => {
    browser = await puppeteer.launch({ headless: !showBrowser });
    try {
      await loginToTibiaWebsite(browser, login, password);
      e.sender.send("login-success");
    } catch (err) {
      e.sender.send("login-fail", err);
      browser.close();
    }
  });

  // step 2
  ipcMain.on("get-tc-count", async (e) => {
    try {
      await isLoggedIn(browser);
    } catch (err) {
      e.sender.send("logged-off");
      return;
    }

    let tcs;
    try {
      tcs = await getTcCount(browser);
    } catch (err) {}
    e.sender.send("set-tc-count", tcs);
  });

  ipcMain.on("get-auction-info", async (e, url) => {
    try {
      console.log("getting auction info");
      const auctionInfo = await getAuctionInfo(browser, url);
      e.sender.send("set-auction-info", auctionInfo);
    } catch (err) {
      console.log("failed to get auction info");
      e.sender.send("auction-info-error", err);
    }
  });
  // step 3 TODO

  async function loginToTibiaWebsite(
    browser: Browser,
    login: string,
    password: string
  ) {
    const page = await browser.newPage();

    await page.goto(URLS.ACCOUNT_MANAGEMENT);
    await page.waitForSelector(SELECTORS.TIBIA_LOGO);

    await page.type(SELECTORS.LOGIN_FIELD, login);
    await page.keyboard.down("Tab");
    await page.keyboard.type(password);
    await page.keyboard.down("Tab");
    await page.keyboard.down("Enter");
    await page.waitForNavigation();

    //check for login/password error
    const error = await checkForError(page);
    if (error) throw new Error(error);

    //TODO: check for two factor authentication

    await page.close();
  }

  async function checkForError(page: Page) {
    let errorMessage: string;
    try {
      //error div is by default hidden
      await page.waitForSelector(SELECTORS.ERROR_DIV, {
        visible: true,
        timeout: 1000,
      });
      //not passing element from waitForSelector because it throws an error in electron
      errorMessage = await page.evaluate(
        (errDiv) => document.querySelector(errDiv).innerText,
        SELECTORS.ERROR_DIV
      );
    } catch (err) {}
    return errorMessage;
  }

  async function getTcCount(browser: Browser) {
    const page = await browser.newPage();
    await page.goto(URLS.ACCOUNT_MANAGEMENT, { waitUntil: "networkidle2" });

    const TCs = await page.evaluate((rowsSelector) => {
      //Array.from() FAILS xDDDDDDDDDDDD
      const labelCells: HTMLElement[] = [
        ...document.querySelectorAll(rowsSelector),
      ];
      let tcLabelCell;
      //Array.find() fails XDDDDD
      for (const cell of labelCells) {
        if (cell.innerText === "Tibia Coins:") {
          tcLabelCell = cell;
          break;
        }
      }

      const valueCell: HTMLElement = tcLabelCell.nextElementSibling;
      return Number(valueCell.innerText);
    }, SELECTORS.GENERAL_INFORMATION_LABEL_CELL);

    await page.close();

    return TCs;
  }

  async function getAuctionInfo(
    browser: Browser,
    validUrl: string
  ): Promise<AuctionInfo> {
    const page = await browser.newPage();
    await page.goto(validUrl);

    try {
      await page.waitForSelector(SELECTORS.AUCTION_END_TIMER, {
        timeout: 1000,
      });
    } catch (err) {
      throw new Error("Check if auction isn't already ended");
    }

    const endTs = await page.evaluate((timer) => {
      const timerDiv = document.querySelector(timer);
      return Number(timerDiv.dataset.timestamp) * 1000; //original is in unix format
    }, SELECTORS.AUCTION_END_TIMER);

    const bidValue = await page.evaluate((priceSelector) => {
      const price = document
        .querySelector(priceSelector)
        .innerText.replace(",", "");
      return Number(price);
    }, SELECTORS.AUCTION_CURRENT_PRICE);

    const outfitSrc: string = await page.evaluate((outfitSelector) => {
      return document.querySelector(outfitSelector).src;
    }, SELECTORS.AUCTION_CHARACTER_OUTFIT);

    const charInfoString: string = await page.evaluate((infoSelector) => {
      return document.querySelector(infoSelector).innerText;
    }, SELECTORS.AUCTION_CHARACTER_INFO);

    //parse character info
    const [name, charInfo] = charInfoString.split("\n");
    const entries = charInfo.split("|").map((e) => e.split(":"));
    const char: Character = Object.fromEntries(
      entries.map(([key, val]) => {
        if (val) {
          return [key.trim(), val.trim()];
        }
        //Sex has no key, only value
        return ["Sex", key.trim()];
      })
    ) as any;
    char.Name = name;
    char.OutfitSrc = outfitSrc;

    await page.close();

    return { endTs, char, bidValue };
  }

  async function isLoggedIn(browser: Browser) {
    const page = await browser.newPage();
    await page.goto(URLS.ACCOUNT_MANAGEMENT);
    await page.waitForSelector(SELECTORS.TIBIA_LOGO);
    const loggedIn = page.evaluate(
      (selector) => !!document.querySelector(selector),
      SELECTORS.ONLY_WHEN_LOGGED_IN
    );
    if (!loggedIn) {
      throw new Error();
    }
  }
};
