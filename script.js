// Получаем элементы из DOM
const memeForm = document.getElementById('memeForm');
const memeGallery = document.getElementById('memeGallery');

// Обработчик события отправки формы
memeForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Отменяем стандартное поведение формы

    const title = document.getElementById('memeTitle').value;
    const imageFile = document.getElementById('memeImage').files[0];

    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', imageFile);

    // Отправляем мем на сервер
    const response = await fetch('/upload', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        loadMemes(); // Обновляем галерею мемов
    } else {
        alert('Ошибка загрузки мема');
    }
});

// Функция для загрузки мемов
async function loadMemes() {
    const response = await fetch('/memes');
    const memes = await response.json();
    memeGallery.innerHTML = '';

    memes.forEach(meme => {
        const memeDiv = document.createElement('div');
        memeDiv.classList.add('meme');
        memeDiv.innerHTML = `
            <img src="${meme.imageUrl}" alt="${meme.title}">
            <div class="vote">${meme.votes} 👍</div>
        `;
        memeGallery.appendChild(memeDiv);
    });
}

// Загружаем мемы при загрузке страницы
loadMemes();