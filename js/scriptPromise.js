const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');

function apiSearch(event) {

    event.preventDefault();

    const searchText = document.querySelector('.form-control').value,
        server = 'https://api.themoviedb.org/3/search/multi?api_key=137d6d0dd08068a1b4f6f19de86001d6&language=ru-RU&query=' + searchText;
    movie.innerHTML = 'Загрузка';
    requestApi(server)
        .then(function (result) {
            const output = JSON.parse(result);

            let inner = '';

            output.results.forEach(function (item) {

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
        })
        .catch(function(reason){
            movie.innerHTML = 'Упс, что-то пошло не так!';
            console.log('error:' + reason.status); 
        });
}

searchForm.addEventListener('submit', apiSearch);

function requestApi(url) {

    return new Promise(function (resolve, reject) {

        const request = new XMLHttpRequest();

        request.open('GET', url);

        request.addEventListener('load', function () {

            if (request.status !== 200) {
                reject({
                    status: request.status
                });
                return;
            }

            resolve(request.response);
        });

        request.addEventListener('error', function () {
            reject({
                status: request.status
            });
        });
        
        request.send();
    });
}