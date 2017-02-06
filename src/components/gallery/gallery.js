var FlickrService = require('services/flickr');
var MovementService = require('services/movement');

var GalleryRow = require('./gallery-row');

var consts = {
    elements: {
        gallery: 'div'
    },
    classes: {
        gallery: 'gallery'
    }
};

var Gallery = function Gallery(rootElement) {
    var root = rootElement;

    var rowsElements = [];
    var data = {
        activeRow: null,
        currentPage: 1,
        currentRow: 0,
        currentItem: 0,
        pageSize: CONFIG.flickr.pageSize,
        rowSize: CONFIG.gallery.rowSize,
        offset: 0,
        isLoading: false
    };
    init();

    function init() {
        var galleryElement = document.createElement(consts.elements.gallery);
        galleryElement.classList.add(consts.classes.gallery);
        getData(data.currentPage);
        MovementService.init(onMove);
    }

    /**
     * Request data from Flickr API
     * @param {Number} page
     */
    function getData(page) {
        if (page == 0) {
            return;
        }
        if (data.photo && page >= data.pages) {
            return;
        }
        data.isLoading = true;
        FlickrService.getPhotos(page, proceedData);
    }

    /**
     * Procced data received from Flickr API
     * @param {Boolean} success
     * @param {Object} response
     */
    function proceedData(success, response) {
        data.isLoading = false;
        if (!success) {
            // Alert if some error occured
            if (!response) {
                alert('Error occured');
            } else {
                alert(response);
            }
            return;
        }
        if (!data.photo) {
            data.photo = response.photo;
            data.pages = response.pages;
            data.rows = response.photo.length / data.rowSize;
            drawFirstElements();
        } else {
            if (data.currentPage < response.page) {
                Array.prototype.push.apply(data.photo, response.photo);
            } else {
                Array.prototype.unshift.apply(data.photo, response.photo);
            }
            data.rows += response.photo.length / data.rowSize;
        }
    }

    /**
     * Draw first list of elements
     */
    function drawFirstElements() {
        rowsElements.push(null);

        var activeRowData = data.photo.slice(0, data.rowSize);
        var activeRowElement = new GalleryRow(activeRowData, 0);
        root.appendChild(activeRowElement.getElement());
        rowsElements.push(activeRowElement);
        data.activeRow = activeRowElement;
        activeRowElement.focusElement(data.currentItem);

        var bottomRowData = data.photo.slice(data.rowSize, data.rowSize * 2);
        var bottomRowElement = new GalleryRow(bottomRowData, -1);
        root.appendChild(bottomRowElement.getElement());
        rowsElements.push(bottomRowElement);
    }

    /**
     * Move focus
     * @param {Boolean} changeRow
     * @param {Number} direction
     */
    function onMove(changeRow, direction) {
        if (data.isLoading) {
            return;
        }
        if (changeRow) {
            moveRow(direction);
        } else {
            moveInRow(direction);
        }
    }

    /**
     * Move for between items in row
     * @param {Number} direction
     */
    function moveInRow(direction) {
        var newIndex = data.currentItem + direction;
        if (newIndex < 0 || newIndex >= data.rowSize) {
            return;
        }
        data.activeRow.blurElement(data.currentItem);
        data.activeRow.focusElement(newIndex);
        data.currentItem = newIndex;
    }

    /**
     * Move focus to another row
     * @param {Number} direction
     */
    function moveRow(direction) {
        var newRowIndex = data.currentRow + direction;
        if (newRowIndex < 0 || newRowIndex >= data.rows) {
            return;
        }
        data.activeRow.blurElement(data.currentItem);

        // detect when element would be added to DOM
        root.addEventListener('DOMNodeInserted', function(e) {
            root.removeEventListener(e.type, arguments.callee);
            setTimeout(animateRow.bind(null, direction), 10);
        });
        addRow(direction);
    }

    /**
     * Animate row
     * @param direction
     */
    function animateRow(direction) {
        for (i = 0; i < rowsElements.length; i++) {
            if (rowsElements[i]) {
                var newPosition = 2 - i;
                if (direction < 0) {
                    newPosition -= 1;
                }
                rowsElements[i].setPosition(newPosition);
            }
        }
        data.currentRow = data.currentRow + direction;

        if (direction > 0) {
            data.activeRow = rowsElements[2];
        } else {
            data.activeRow = rowsElements[1];
        }

        data.activeRow.focusElement(data.currentItem);

        var rowToRemove = removeRow(direction);
        if (rowToRemove) {
            var elementToRemove = rowToRemove.getElement();
            elementToRemove.addEventListener('transitionend', function() {
                rowToRemove.destroy();
            });
        }

        cleanUpData(direction);
    }

    /**
     * Add new row list
     * @param {Number} direction
     */
    function addRow(direction) {
        var newRowIndex = data.currentRow + (2 * direction);
        var newRowData = data.photo.slice(newRowIndex * data.rowSize, (newRowIndex + 1) * data.rowSize);

        var newRowPosition = direction > 0? -2 : 2;
        var newRowElement = new GalleryRow(newRowData, newRowPosition);

        if (direction > 0) {
            rowsElements.push(newRowElement);
            root.appendChild(newRowElement.getElement());
        } else {
            rowsElements.unshift(newRowElement);
            root.insertBefore(newRowElement.getElement(), root.firstChild);
        }

        return newRowElement;
    }

    /**
     * Remove row from list
     * @param {Number} direction
     * @returns {Gallery.Row}
     */
    function removeRow(direction) {
        var oldElement;
        if (direction > 0) {
            oldElement = rowsElements.shift();
        } else {
            oldElement = rowsElements.pop();
        }
        return oldElement;
    }

    function cleanUpData(direction) {
        var rowsInPage = data.pageSize / data.rowSize;
        // check if new data needed
        if (
            direction > 0 &&
            data.currentRow == data.rows - 2 &&
            data.currentPage != data.pages
        ) {
            // load next page
            getData(data.currentPage + 1);
        }

        if (
            direction < 0 &&
            data.currentRow == 1 &&
            data.currentPage != 1
        ) {
            // load previous page
            getData(data.currentPage - 1);
            data.currentRow += rowsInPage;
            data.currentPage--;
        }

        if (direction > 0 && data.currentRow == rowsInPage + 1) {
            data.currentRow -= rowsInPage;
            data.currentPage++;
            data.photo = data.photo.slice(data.pageSize);
            data.rows -= rowsInPage;
        }

        if (direction < 0 && data.currentRow == rowsInPage - 2) {
            data.photo = data.photo.slice(0, data.pageSize);
            data.rows -= rowsInPage;
        }
    }
};

module.exports = Gallery;