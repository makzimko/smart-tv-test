var GalleryItem = require('./gallery-item');

var consts = {
    elements: {
        row: 'div'
    },
    classes: {
        row: 'gallery-row',
        active: 'gallery-row-active',
        top: 'gallery-row-top',
        bottom: 'gallery-row-bottom',
        topInactive: 'gallery-row-top-inactive',
        bottomInactive: 'gallery-row-bottom-inactive'
    }
};

var classes = {
    '2': consts.classes.topInactive,
    '1': consts.classes.top,
    '0': consts.classes.active,
    '-1': consts.classes.bottom,
    '-2': consts.classes.bottomInactive
};


/**
 * Gallery row
 * @param {Array} data
 * @param {Number} position
 * @constructor
 */
var GalleryRow = function GalleryRow(data, position) {

    var photos = [];
    var rowPosition = position;
    
    var rowElement = document.createElement('div');
    rowElement.classList.add('gallery-row');
    rowElement.classList.add(classes[position]);

    for (i = 0; i < data.length; i++) {
        var photo = new GalleryItem(data[i]);
        photos.push(photo);
        rowElement.appendChild(photo.getElement());
    }

    /**
     * Get DOM element of row
     * @returns {Element}
     */
    this.getElement = function getElement() {
        return rowElement;
    };

    /**
     * Set focus to element in row
     * @param index
     */
    this.focusElement = function(index) {
        photos[index].focus();
    };

    /**
     * Remove focus from element in row
     * @param index
     */
    this.blurElement = function(index) {
        photos[index].blur();
    };

    /**
     * Set position of the row
     * @param position
     */
    this.setPosition = function(position) {
        var currentClass = classes[rowPosition];
        rowElement.classList.remove(currentClass);
        var newClass = classes[position];
        rowElement.classList.add(newClass);
        rowPosition = position;
    };

    /**
     * Remove element from DOM
     * @private
     */
    this.destroy = function destroy() {
        for (i = 0; i < photos.length; i++) {
            photos[i].destroy();
        }
        rowElement.remove();
        delete this;
    }
};

module.exports = GalleryRow;