import styled from 'styled-components'
import StyledAppProps from '../../types/StyledAppProps';

const StyledApp = styled.div<StyledAppProps>`
  display: grid;
  grid-template-columns: 100vw;
  grid-template-rows: 95vh auto;
  @media screen and (min-width: 600px) {
    grid-template-columns: 50px auto;
    grid-template-rows: 100vh;
  }
`;

export default StyledApp;
