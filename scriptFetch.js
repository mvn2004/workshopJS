const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const urlPoster = 'https://image.tmdb.org/t/p/w500';
function apiSearch(event) {

    event.preventDefault();

    const searchText = document.querySelector('.form-control').value;
    if(searchText.trim().length === 0){
        movie.innerHTML = '<h2 class="col-12 text-center text-danger">Поле поиска не должно быть пустым</h2>';
        return;
    }
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=137d6d0dd08068a1b4f6f19de86001d6&language=ru-RU&query=' + searchText;
    movie.innerHTML = '<div class="spinner"></div>';

    fetch(server)
        .then(function(value){
            if (value.status !==200){
                return Promise.reject(value);
            }
            return value.json();
        })
        .then(function(output){
            let inner = '';
            if(output.results.length === 0){
                inner = '<h2 class="col-12 text-center text-info">По Вашему запросу ничего не найдено</h2>';
            }
            output.results.forEach(function (item) {
                let nameItem = item.name || item.title;
                // дата выхода фильма или первой серии
                let dateItem = item.first_air_date || item.release_date || '"нет даты"';
                nameItem = nameItem + " / " + dateItem;
                let dataInfo = '';
                if(item.media_type !== 'person') dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`;
                //1 вариант
                //inner += '<div class="col-12 col-md-4 col-xl-3">' + nameItem + '</div>';
                //2 вариант (с картинками)
                //const poster = item.poster_path ? urlPoster + item.poster_path : './img/iconmonstr-frown-thin-240.png';
                //3 вариант (с картинками)
                inner += `
                <div class="col-12 col-md-6 col-xl-3 item">
                <img src="${urlPoster + item.poster_path}" class="img_poster" onerror="this.src='./img/poster.jpg'" alt="${nameItem}" ${dataInfo}>
                    <h5>${nameItem}</h5>
                </div>
                `;
            });
            movie.innerHTML = inner;

            addEventMedia();
        })
        .catch(function(reason){
            movie.innerHTML = 'Упс, что-то пошло не так!';
            console.error('error:' + reason.status); 
        });
}

searchForm.addEventListener('submit', apiSearch);

function addEventMedia(){
    const media = movie.querySelectorAll('img[data-id]');
    media.forEach(function(elem){
        elem.style.cursor = 'pointer';
        elem.addEventListener('click', showFullInfo);
    })
}

function showFullInfo(){

}