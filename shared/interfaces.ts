export interface AuctionInfo {
  endTs: number;
  bidValue: number;
  char: Character;
}
export interface Character {
  Name: string;
  Level: string;
  Vocation: string;
  Sex: "Male" | "Female";
  World: string;
  OutfitSrc: string;
}
