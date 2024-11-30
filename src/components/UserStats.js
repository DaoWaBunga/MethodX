import React from 'react';
import styled from 'styled-components';

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px 0;
`;

const StatBox = styled.div`
  padding: 15px;
  background: ${props => props.theme.boxBg};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.borderColor};
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${props => props.theme.text}aa;
`;

const StatValue = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-top: 5px;
`;

const PriceLink = styled.a`
  display: block;
  padding: 15px;
  background: ${props => props.theme.boxBg};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.borderColor};
  color: ${props => props.theme.accentColor};
  text-decoration: none;
  font-weight: bold;
  text-align: center;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

function UserStats({ balances }) {
  return (
    <StatsContainer>
      <StatBox>
        <StatLabel>ETH Balance</StatLabel>
        <StatValue>{Number(balances.eth).toFixed(4)} ETH</StatValue>
      </StatBox>
      <StatBox>
        <StatLabel>METH Balance</StatLabel>
        <StatValue>{Number(balances.meth).toFixed(4)} METH</StatValue>
      </StatBox>
      <StatBox>
        <StatLabel>BRETT Balance</StatLabel>
        <StatValue>{Number(balances.brett).toFixed(4)} BRETT</StatValue>
      </StatBox>
      <StatBox>
        <StatLabel>USDC Balance</StatLabel>
        <StatValue>{Number(balances.usdc).toFixed(2)} USDC</StatValue>
      </StatBox>
      <PriceLink 
        href="https://dexscreener.com/base/0x36a46dff597c5a444bbc521d26787f57867d2214" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        Brett Price
      </PriceLink>
      <PriceLink 
        href="https://dexscreener.com/base/0x1cd8a2cea2e5af7fdfe6d040973a71ff45bdc727" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        Meth Price
      </PriceLink>
      <PriceLink 
        href="https://discord.gg/TEEuxZF6Wj" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        Discord
      </PriceLink>
    </StatsContainer>
  );
}

export default UserStats; 