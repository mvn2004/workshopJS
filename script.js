const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
function apiSearch(event){
    event.preventDefault();

    const searchText = document.querySelector('.form-control').value,
    server = 'https://api.themoviedb.org/3/search/multi?api_key=137d6d0dd08068a1b4f6f19de86001d6&language=ru-RU&query=' + searchText;
    requestApi('GET', server);
}

searchForm.addEventListener('submit', apiSearch);

function requestApi(method, url){
    
    const request = new XMLHttpRequest();
    request.open(method, url);
    request.send();
    request.addEventListener('readystatechange', function() {
        if (request.readyState !== 4) return;

        if (request.status !== 200){
            console.log('error:' + request.status);
            return;
        }

        const output = JSON.parse(request.responseText);
        let inner = '';
        output.results.forEach(function(item){
            let nameItem = item.name || item.title;
            //1 вариант
            //inner += '<div class="col-12">' + nameItem + '</div>';
            //2 вариант
            inner += `<div class="col-12">${nameItem}</div>`;
        })

        movie.innerHTML = inner;
        console.log(output);
    });
}