function scaleTo(originWidth, originHeight, destinationWidth, destinationHeight, cover = false) {
    const widthRatio = destinationWidth / originWidth;
    const heightRatio = destinationHeight / originHeight;
    if (cover) {
        return Math.max(widthRatio, heightRatio);
    } else {
        return Math.min(widthRatio, heightRatio);
    }
}
// https://github.com/processing/p5.js/blob/v1.7.0/src/dom/dom.js#L312
function addElement(elt, pInst, media) {
    const node = pInst._userNode ? pInst._userNode : document.body;
    node.appendChild(elt);
    const c = media
      ? new p5.MediaElement(elt, pInst)
      : new p5.Element(elt, pInst);
    pInst._elements.push(c);
    return c;
  }
// slightly edited from the createInput()
  p5.prototype.createTextArea = function (value = '', type = 'text') {
    let elt = document.createElement('textarea');
    elt.setAttribute('value', value);
    elt.setAttribute('type', type);
    return addElement(elt, this);
  };