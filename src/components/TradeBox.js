import React, { useState } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { USDC_ADDRESS, USDC_ABI } from '../constants';

const Box = styled.div`
  padding: 20px;
  background: ${props => props.theme.boxBg};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.borderColor};
  width: 300px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.borderColor};
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  border: none;
  background: ${props => props.theme.accentColor};
  color: white;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

function TradeBox({ type, currency = "ETH", contract, treasuryContract, account, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrade = async () => {
    if (!amount || !contract || !treasuryContract) return;

    setLoading(true);
    try {
      const parsedAmount = ethers.utils.parseEther(amount);

      let tx;
      if (type === 'buy') {
        if (currency === "ETH") {
          // Buy with ETH
          tx = await treasuryContract.buyMeth({ 
            value: parsedAmount,
            gasLimit: 500000
          });
        } else {
          // Buy with USDC
          // First approve USDC
          const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, contract.signer);
          const approveTx = await usdcContract.approve(treasuryContract.address, parsedAmount);
          await approveTx.wait();
          
          // Then buy with USDC
          tx = await treasuryContract.buyMethWithUSDC(parsedAmount, {
            gasLimit: 500000
          });
        }
      } else {
        // For selling, first approve METH
        const approveTx = await contract.approve(treasuryContract.address, parsedAmount);
        await approveTx.wait();

        if (currency === "ETH") {
          tx = await treasuryContract.sellMeth(parsedAmount, {
            gasLimit: 500000
          });
        } else {
          tx = await treasuryContract.sellMethForUSDC(parsedAmount, {
            gasLimit: 500000
          });
        }
      }

      await tx.wait();
      onSuccess();
      setAmount('');
    } catch (error) {
      console.error(`Error ${type}ing Meth:`, error);
      alert(`Failed to ${type} Meth with ${currency}. Please try again.`);
    }
    setLoading(false);
  };

  return (
    <Box>
      <h3>{type === 'buy' ? `Buy Meth with ${currency}` : `Sell Meth for ${currency}`}</h3>
      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder={`Amount in ${type === 'buy' ? currency : 'METH'}`}
      />
      <Button onClick={handleTrade} disabled={loading}>
        {loading ? 'Processing...' : `${type.charAt(0).toUpperCase() + type.slice(1)} Meth`}
      </Button>
    </Box>
  );
}

export default TradeBox; 