var FlickrService = require('services/flickr');

var consts = {
    elements: {
        img: 'div',
        wrapper: 'div'
    },
    classes: {
        wrapper: 'gallery-item',
        img: 'gallery-item-img',
        active: 'gallery-item-active'
    }
};

/**
 * Gallery item
 * @param {Object} photo
 * @constructor
 */
var GalleryItem = function GalleryItem(photo) {
    var photoUrl = FlickrService.getPhotoUrl(photo);

    var imgWrapper = document.createElement(consts.elements.wrapper);
    imgWrapper.classList.add(consts.classes.wrapper);

    var imgElement = document.createElement(consts.elements.img);
    imgElement.classList.add(consts.classes.img);
    imgElement.style.backgroundImage = 'url(' +  photoUrl + ')';
    imgWrapper.appendChild(imgElement);

    /**
     * Get DOM element of item
     * @public
     * @returns {Element}
     */
    this.getElement = function getElement() {
        return imgWrapper;
    };

    /**
     * Set focus to item
     * @public
     */
    this.focus = function focus() {
        imgWrapper.classList.add(consts.classes.active);
    };

    /**
     * Remove focus from item
     * @public
     */
    this.blur = function blur() {
        imgWrapper.classList.remove(consts.classes.active);
    };

    /**
     * Remove element from DOM
     * @public
     */
    this.destroy = function destroy() {
        imgWrapper.remove();
    }
};

module.exports = GalleryItem;
