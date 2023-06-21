import styled from 'styled-components';

export const Outer = styled.footer`
  display: grid;
  grid-template-columns: repeat(2, 2fr);
  max-width: 1600px;
  margin: 50px auto;
  border-top: 2px solid var(--color-box-background);
  padding: 20px 50px;
  justify-content: space-between;
`;

export const Logo = styled.div`
  width: 70px;
`;

export const Socials = styled.div`
  display: flex;
  font-size: .25rem;
  gap: 8px;
  margin-top: 1rem;
`;

export const Powered = styled.div`
  width: 100%;
  display: block;
  align-items: center;
  font-size: 12px;
  font-weight: 400;

  p {
    margin: 15px 0;
    display: block;
  }

  svg {
    width: 3rem;
  }
`;

export const NavList = styled.footer`
  list-style: none;
  font-weight: 500;
  font-size: 1rem;
  display: block;
  margin: 0 0 0 auto;

  li {
    line-height: 1.5rem;
  }
  h5 {
    font-size: 0.7rem;
    font-weight: 400;
    margin-bottom: 10px;
  }
`;

export const SubText = styled.p`
  width: 100%;
  display: block;
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;

  p {
    margin: 0;
  }

  svg {
    width: 120px;
  }
`;
