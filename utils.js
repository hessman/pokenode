class Utils {

    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max) + 1);
    }
}

module.exports = Utils