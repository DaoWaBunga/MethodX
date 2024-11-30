import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const Container = styled.div`
  margin-top: 40px;
  padding-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 800px;
  width: 90%;
`;

const Title = styled.h2`
  color: #007bff;
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
  max-width: 800px;
  aspect-ratio: 2/1;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  opacity: 0;
  animation: ${fadeIn} 0.5s ease-out forwards;
  animation-delay: ${props => props.delay}s;
`;

const StepNumber = styled.div`
  background: #007bff;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  font-weight: bold;
`;

const StepTitle = styled.h3`
  color: #007bff;
  margin-bottom: 10px;
  font-size: 1.2rem;
`;

const StepDescription = styled.p`
  color: white;
  font-size: 0.9rem;
  line-height: 1.5;
`;

function HowItWorks() {
  const steps = [
    {
      title: "Buy METH",
      description: "Purchase METH tokens directly using ETH or USDC. Starting at just $0.10 per METH."
    },
    {
      title: "Hold & Earn",
      description: "Hold METH to earn BRETT tokens on every transaction. The more you hold, the more you earn!"
    },
    {
      title: "Dynamic Rewards",
      description: "As METH price increases, BRETT rewards automatically increase. Starting at 1% and growing with price."
    },
    {
      title: "Sell Anytime",
      description: "Easily sell your METH back to ETH or USDC whenever you want, while still earning BRETT rewards."
    }
  ];

  const gridRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.visibility = 'visible';
          }
        });
      },
      {
        threshold: 0.1
      }
    );

    cardsRef.current.forEach((card) => {
      if (card) {
        observer.observe(card);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Container>
      <Title>How It Works</Title>
      <Grid ref={gridRef}>
        {steps.map((step, index) => (
          <Card
            key={index}
            ref={el => cardsRef.current[index] = el}
            delay={0.3 * (index + 1)}
            style={{ visibility: 'hidden' }}
          >
            <StepNumber>{index + 1}</StepNumber>
            <StepTitle>{step.title}</StepTitle>
            <StepDescription>{step.description}</StepDescription>
          </Card>
        ))}
      </Grid>
    </Container>
  );
}

export default HowItWorks; 