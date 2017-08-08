function ClozeCard(text, cloze) {
    //implementing scope safe constructor
    if (this instanceof ClozeCard) {
        this.text = text;
        this.cloze = cloze;
    } else {
        return new ClozeCard(text, cloze);
    }
};

module.exports = ClozeCard;