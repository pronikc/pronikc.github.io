const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

// Хранение мемов в памяти
let memes = [];
let memeIdCounter = 0;

// Обслуживание статических файлов (клиентская часть)
app.use(express.static(path.join(__dirname, 'public')));

// Когда подключается новый клиент
io.on('connection', (socket) => {
    console.log('Новое подключение');

    // Отправляем текущие мемы клиенту
    socket.emit('initialMemes', memes);

    // Обработка загрузки нового мема
    socket.on('addMeme', (data) => {
        const newMeme = {
            id: memeIdCounter++,
            url: data.url,
            votes: 0,
        };
        memes.push(newMeme);
        io.emit('newMeme', newMeme); // Рассылаем всем
    });

    // Обработка голосования
    socket.on('vote', (id) => {
        const meme = memes.find(m => m.id === id);
        if (meme) {
            meme.votes++;
            io.emit('updateVotes', { id: meme.id, votes: meme.votes });
        }
    });
});

// Запуск сервера
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});