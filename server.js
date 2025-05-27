const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Настройка хранилища для загружаемых файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Уникальное имя файла
    }
});

const upload = multer({ storage });

// Массив для хранения мемов
let memes = [];

// Статические файлы
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Эндпоинт для загрузки мемов
app.post('/upload', upload.single('image'), (req, res) => {
    const newMeme = {
        title: req.body.title,
        imageUrl: `/uploads/${req.file.filename}`,
        votes: 0
    };
    memes.push(newMeme);
    res.status(201).send();
});

// Эндпоинт для получения мемов
app.get('/memes', (req, res) => {
    res.json(memes);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});