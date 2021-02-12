export default (html, by) => `
  ${by}${html}${[...by.split('>').reverse().filter(Boolean), ''].join('>').replace(/(<)/g, '$1/')}
`;
