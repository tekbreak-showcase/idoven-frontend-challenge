import styled from "@emotion/styled";

export const TimeInputContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  column-gap: 0.2em;
  padding-top: 0.5em;
  background-color: #1876d2;
`;

export const TimeInputUnitContainer = styled.div`
  input {
    text-align: center;
    outline: 0;
    border: 0;
    color: #fff;
    width: 3em;
    background-color: transparent;
    padding-bottom: 0.3em;

    &:focus {
      outline: 0;
    }
  }
`;
export const TimeInputUnitLabel = styled.div<{ backgroundColor: string }>`
  background-color: ${(props) =>
    props.backgroundColor ? props.backgroundColor : "#fff"};
  text-transform: uppercase;
  font-size: 0.5em;
  text-align: center;
  padding: 0.2em 0;
  color: #fff;
  font-family: sans-serif;
`;
