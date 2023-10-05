$(document).ready(function () {
    var bgImages = ['background1.jpg', 'background2.jpg']; // assuming you have a second image named background2.jpg
    var currentImageIndex = 0;

    $('#search').on('click', function () {
        apiSearch();
    });

    $('#header').on('click', function () {
        currentImageIndex = (currentImageIndex + 1) % bgImages.length; // cycles between the two images
        $('body').css('background-image', `url('${bgImages[currentImageIndex]}')`);
    });

    $('#showTime').on('click', function () {
        var now = new Date();
        var timeString = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        $('#time').html(timeString);
        $('#time').dialog();
    });

    $('#lucky').on('click', function () {
        var query = $('#query').val();
        if (query) {
            apiSearch(function (data) {
                if (data && data.webPages && data.webPages.value && data.webPages.value.length > 0) {
                    window.location.href = data.webPages.value[0].url;
                }
            });
        }
    });
});

function apiSearch(callback) {
    var params = {
        'q': $('#query').val(),
        'count': 50,
        'offset': 0,
        'mkt': 'en-us'
    };

    $.ajax({
        url: 'https://api.bing.microsoft.com/v7.0/search?' + $.param(params),
        type: 'GET',
        headers: {
            'Ocp-Apim-Subscription-Key': '84a85f8de8ef4580a1f60c38e4ee3484'
        }
    })
        .done(function (data) {
            if (typeof callback === 'function') {
                callback(data);
            } else {
                var len = data.webPages.value.length;
                var results = '';
                for (i = 0; i < len; i++) {
                    results += `<p><a href="${data.webPages.value[i].url}">${data.webPages.value[i].name}</a>: ${data.webPages.value[i].snippet}</p>`;
                }

                $('#searchResults').html(results);
                $('#searchResults').dialog();
            }
        })
        .fail(function () {
            alert('error');
        });
}

