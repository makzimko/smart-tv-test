/**
 * Movement service
 * @constructor
 */
var MovementService = function MovementService() {
    var callbackFunc;
    var wheelTimeout = null;
    /**
     * Initialize service
     * @public
     * @param {Element} root
     */
    this.init = function init(callback) {
        callbackFunc = callback;
        bindEvents();
    };

    /**
     * Bind events
     * @private
     */
    function bindEvents() {
        document.addEventListener('keyup', onKeyUp);
        document.addEventListener('wheel', onWheelStart);
        document.addEventListener('mousewheel', onWheelStart);
    }

    /**
     * Event on key up
     * @param {Event} e
     */
    function onKeyUp(e) {
        var key = e.keyCode;
        console.log(key);

        var changeRow = key % 2 == 0;
        var direction;

        if (changeRow) {
            direction = key < 39 ? -1 : 1;
        } else {
            direction = key < 38 ? -1 : 1;
        }

        callbackFunc(changeRow, direction);
    }

    /**
     * Event on mouse wheel
     * @private
     * @param {Evant} e
     */
    function onWheelStart(e) {
        if (wheelTimeout) {
            clearTimeout(wheelTimeout);
        }
        wheelTimeout = setTimeout(
            onWheelEnd.bind(null, e.wheelDeltaY < 0 ? 1 : -1),
            100
        );
    }

    /**
     * Fires on mouse wheel end
     * @param {Number} direction
     */
    function onWheelEnd(direction) {
        clearTimeout(wheelTimeout);
        callbackFunc(true, direction);
    }
};

module.exports = new MovementService();