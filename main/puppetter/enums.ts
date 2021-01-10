export enum SELECTORS {
  //login
  LOGIN_FIELD = "input[name='loginemail']",
  LOGIN_BUTTON = "input[name='Login'][class='ButtonText']",
  ERROR_DIV = ".ErrorMessage",

  AUTH_EMAIL_CODE_INPUT = "input[name='emailcode']",
  AUTH_TOKEN_CODE_INPUT = "input[name='totp']",

  TIBIA_LOGO = "#TibiaLogoArtworkTop",
  GENERAL_INFORMATION_LABEL_CELL = ".LabelV",
  ONLY_WHEN_LOGGED_IN = "input[src='https://static.tibia.com/images/global/buttons/mediumbutton_myaccount.png']",

  AUCTION_END_TIMER = ".AuctionTimer",
  AUCTION_CURRENT_PRICE = ".ShortAuctionDataValue b",
  AUCTION_CHARACTER_INFO = ".AuctionHeader",
  AUCTION_CHARACTER_OUTFIT = ".AuctionOutfitImage",
}

export enum URLS {
  ACCOUNT_MANAGEMENT = "https://www.tibia.com/account/?subtopic=accountmanagement",
}
