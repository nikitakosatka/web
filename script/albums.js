document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const preloader = document.getElementById('preloader');
    const errorMessage = document.getElementById('error-message');
    const itemsToLoad = 10;
    let loadedItems = 10;

    fetchData(1, loadedItems);

    function initSwiper() {
        new Swiper('.swiper-container', {
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            on: {
                reachEnd: () => {
                    if (loadedItems < 5000) {
                        loadedItems += itemsToLoad;
                        fetchData(loadedItems - itemsToLoad, loadedItems);
                    }
                },
            },
        });
    }


    function fetchData(startId, endId) {
        preloader.classList.remove('hidden');
        errorMessage.classList.add('hidden');

        const url = `https://jsonplaceholder.typicode.com/photos?_start=${startId}&_end=${endId}`

        fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network error');
                }
            })
            .then((data) => {
                render(data);
                preloader.classList.add('hidden');
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                errorMessage.textContent = '⚠️ Что-то пошло не так';
                errorMessage.classList.remove('hidden');
                preloader.classList.add('hidden');
            });
    }

    function render(data) {
        const fragment = document.createDocumentFragment();

        data.forEach(({title, thumbnailUrl, url}) => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';

            const img = document.createElement('img');
            img.src = thumbnailUrl;
            img.alt = title;
            img.onclick = () => {
                window.open(url, '_blank');
            };

            const text = document.createElement('p');
            text.textContent = title;

            slide.appendChild(img);
            slide.appendChild(text);

            fragment.appendChild(slide);
        });

        gallery.innerHTML = '';
        gallery.appendChild(fragment);
        initSwiper();
    }
});
