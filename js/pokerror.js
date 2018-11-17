

class Pokerror extends Error {
    /*
    Custom error class Pokerror formats error for the game.
     */

    constructor (message, status) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        this.status = status || "unknown";
        this.message = this.status + " error :\n" + message
    }
}

module.exports = Pokerror