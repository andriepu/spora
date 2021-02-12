export default str => str
  .replace(/\n/g, '')
  .replace(/\s+/g, ' ')
  .replace(/>\s+</g, '><')
  .trim()
  .replace(/&/g, '&amp;');
