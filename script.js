const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

const songTitle = document.getElementById("song-title");
const artist = document.getElementById("artist");

// Наші музичні треки
const songs = [
    {
        title: "Track One",
        artist: "XEDUCS",
        src: "Mp3/song1.mp3",
        cover: "images/cover1.png"
    },
    {
        title: "Track Two",
        artist: "XEDUCS",
        src: "Mp3/song2.mp3",
        cover: "images/cover1.png"
    },
    {
        title: "Track Three",
        artist: "XEDUCS",
        src: "Mp3/song3.mp3",
        cover: "images/cover1.png"
    },
    {
        title: "Guitar Solo",
        artist: "XEDUCS",
        src: "Mp3/xeducs-guitar-v2.mp3",
        cover: "images/cover2.png"
    },
    {
        title: "Sleepless-rat",
        artist: "XEDUCS",
        src: "Mp3/sleepless-rat.mp3",
        cover: "images/cover1.png"
    },
    {
    title: "you-let-me-down-again",
    artist: "XEDUCS",
    src: "Mp3/you-let-me-down-again.mp3",
    cover: "images/cover1.png"
},
{
    title: "XEDUCS - New Guitar",
    artist: "XEDUCS",
    src: "Mp3/xeducs-new-guitar.mp3",
    cover: "images/guitar-new.png"
}
];

let songIndex = 0;
let isPlaying = false;

// Завантаження треку


function loadSong(index) {
    const song = songs[index];

    songTitle.textContent = song.title;
    artist.textContent = song.artist;
    audio.src = song.src;

    // Змінюємо обкладинку разом із піснею
    const albumImage = document.getElementById("album-image");

    if (albumImage) {
        albumImage.src = song.cover || "images/cover1.png";
        albumImage.alt = "Обкладинка: " + song.title;
    }
}


// Запуск музики
async function playSong() {
    try {
        await audio.play();
    } catch (error) {
        console.error("Не вдалося відтворити трек:", error);
    }
}

// Пауза
function pauseSong() {
    audio.pause();
}

// Наступний трек
function nextSong() {
    songIndex = (songIndex + 1) % songs.length;
    loadSong(songIndex);
    playSong();
}

// Попередній трек
function prevSong() {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    loadSong(songIndex);
    playSong();
}

// Кнопка Play / Pause
playBtn.addEventListener("click", () => {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

// Оновлення кнопки
audio.addEventListener("play", () => {
    isPlaying = true;
    playBtn.textContent = "⏸";
    playBtn.setAttribute("aria-label", "Пауза");
});

audio.addEventListener("pause", () => {
    isPlaying = false;
    playBtn.textContent = "▶";
    playBtn.setAttribute("aria-label", "Відтворити");
});

// Автоматичний перехід після завершення
audio.addEventListener("ended", nextSong);

// Завантажуємо перший трек
loadSong(songIndex);



/* ===== XEDUCS PLAYER UPDATE ===== */

// Отримуємо елементи HTML
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const volumeValue = document.getElementById("volume-value");
const currentTimeText = document.getElementById("current-time");
const durationText = document.getElementById("duration");
const equalizer = document.getElementById("equalizer");

// Перетворення секунд у хвилини
function formatTime(seconds) {
    if (!Number.isFinite(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${minutes}:${String(secs).padStart(2, "0")}`;
}

// Оновлення шкали прогресу
audio.addEventListener("timeupdate", () => {
    currentTimeText.textContent = formatTime(audio.currentTime);

    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        progress.value = (audio.currentTime / audio.duration) * 100;
    }
});

// Показуємо тривалість треку
audio.addEventListener("loadedmetadata", () => {
    durationText.textContent = formatTime(audio.duration);
    progress.value = 0;
});

// Перемотування треку
progress.addEventListener("input", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime = (progress.value / 100) * audio.duration;
    }
});

// Початкова гучність 70%
audio.volume = 0.7;

// Регулювання гучності
volume.addEventListener("input", () => {
    audio.volume = volume.value / 100;
    volumeValue.textContent = `${volume.value}%`;
});

// Анімація еквалайзера
audio.addEventListener("play", () => {
    equalizer.classList.add("playing");
});

audio.addEventListener("pause", () => {
    equalizer.classList.remove("playing");
});

// Скидання шкали при зміні треку
audio.addEventListener("emptied", () => {
    progress.value = 0;
    currentTimeText.textContent = "0:00";
    durationText.textContent = "0:00";
});



// ===== XEDUCS TRACK LIST =====

const tracksList = document.getElementById("tracks-list");

function renderTracks() {
    tracksList.innerHTML = "";

    songs.forEach((song, index) => {
        const track = document.createElement("button");
        track.type = "button";
        track.className = "track-item";

        if (index === songIndex) {
            track.classList.add("active");
        }

        const cover = document.createElement("img");
        cover.className = "track-cover";
        cover.src = song.cover || "images/cover1.png";
        cover.alt = "Обкладинка: " + song.title;

        const info = document.createElement("div");
        info.className = "track-info";

        const title = document.createElement("h3");
        title.textContent = song.title;

        const artistName = document.createElement("p");
        artistName.textContent = song.artist;

        info.append(title, artistName);

        const playIcon = document.createElement("span");
        playIcon.className = "track-play";
        playIcon.textContent =
            index === songIndex && !audio.paused ? "♫" : "▶";

        track.append(cover, info, playIcon);

        track.addEventListener("click", () => {
            if (index === songIndex) {
                if (audio.paused) {
                    audio.play().catch(console.error);
                } else {
                    audio.pause();
                }
            } else {
                songIndex = index;
                loadSong(songIndex);
                audio.play().catch(console.error);
            }

            renderTracks();
        });

        tracksList.appendChild(track);
    });
}

// Оновлення списку при запуску і паузі
audio.addEventListener("play", renderTracks);
audio.addEventListener("pause", renderTracks);

// Оновлення активної пісні при перемиканні
audio.addEventListener("loadedmetadata", renderTracks);

// Перший показ списку
renderTracks();



// Перевірка шляхів до музики та обкладинок
console.table(
    songs.map(song => ({
        title: song.title,
        audio: song.src,
        cover: song.cover
    }))
);


// ===== XEDUCS ORIGINALS PLAYER =====

const originalBtn = document.getElementById("play-original");

if (originalBtn) {
    originalBtn.addEventListener("click", () => {
        // Шукаємо власну гітарну композицію
        const originalIndex = songs.findIndex(
            song => song.title === "Guitar Solo"
        );

        if (originalIndex === -1) {
            console.error("Guitar Solo не знайдено");
            return;
        }

        songIndex = originalIndex;
        loadSong(songIndex);
        playSong();
        renderTracks();
    });
}


// ===== NEW GUITAR ORIGINAL =====

const newGuitarBtn = document.getElementById("play-new-guitar");

if (newGuitarBtn) {
    newGuitarBtn.addEventListener("click", () => {
        const index = songs.findIndex(
            song => song.title === "XEDUCS - New Guitar"
        );

        if (index === -1) return;

        songIndex = index;
        loadSong(songIndex);
        playSong();
        renderTracks();
    });
}