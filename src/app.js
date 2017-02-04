var FlickrService = require('./services/flickr');

FlickrService.getPhotos(0, function(success, data) {
    console.log(success, data);

    var imgContainer = document.querySelector('.photos');

    for(i = 0; i < data.photo.length; i++) {
        var img = document.createElement('img');
        img.src = FlickrService.getPhotoUrl(data.photo[i]);

        imgContainer.appendChild(img);
    }
});