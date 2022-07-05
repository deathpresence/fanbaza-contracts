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
    to: "0x2D00763b93d5bFFe2Aa36f05fEe3e44EF4533b87",
  },
};

export const VESTING_WALLETS: Record<string, any> = {
  DAVLET: {
    beneficiary: "0x96C8cD732a30b038f01FCefA54dfC8feA0640Aa6",
    start: 1657011600,
    schedule: [
      0, 0, 833, 0, 0, 833, 0, 0, 833, 0, 0, 833,
      0, 0, 833, 0, 0, 833, 0, 0, 833, 0, 0, 833,
      0, 0, 833, 0, 0, 833, 0, 0, 833, 0, 0, 837
    ]
  }
}
