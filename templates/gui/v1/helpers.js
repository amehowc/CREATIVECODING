function scaleTo(originWidth, originHeight, destinationWidth, destinationHeight, cover = false) {
    const widthRatio = destinationWidth / originWidth;
    const heightRatio = destinationHeight / originHeight;
    if (cover) {
        return Math.max(widthRatio, heightRatio);
    } else {
        return Math.min(widthRatio, heightRatio);
    }
}