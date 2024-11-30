export const CONTRACT_ADDRESS = '0x1cd8a2cea2e5af7fdfe6d040973a71ff45bdc727';
export const TREASURY_ADDRESS = '0x4D3Dd1A8ceFEC50e471d9895726c516786fb84e5';
export const BRETT_ADDRESS = '0x532f27101965dd16442E59d40670FaF5eBB142E4';
export const WETH_ADDRESS = '0x4200000000000000000000000000000000000006';
export const USDC_ADDRESS = '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA';
export const METH_ETH_PAIR = '0x1cd8a2cea2e5af7fdfe6d040973a71ff45bdc727';
export const BRETT_ETH_PAIR = '0x36a46dff597c5a444bbc521d26787f57867d2214';
export const ETH_USD_PRICE_FEED = '0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70';
export const GENESIS_SALE_ADDRESS = "0x7d964E6292866be8528ae238e56459D367B2d05A";

export const METH_TOKEN_ABI = [
  // ERC20 Standard
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  
  // Custom functions
  "function mint(address to, uint256 amount) public",
  "function treasury() view returns (address)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

export const TREASURY_ABI = [
  // View functions
  "function methToken() view returns (address)",
  "function brettToken() view returns (address)",
  "function usdcToken() view returns (address)",
  "function methHoldings(address) view returns (uint256)",
  "function brettRewards(address) view returns (uint256)",
  "function BUY_TAX() view returns (uint256)",
  "function SELL_TAX() view returns (uint256)",
  "function DEV_SHARE() view returns (uint256)",
  "function DEV_WALLET() view returns (address)",
  "function TREASURY_WALLET() view returns (address)",
  "function BRETT_TOKEN_ADDRESS() view returns (address)",
  "function methEthPair() view returns (address)",
  
  // Price functions
  "function getETHPrice() view returns (uint256)",
  "function getMETHPrice() view returns (uint256)",
  "function getBRETTPrice() view returns (uint256)",
  "function getPriceChange(string) view returns (int256)",
  
  // TVL functions
  "function getETHBalance() view returns (uint256)",
  "function getUSDCBalance() view returns (uint256)",
  
  // Trading functions
  "function buyMeth() payable external",
  "function buyMethWithUSDC(uint256 amount) external",
  "function sellMeth(uint256 amount) external",
  "function sellMethForUSDC(uint256 amount) external",
  
  // Admin functions
  "function updatePrices() external",
  "function setMethToken(address) external",
  "function setMethEthPair(address) external"
];

export const USDC_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

export const CHAINLINK_PRICE_FEED_ABI = [
  "function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)",
  "function decimals() external view returns (uint8)"
];

export const UNISWAP_PAIR_ABI = [
  "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function token0() external view returns (address)",
  "function token1() external view returns (address)",
  "function price0CumulativeLast() external view returns (uint)",
  "function price1CumulativeLast() external view returns (uint)",
  "function totalSupply() external view returns (uint)",
  "function balanceOf(address) external view returns (uint)"
];

export const BRETT_ABI = [
  // Core ERC20 functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  
  // Brett-specific functions
  "function buyTotalFees() view returns (uint256)",
  "function sellTotalFees() view returns (uint256)",
  "function maxTransaction() view returns (uint256)",
  "function maxWallet() view returns (uint256)",
  "function isExcludedFromFees(address account) view returns (bool)",
  "function tradingActive() view returns (bool)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

export const GENESIS_SALE_ABI = [
  "function startSale() external",
  "function buyWithWETH(uint256 wethAmount) external",
  "function buyWithUSDC(uint256 usdcAmount) external",
  "function addLiquidityAfterSale() external",
  "function isSaleActive() public view returns (bool)",
  "function remainingMeth() public view returns (uint256)",
  "function timeRemaining() public view returns (uint256)"
];

// Contract Addresses
export const METH_CONTRACT_ADDRESS = CONTRACT_ADDRESS;
export const BRETT_CONTRACT_ADDRESS = BRETT_ADDRESS;
export const WETH_CONTRACT_ADDRESS = WETH_ADDRESS;
export const USDC_CONTRACT_ADDRESS = USDC_ADDRESS;

// Contract ABIs
export const METH_ABI = METH_TOKEN_ABI;
export const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint amount)"
];