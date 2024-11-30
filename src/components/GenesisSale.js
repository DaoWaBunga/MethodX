import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';

const SaleContainer = styled.div`
  min-height: 100vh;
  padding: 30px;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    ${props => props.theme.background};
  color: ${props => props.theme.text};
`;

const SaleCard = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 30px;
  background: ${props => props.theme.boxBg}ee;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.borderColor};
  backdrop-filter: blur(10px);
`;

const Title = styled.h1`
  text-align: center;
  color: ${props => props.theme.accentColor};
  margin-bottom: 30px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
`;

const InfoBox = styled.div`
  padding: 15px;
  background: ${props => props.theme.boxBg};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.borderColor};
  text-align: center;
`;

const InfoLabel = styled.div`
  font-size: 14px;
  color: ${props => props.theme.text}aa;
  margin-bottom: 5px;
`;

const InfoValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.theme.accentColor};
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

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
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

const ProgressBar = styled.div`
  width: 100%;
  height: 20px;
  background: ${props => props.theme.boxBg};
  border-radius: 10px;
  overflow: hidden;
  margin: 20px 0;
`;

const Progress = styled.div`
  width: ${props => props.progress}%;
  height: 100%;
  background: ${props => props.theme.accentColor};
  transition: width 0.3s ease;
`;

const AdminSection = styled.div`
  margin-top: 30px;
  padding: 20px;
  background: ${props => props.theme.boxBg}80;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.borderColor};
`;

const AdminTitle = styled.h2`
  color: ${props => props.theme.accentColor};
  margin-bottom: 20px;
`;

function GenesisSale({ account, saleContract }) {
  const [amount, setAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saleStats, setSaleStats] = useState({
    totalForSale: 21900000,
    remaining: 21900000,
    priceUSD: 0.10,
    raised: 0
  });
  const [depositAmount, setDepositAmount] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const updateStats = async () => {
      if (saleContract) {
        try {
          const remaining = await saleContract.remainingMeth();
          const timeRemaining = await saleContract.timeRemaining();
          const sold = saleStats.totalForSale - Number(ethers.utils.formatEther(remaining));
          
          setSaleStats(prev => ({
            ...prev,
            remaining: Number(ethers.utils.formatEther(remaining)),
            raised: sold * 0.10
          }));
          
          setProgress((sold / saleStats.totalForSale) * 100);
          
          // Format time remaining
          const days = Math.floor(timeRemaining / 86400);
          const hours = Math.floor((timeRemaining % 86400) / 3600);
          const minutes = Math.floor((timeRemaining % 3600) / 60);
          setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        } catch (error) {
          console.error('Error updating sale stats:', error);
        }
      }
    };

    updateStats();
    const interval = setInterval(updateStats, 30000);
    return () => clearInterval(interval);
  }, [saleContract, saleStats.totalForSale]);

  useEffect(() => {
    const checkOwner = async () => {
      if (saleContract && account) {
        try {
          const owner = await saleContract.owner();
          setIsOwner(owner.toLowerCase() === account.toLowerCase());
        } catch (error) {
          console.error('Error checking owner:', error);
        }
      }
    };
    checkOwner();
  }, [saleContract, account]);

  const handleBuyWithWETH = async () => {
    if (!amount || !saleContract) return;
    setLoading(true);
    try {
      const tx = await saleContract.buyWithWETH(ethers.utils.parseEther(amount));
      await tx.wait();
      setAmount('');
    } catch (error) {
      console.error('Error buying with WETH:', error);
    }
    setLoading(false);
  };

  const handleBuyWithUSDC = async () => {
    if (!amount || !saleContract) return;
    setLoading(true);
    try {
      const tx = await saleContract.buyWithUSDC(ethers.utils.parseUnits(amount, 6));
      await tx.wait();
      setAmount('');
    } catch (error) {
      console.error('Error buying with USDC:', error);
    }
    setLoading(false);
  };

  const handleDeposit = async () => {
    if (!depositAmount || !saleContract) return;
    setLoading(true);
    try {
      const amount = ethers.utils.parseEther(depositAmount);
      const tx = await saleContract.depositMethTokens(amount);
      await tx.wait();
      setDepositAmount('');
    } catch (error) {
      console.error('Error depositing METH:', error);
    }
    setLoading(false);
  };

  return (
    <SaleContainer>
      <SaleCard>
        <Title>METH Genesis Sale</Title>
        <InfoGrid>
          <InfoBox>
            <InfoLabel>Time Remaining</InfoLabel>
            <InfoValue>{timeLeft || 'Not Started'}</InfoValue>
          </InfoBox>
          <InfoBox>
            <InfoLabel>METH Price</InfoLabel>
            <InfoValue>${saleStats.priceUSD}</InfoValue>
          </InfoBox>
          <InfoBox>
            <InfoLabel>METH Remaining</InfoLabel>
            <InfoValue>{saleStats.remaining.toLocaleString()}</InfoValue>
          </InfoBox>
          <InfoBox>
            <InfoLabel>Total Raised</InfoLabel>
            <InfoValue>${saleStats.raised.toLocaleString()}</InfoValue>
          </InfoBox>
        </InfoGrid>

        <ProgressBar>
          <Progress progress={progress} />
        </ProgressBar>

        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          disabled={loading}
        />

        <ButtonGroup>
          <Button onClick={handleBuyWithWETH} disabled={loading || !account}>
            {loading ? 'Processing...' : 'Buy with WETH'}
          </Button>
          <Button onClick={handleBuyWithUSDC} disabled={loading || !account}>
            {loading ? 'Processing...' : 'Buy with USDC'}
          </Button>
        </ButtonGroup>

        {isOwner && (
          <AdminSection>
            <AdminTitle>Admin Controls</AdminTitle>
            <Input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Enter METH amount to deposit"
              disabled={loading}
            />
            <Button onClick={handleDeposit} disabled={loading || !depositAmount}>
              {loading ? 'Processing...' : 'Deposit METH Tokens'}
            </Button>
          </AdminSection>
        )}
      </SaleCard>
    </SaleContainer>
  );
}

export default GenesisSale; 