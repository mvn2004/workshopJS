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
        
        if (request.readyState !== 4){
            movie.innerHTML = 'Загрузка';
            returnж
        }

        if (request.status !== 200){
            movie.innerHTML = 'Упс, что-то пошло не так!';
            console.log('error:' + request.status);
            return;
        }

        const output = JSON.parse(request.responseText);
        let inner = '';

        output.results.forEach(function(item){

            let nameItem = item.name || item.title;
            // дата выхода фильма или первой серии
            let dateItem = item.first_air_date || item.release_date || '"нет даты"';
            nameItem = dateItem + " " + nameItem;
            //1 вариант
            inner += '<div class="col-12 col-md-4 col-xl-3">' + nameItem + '</div>';
            //2 вариант
            //inner += `<div class="col-12">${nameItem}</div>`;
        });

        movie.innerHTML = inner;
    });
}