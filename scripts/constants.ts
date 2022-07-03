export const CONTRACTS: Record<string, string> = {
  FanTokenFactory: "FanTokenFactory",
  FanToken: "FanToken",
  VestingWalletFactory: "VestingWalletFactory",
  VestingWallet: "VestingWallet",
};

type TokenArgs = {
  name: string;
  symbol: string;
  supply: number;
  to: string;
};

type Tokens = {
  [key: string]: TokenArgs;
};

export const TOKENS: Tokens = {
  DAVLET: {
    name: "Davlet Yagshy Token",
    symbol: "DVT",
    supply: 100000000,
    to: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  },
};

export const VESTINGS = {
  DAVLET: {
    
  }
}
