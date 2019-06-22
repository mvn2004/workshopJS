const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const urlPoster = 'https://image.tmdb.org/t/p/w500';

function apiSearch(event) {
    event.preventDefault();
    const searchText = document.querySelector('.form-control').value;

    if (searchText.trim().length === 0) {
        movie.innerHTML = '<h2 class="col-12 text-center text-danger">Поле поиска не должно быть пустым</h2>';
        return;
    }

    const server = 'https://api.themoviedb.org/3/search/multi?api_key=137d6d0dd08068a1b4f6f19de86001d6&language=ru-RU&query=' + searchText;
    movie.innerHTML = '<div class="spinner"></div>';

    fetch(server)
        .then(function (value) {

            if (value.status !== 200) {
                return Promise.reject(new Error(value.status));
            }

            return value.json();
        })
        .then(function (output) {
            let inner = '';

            if (output.results.length === 0) {
                inner = '<h2 class="col-12 text-center text-info">По Вашему запросу ничего не найдено</h2>';
            }

            output.results.forEach(function (item) {
                let nameItem = item.name || item.title;
                // дата выхода фильма или первой серии
                let dateItem = item.first_air_date || item.release_date || '"нет даты"';
                nameItem = nameItem + " / " + dateItem;
                let dataInfo = '';

                if (item.media_type !== 'person') dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`;

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
        .catch(function (reason) {
            movie.innerHTML = 'Упс, что-то пошло не так!';
            console.error(reason || reason.status);
        });
}

searchForm.addEventListener('submit', apiSearch);

function addEventMedia() {
    const media = movie.querySelectorAll('img[data-id]');
    media.forEach(function (elem) {
        elem.style.cursor = 'pointer';
        elem.addEventListener('click', showFullInfo);
    });
}

function showFullInfo() {
    let url = '';

    if (this.dataset.type === 'movie') {
        url = 'https://api.themoviedb.org/3/movie/' + this.dataset.id + '?api_key=137d6d0dd08068a1b4f6f19de86001d6&language=ru-RU';
    } else if (this.dataset.type === 'tv') {
        url = 'https://api.themoviedb.org/3/tv/' + this.dataset.id + '?api_key=137d6d0dd08068a1b4f6f19de86001d6&language=ru-RU';
    } else {
        movie.innerHTML = '<h2 class="col-12 text-center text-danger">Произошла ошибка! Повторите позже</h2>';
    }

    fetch(url)
        .then(function (value) {

            if (value.status !== 200) {
                return Promise.reject(new Error(value.status));
            }

            return value.json();
        })
        .then(function (output) {
            console.log(output);
            movie.innerHTML = `
            <h4 class="col-12 text-center text-info">${output.name || output.title}</h4>
            <div class="col-4">
                <img src="${urlPoster + output.poster_path}" onerror="this.src='./img/poster.jpg'" alt="${output.name || output.title}">
                ${output.homepage ? `<p class='text-center'><a href="${output.homepage}" target="_blank">Официальный сайт</a></p>` : ''}
                ${output.imdb_id ? `<p class='text-center'><a href="https://www.imdb.com/title/${output.imdb_id}" target="_blank">Сайт IMDB.com</a></p>` : ''}
            </div>
            <div class="col-8">
                <p> Рейтинг: ${output.vote_average}</p>
                <p> Статус: ${output.status}</p>
                <p> Премьера: ${output.first_air_date || output.release_date}</p>

                ${output.last_episode_to_air ? `<p>${output.number_of_episodes} сезонов ${output.last_episode_to_air.episode_number} серий вышло</p>` : ''}

                <p> Описание: ${output.overview}</p>
            </div>
            `;
        })
        .catch(function (reason) {
            movie.innerHTML = 'Упс, что-то пошло не так!';
            console.error(reason || reason.status);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('https://api.themoviedb.org/3/trending/all/week?api_key=137d6d0dd08068a1b4f6f19de86001d6&language=ru-RU')
        .then(function (value) {

            if (value.status !== 200) {
                return Promise.reject(new Error(value.status));
            }

            return value.json();
        })
        .then(function (output) {
            let inner = '<h4 class="col-12 text-center text-info">Популярные фильмы за последнюю неделю</h4>';

            if (output.results.length === 0) {
                inner = '<h2 class="col-12 text-center text-info">По Вашему запросу ничего не найдено</h2>';
            }

            output.results.forEach(function (item) {
                let nameItem = item.name || item.title;
                let mediaType = item.title ? 'movie' : 'tv';
                let dateItem = item.first_air_date || item.release_date || '"нет даты"';
                nameItem = nameItem + " / " + dateItem;
                let dataInfo = `data-id="${item.id}" data-type="${mediaType}"`;
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
        .catch(function (reason) {
            movie.innerHTML = 'Упс, что-то пошло не так!';
            console.error(reason || reason.status);
        });
})