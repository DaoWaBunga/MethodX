import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import TradeBox from './TradeBox';
import UserStats from './UserStats';
import PriceDisplay from './PriceDisplay';
import TVLDisplay from './TVLDisplay';
import MethodXLogo from './MethodXLogo';
import ScrollingText from './ScrollingText';
import { ethers } from 'ethers';

const ExchangeContainer = styled.div`
  min-height: 100vh;
  padding-top: 80px;
`;

const Sidebar = styled.div`
  background: ${props => props.theme.boxBg}cc;
  backdrop-filter: blur(10px);
  border-right: 1px solid ${props => props.theme.borderColor};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: calc(100vh - 80px);
  position: fixed;
  width: 250px;
  overflow-y: auto;
  left: 0;
  top: 80px;
`;

const MainContent = styled.div`
  margin-left: 250px;
  min-height: calc(100vh - 80px);
  background: ${props => props.theme.background}80;
  backdrop-filter: blur(5px);
  position: relative;
`;

const LogoContainer = styled.div`
  position: relative;
  z-index: 2;
  padding: 20px;
  background: ${props => props.theme.boxBg}cc;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${props => props.theme.borderColor};
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  position: relative;
  z-index: 1;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 40px;
`;

const TradeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const TradeSectionHeader = styled.h3`
  color: ${props => props.theme.text};
  margin-bottom: 20px;
  padding-left: 10px;
  border-left: 3px solid ${props => props.theme.accentColor};
  font-size: 20px;
`;

const TradeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-bottom: 40px;
`;

const LockOverlay = styled.div`
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  cursor: not-allowed;
  pointer-events: all;
`;

const LockMessage = styled.div`
  font-size: 48px;
  font-weight: bold;
  color: ${props => props.theme.accentColor};
  text-align: center;
  text-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  animation: pulse 2s infinite;
  margin-top: -80px;

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

function Exchange({ account, contracts, provider }) {
  const [balances, setBalances] = useState({ eth: 0, meth: 0, brett: 0, usdc: 0 });
  const [prices, setPrices] = useState({ eth: 0, meth: 0, brett: 0 });
  const [tvl, setTVL] = useState({ eth: 0, usdc: 0 });

  const updateBalances = useCallback(async () => {
    if (!account || !contracts.meth || !contracts.brett || !provider) return;

    try {
      const [ethBalance, methBalance, brettBalance, usdcBalance] = await Promise.all([
        provider.getBalance(account),
        contracts.meth.balanceOf(account),
        contracts.brett.balanceOf(account),
        contracts.usdc.balanceOf(account)
      ]);

      setBalances({
        eth: ethers.utils.formatEther(ethBalance),
        meth: ethers.utils.formatEther(methBalance),
        brett: ethers.utils.formatEther(brettBalance),
        usdc: ethers.utils.formatUnits(usdcBalance, 6)
      });
    } catch (error) {
      console.error('Error updating balances:', error);
    }
  }, [account, contracts.meth, contracts.brett, contracts.usdc, provider]);

  const updatePrices = useCallback(async () => {
    if (!contracts.meth) return;

    try {
      const ethPrice = await contracts.meth.getETHPrice();
      console.log('Raw ETH Price:', ethPrice.toString());

      const methPrice = await contracts.meth.getMETHPrice();
      console.log('Raw METH Price:', methPrice.toString());

      const brettPrice = await contracts.meth.getBRETTPrice();
      console.log('Raw BRETT Price:', brettPrice.toString());

      setPrices({
        eth: Number(ethers.utils.formatUnits(ethPrice, 8)).toFixed(2),
        meth: Number(ethers.utils.formatUnits(methPrice, 8)).toFixed(2),
        brett: Number(ethers.utils.formatUnits(brettPrice, 8)).toFixed(2)
      });

      console.log('Formatted Prices:', {
        eth: Number(ethers.utils.formatUnits(ethPrice, 8)).toFixed(2),
        meth: Number(ethers.utils.formatUnits(methPrice, 8)).toFixed(2),
        brett: Number(ethers.utils.formatUnits(brettPrice, 8)).toFixed(2)
      });
    } catch (error) {
      console.error('Error updating prices:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        data: error.data,
        stack: error.stack
      });
    }
  }, [contracts.meth]);

  const updateTVL = useCallback(async () => {
    if (!contracts.meth) return;

    try {
      const [ethTVL, usdcTVL] = await Promise.all([
        contracts.meth.getETHBalance(),
        contracts.meth.getUSDCBalance()
      ]);

      setTVL({
        eth: ethers.utils.formatEther(ethTVL),
        usdc: ethers.utils.formatUnits(usdcTVL, 6)
      });
    } catch (error) {
      console.error('Error updating TVL:', error);
    }
  }, [contracts.meth]);

  useEffect(() => {
    if (account && contracts.meth && provider) {
      updateBalances();
      updatePrices();
      updateTVL();

      const interval = setInterval(() => {
        updateBalances();
        updatePrices();
        updateTVL();
      }, 15000);

      return () => clearInterval(interval);
    }
  }, [account, contracts.meth, provider, updateBalances, updatePrices, updateTVL]);

  return (
    <ExchangeContainer>
      <Sidebar>
        <UserStats balances={balances} />
      </Sidebar>
      <MainContent>
        <LogoContainer>
          <MethodXLogo />
          <ScrollingText />
        </LogoContainer>
        <ContentWrapper>
          <StatsGrid>
            <PriceDisplay prices={prices} />
            <TVLDisplay ethTVL={tvl.eth} usdcTVL={tvl.usdc} />
          </StatsGrid>

          <TradeSection>
            <div>
              <TradeSectionHeader>Trade with ETH</TradeSectionHeader>
              <TradeGrid>
                <TradeBox 
                  type="buy"
                  currency="ETH"
                  contract={contracts?.meth}
                  account={account}
                  onSuccess={updateBalances}
                />
                <TradeBox 
                  type="sell"
                  currency="ETH"
                  contract={contracts?.meth}
                  account={account}
                  onSuccess={updateBalances}
                />
              </TradeGrid>
            </div>

            <div>
              <TradeSectionHeader>Trade with USDC</TradeSectionHeader>
              <TradeGrid>
                <TradeBox 
                  type="buy"
                  currency="USDC"
                  contract={contracts?.meth}
                  account={account}
                  onSuccess={updateBalances}
                />
                <TradeBox 
                  type="sell"
                  currency="USDC"
                  contract={contracts?.meth}
                  account={account}
                  onSuccess={updateBalances}
                />
              </TradeGrid>
            </div>
          </TradeSection>
        </ContentWrapper>
      </MainContent>
      <LockOverlay>
        <LockMessage>
          Unlocks After Genesis
        </LockMessage>
      </LockOverlay>
    </ExchangeContainer>
  );
}

export default Exchange; 