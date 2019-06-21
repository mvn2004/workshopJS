const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const urlPoster = 'https://image.tmdb.org/t/p/w500';
function apiSearch(event) {

    event.preventDefault();

    const searchText = document.querySelector('.form-control').value,
        server = 'https://api.themoviedb.org/3/search/multi?api_key=137d6d0dd08068a1b4f6f19de86001d6&language=ru-RU&query=' + searchText;
    movie.innerHTML = 'Загрузка';

    fetch(server)
        .then(function(value){
            if (value.status !==200){
                return Promise.reject(value);
            }
            return value.json();
        })
        .then(function(output){
            let inner = '';
            output.results.forEach(function (item) {
                let nameItem = item.name || item.title;
                // дата выхода фильма или первой серии
                let dateItem = item.first_air_date || item.release_date || '"нет даты"';
                nameItem = nameItem + " / " + dateItem;
                //1 вариант
                //inner += '<div class="col-12 col-md-4 col-xl-3">' + nameItem + '</div>';
                //2 вариант (с картинками)
                inner += `
                <div class="col-12 col-md-4 col-xl-3 item">
                <img src="${urlPoster + item.poster_path}" onerror="this.src='./iconmonstr-frown-thin-240.png'" alt="${nameItem}">
                    <h5>${nameItem}</h5>
                </div>
                `;
            });
            movie.innerHTML = inner;
        })
        .catch(function(reason){
            movie.innerHTML = 'Упс, что-то пошло не так!';
            console.error('error:' + reason.status); 
        });
}

searchForm.addEventListener('submit', apiSearch);