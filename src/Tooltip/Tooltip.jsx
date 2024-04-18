import styled from "styled-components";

const Container = styled.div`
  z-index: 2;
  border: 1px solid grey;
  position: absolute;
  background: white;
  top: ${(props) => props.y + "px"};
  left: ${(props) => props.x + "px"};
`;


export default function Tooltip() {
      
    return(
        <Container>
        Hello world!
        </Container>
    ) 
}