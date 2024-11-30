import { ethers } from 'ethers';
import {
  UNISWAP_PAIR_ABI,
  CHAINLINK_PRICE_FEED_ABI,
  BRETT_ETH_PAIR,
  ETH_USD_PRICE_FEED,
  BRETT_ADDRESS,
  CONTRACT_ADDRESS,
  METH_ETH_PAIR,
  WETH_ADDRESS
} from '../constants';

export class PriceFeed {
  constructor(provider) {
    this.provider = provider;
    this.brettEthPair = new ethers.Contract(BRETT_ETH_PAIR, UNISWAP_PAIR_ABI, provider);
    this.ethUsdPriceFeed = new ethers.Contract(ETH_USD_PRICE_FEED, CHAINLINK_PRICE_FEED_ABI, provider);
    this.methEthPair = new ethers.Contract(METH_ETH_PAIR, UNISWAP_PAIR_ABI, provider);
  }

  async getEthPrice() {
    try {
      const [, answer] = await this.ethUsdPriceFeed.latestRoundData();
      const price = Number(ethers.utils.formatUnits(answer, 8));
      console.log('ETH Price:', price);
      return price;
    } catch (error) {
      console.error('Error fetching ETH price:', error);
      return 0;
    }
  }

  async getMethPrice() {
    try {
      const [reserve0, reserve1] = await this.methEthPair.getReserves();
      const token0 = await this.methEthPair.token0();
      const ethPrice = await this.getEthPrice();
      
      console.log('METH/ETH LP Details:', {
        token0: token0,
        methTokenAddress: CONTRACT_ADDRESS,
        reserve0: ethers.utils.formatEther(reserve0),
        reserve1: ethers.utils.formatEther(reserve1),
        ethPrice: ethPrice
      });

      const isMethToken0 = token0.toLowerCase() === CONTRACT_ADDRESS.toLowerCase();
      const methReserve = isMethToken0 ? reserve0 : reserve1;
      const ethReserve = isMethToken0 ? reserve1 : reserve0;
      
      // Convert reserves to numbers with proper decimals
      const methReserveNum = Number(ethers.utils.formatEther(methReserve));
      const ethReserveNum = Number(ethers.utils.formatEther(ethReserve));
      
      if (methReserveNum === 0) {
        console.error('METH reserve is 0, cannot calculate price');
        return 0;
      }
      
      // Calculate price: (ETH reserve * ETH price) / METH reserve
      const methPriceInEth = ethReserveNum / methReserveNum;
      const methPriceUSD = methPriceInEth * ethPrice;
      
      console.log('METH Price Calculation:', {
        isMethToken0,
        methReserveAmount: methReserveNum,
        ethReserveAmount: ethReserveNum,
        methPriceInEth,
        methPriceUSD,
        targetPrice: 0.00003668
      });
      
      return methPriceUSD;
    } catch (error) {
      console.error('Full error fetching METH price:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        data: error.data,
        stack: error.stack
      });
      return 0;
    }
  }

  async getBrettPrice() {
    try {
      // First, verify the pair contract is accessible
      console.log('Attempting to access BRETT/WETH pair at:', BRETT_ETH_PAIR);
      
      // Get reserves and tokens
      const [reserve0, reserve1] = await this.brettEthPair.getReserves();
      console.log('Raw reserves:', {
        reserve0: reserve0.toString(),
        reserve1: reserve1.toString()
      });

      const token0 = await this.brettEthPair.token0();
      const token1 = await this.brettEthPair.token1();
      const ethPrice = await this.getEthPrice();
      
      console.log('BRETT/WETH LP Contract Info:', {
        pairAddress: BRETT_ETH_PAIR,
        token0: token0.toLowerCase(),
        token1: token1.toLowerCase(),
        brettAddress: BRETT_ADDRESS.toLowerCase(),
        wethAddress: WETH_ADDRESS.toLowerCase()
      });

      // Determine token positions
      const isBrettToken0 = token0.toLowerCase() === BRETT_ADDRESS.toLowerCase();
      const isWethToken1 = token1.toLowerCase() === WETH_ADDRESS.toLowerCase();

      console.log('Token Position Check:', {
        isBrettToken0,
        isWethToken1,
        pairTokens: {
          token0: token0.toLowerCase(),
          token1: token1.toLowerCase()
        },
        expectedTokens: {
          brett: BRETT_ADDRESS.toLowerCase(),
          weth: WETH_ADDRESS.toLowerCase()
        }
      });

      // Get reserves based on token positions
      const brettReserve = isBrettToken0 ? reserve0 : reserve1;
      const wethReserve = isBrettToken0 ? reserve1 : reserve0;
      
      // Convert reserves to numbers with proper decimals
      const brettReserveNum = Number(ethers.utils.formatEther(brettReserve));
      const wethReserveNum = Number(ethers.utils.formatEther(wethReserve));
      
      console.log('Formatted Reserves:', {
        brett: brettReserveNum,
        weth: wethReserveNum,
        ethPrice
      });

      if (brettReserveNum === 0 || wethReserveNum === 0) {
        console.error('Zero reserves found:', { brettReserveNum, wethReserveNum });
        return 0;
      }
      
      // Try both calculation methods
      const brettPriceInEth = wethReserveNum / brettReserveNum;
      const brettPriceUSD = brettPriceInEth * ethPrice;
      
      // Alternative calculation method
      const brettPriceUSD2 = (wethReserveNum * ethPrice) / brettReserveNum;
      
      console.log('BRETT Price Calculations:', {
        method1: {
          brettPriceInEth,
          brettPriceUSD
        },
        method2: {
          brettPriceUSD: brettPriceUSD2
        },
        targetPrice: 0.17,
        inputs: {
          brettReserve: brettReserveNum,
          wethReserve: wethReserveNum,
          ethPrice
        }
      });
      
      // Return the price from method 1 (should be the same as method 2)
      return brettPriceUSD;
    } catch (error) {
      console.error('Error fetching Brett price:', error);
      console.error('Detailed error info:', {
        message: error.message,
        code: error.code,
        data: error.data,
        stack: error.stack,
        contractInfo: {
          pairAddress: BRETT_ETH_PAIR,
          brettAddress: BRETT_ADDRESS,
          wethAddress: WETH_ADDRESS
        }
      });
      return 0;
    }
  }

  async getAllPrices() {
    const [ethPrice, methPrice, brettPrice] = await Promise.all([
      this.getEthPrice(),
      this.getMethPrice(),
      this.getBrettPrice()
    ]);

    return {
      eth: ethPrice,
      meth: methPrice,
      brett: brettPrice
    };
  }
} 