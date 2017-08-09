//https://en.wikipedia.org/wiki/Cloze_test

function BasicCard(front, back) {
    if (this instanceof BasicCard) {
        this.front = front;
        this.back = back;
    } else {
        return new BasicCard(front, back);
    }

};


module.exports = BasicCard;


// Its capital was originally New York City.
// The United States uses 18% of the world's energy.
// There is no official language.
// At some point, 1 out of every 8 Americans will work for McDonald's.
// Alaska has, by far, the longest coastline of any state.
// The United States invented the internet.
// It has the biggest economy in the world.