import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  :root {
    font-family: 'SFMono-Regular',Consolas,'Liberation Mono',Menlo,Courier,monospace;
    --highlight: #0097ff;
    --background: #282C34;
    font-size: 12px;
    background: var(--background);
  }
  body, #__next {
    min-height: 100vh;
    overflow: hidden;
    color: white;
  }
  a {
    text-decoration: none;
    color: var(--highlight);
    :hover {
      background: var(--highlight);
      color: white;
    }
  }
  p {
    line-height: 150%;
  }
  input {
    border: 0;
    font-family: inherit;
    color: white;
    background: rgba(255, 255, 255, 0.05);
    &:hover {
      background: rgba(255, 255, 255, 0.075);
    }
    &::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
    &:focus {
      background: rgba(255, 255, 255, 0.1);
      outline: none;
    }
  }
`
