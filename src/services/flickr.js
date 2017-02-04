var cfg = CONFIG.flickr;


/**
 * Get photos list from Flickr API
 * @public
 * @param {Number} page
 * @param {Function} callback
 */
function getPhotos(page, callback) {
    page = page || 0;

    var params =
        '?method=' + cfg.method +
        '&api_key=' + cfg.apiKey +
        '&page=' + page +
        '&per_page=' + cfg.pageSize +
        '&format=json&nojsoncallback=1';

    var xhr = new XMLHttpRequest();
    xhr.open('GET', cfg.uri + params);

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.stat == 'ok') {
                    callback(true, response.photos)
                } else {
                    callback(false, response.message);
                }
            } else {
                callback(false);
            }
        }
    };
    xhr.send();
}

/**
 * Get photo url
 * @private
 * @param {Object} photo
 */
function getPhotoUrl(photo) {
    var url =
        'http://farm' + photo.farm +
        '.staticflickr.com/' +
         photo.server +
        '/' + photo.id +
        '_' + photo.secret +
        '.jpg';
    return url;
}

module.exports = {
    getPhotos: getPhotos,
    getPhotoUrl: getPhotoUrl
};
