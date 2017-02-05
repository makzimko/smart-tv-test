var FlickrService = require('./services/flickr');
var MovementService = require('./services/movement');

MovementService.init(function(changeRow, direction){
    console.log(changeRow, direction);
});

var Gallery = require('./components/gallery');

FlickrService.getPhotos(0, function(success, data) {
    console.log(success, data);

    var imgContainer = document.querySelector('.photos');

    var imgs = data.photo.slice(0,5);
    var galleryRow = new Gallery.Row(imgs);

    imgContainer.appendChild(galleryRow.getElement());

    setTimeout(function() {
        galleryRow.focusElement(1);
    }, 3000);
});