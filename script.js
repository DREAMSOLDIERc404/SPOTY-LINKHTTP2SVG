function convertUrlToUri() {
    var url = document.getElementById("spotifyLink").value;
    var parts = url.split('/');
    if (parts.length < 5 || parts[2] !== "open.spotify.com") {
        document.getElementById("outputUri").innerHTML = 'Invalid Spotify URL.';
        return;
    } else {
        document.getElementById("outputUri").innerHTML = "CLICCA SULL'IMMAGINE PER SCARICARE L'SVG";
    }

    var type = parts[3];
    var id = parts[4].split('?')[0]; // Remove any query parameters
    var uri = 'spotify:' + type + ':' + id;
    displaySpotifyCode(uri);
    console.log("Spotify URI generato: " + uri); // Aggiungi una stampa per la console
}

function displaySpotifyCode(uri) {
    var spotifyCodeUrl = `https://scannables.scdn.co/uri/plain/png/000000/white/1000/${encodeURIComponent(uri)}`;
    var img = document.createElement('img');
    img.src = spotifyCodeUrl;
    img.alt = 'Spotify Code';
    img.style.width = '320px'; // Modifica la larghezza a 320px
    img.style.height = 'auto';
    img.style.cursor = 'pointer'; // Change cursor to pointer to indicate clickability

    img.addEventListener('click', function() {
        var outputDiv = document.getElementById("outputUri");

        // Use cache to prevent repeated downloads
        if (sessionStorage.getItem('spotifyCode')) {
            outputDiv.innerHTML = sessionStorage.getItem('spotifyCode');
        } else {
            fetch(spotifyCodeUrl)
                .then(response => response.blob())
                .then(blob => {
                    var reader = new FileReader();
                    reader.onload = function() {
                        var asciiContent = reader.result.split('').map(function (char) {
                            return char.charCodeAt(0) > 127 ? '?' : char;
                        }).join('');
                        var content = `<pre>${asciiContent}</pre>`;
                        sessionStorage.setItem('spotifyCode', content);
                        outputDiv.innerHTML = content;
                    }
                    reader.readAsText(blob);
                });
        }
    });

    var previewDiv = document.getElementById("preview");
    previewDiv.innerHTML = ''; // Clear previous content
    previewDiv.appendChild(img);
}
