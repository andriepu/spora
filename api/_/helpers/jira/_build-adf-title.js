export default title => ({
  type: 'paragraph',
  content: [{
    type: 'text',
    text: title,
    marks: [{
      type: 'strong',
    }],
  }],
});
