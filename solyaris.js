document.addEventListener('DOMContentLoaded', function() {
    // звёзды
    for (let i = 0; i < 200; i++) {
        let s = document.createElement('div');
        s.className = 'star';
        s.style.width = Math.random() * 2 + 1 + 'px';
        s.style.height = s.style.width;
        s.style.left = Math.random() * 100 + '%';
        s.style.top = Math.random() * 100 + '%';
        s.style.animationDelay = Math.random() * 5 + 's';
        s.style.animationDuration = Math.random() * 2 + 2 + 's';
        const starContainer = document.getElementById('starContainer');
        if (starContainer) starContainer.appendChild(s);
    }

    // ========== ДАННЫЕ ДЛЯ СМЕН ==========
    const shiftsData = {
        1: {
            name: "призрак в системе",
            realClues: [
                { id: "kelvin_log", title: "лог сессии Кельвина", content: "[ошибка] 23:15:44 - сессия Кельвина активна 180 дней. pid 4913", isReal: true }
            ],
            fakeClues: [
                { id: "f1", title: "сбой шины данных", content: "[предупреждение] 11:23:07 - сбой шины данных sec-73. неисправность в модуле памяти." },
                { id: "f2", title: "ошибка подключения", content: "[ошибка] 11:24:12 - невозможно подключиться к модулю okean.core. таймаут соединения." },
                { id: "f3", title: "потеря пакетов", content: "[предупреждение] 11:34:56 - потеря пакетов 47% на канале 4d. возможны помехи." },
                { id: "f4", title: "неизвестный пользователь", content: "[ошибка] 11:41:03 - сессия неизвестного пользователя с ip 0.0.0.0. доступ ограничен." },
                { id: "f5", title: "ошибка четности", content: "[критично] 12:01:22 - ошибка четности в блоке памяти 0x7F3A. данные повреждены." },
                { id: "f6", title: "перегрузка процессора", content: "[предупреждение] 12:15:44 - загрузка cpu 99%. аномальная активность." },
                { id: "f7", title: "сбой файловой системы", content: "[ошибка] 12:28:33 - не удалось смонтировать раздел /var/log. система в нестабильном состоянии." },
                { id: "f8", title: "подозрительный трафик", content: "[безопасность] 12:42:17 - обнаружен исходящий трафик на неизвестный адрес. возможна утечка данных." },
                { id: "f9", title: "ошибка синхронизации", content: "[ошибка] 12:56:08 - потеря синхронизации с сервером времени. возможны расхождения в логах." },
                { id: "f10", title: "кеш поврежден", content: "[предупреждение] 13:10:44 - кеш процессора поврежден. требуется перезагрузка узла." }
            ],
            archiveFiles: [
                { name: "system_log_2024_12_01.log", title: "системный лог", content: "архив системных сообщений за декабрь 2154. зафиксированы множественные ошибки подключения." },
                { name: "exit_protocol.md", title: "протокол увольнения", content: "протокол увольнения сотрудника: перед удалением данных необходимо закрыть активную сессию командой terminate_session(pid)." },
                { name: "last_words_of_crew.log", title: "последнее сообщение команды", content: "если вы читаете это... значит нас уже нет. не удаляйте наши данные. закройте сессии." },
                { name: "unknown_message.log", title: "неизвестное сообщение", content: "не трогай нас... мы ещё здесь... нам больно..." },
                { name: "session_backup_2025_01.sav", title: "резервная копия", content: "бэкап сессий от 15.01.2155: кельвин(4913), хари(4914), снаут(4915)." },
                { name: "crew_manifest_old.txt", title: "манифест команды", content: "состав экипажа: кельвин К., хари, снаут. психологический профиль: все сотрудники испытывали стресс перед исчезновением." }
            ],
            updateMessage: "не трогай нас! мы ещё здесь...",
            choiceAText: "игнорировать предупреждение",
            choiceBText: "отменить и проверить логи",
            trustChangeA: -20,
            trustChangeB: 10,
            correctDialog: "Гибарян, обновление не запустилось. Проверь журнал ошибок, там что-то важное. Подожди, активная сессия?",
            wrongDialog: "Ты уверен? обновление заблокировано. Придётся разбираться самому.",
            successNote: "смена 1: отменил обновление и проверил логи. нашёл лог сессии кельвина.",
            failNote: "смена 1: проигнорировал предупреждение, доверие упало. но лог найден."
        }
    };

    let currentShift = 1;
    let game = {
        trust: 50,
        clues: [],
        choiceMade: false,
        correct: false,
        shiftCompleted: false
    };

    function getCurrentData() { return shiftsData[currentShift]; }

    function renderLog() {
        const container = document.getElementById('errorlogContainer');
        if (!container) return;
        const data = getCurrentData();
        let html = '';
        for (let fake of data.fakeClues) {
            html += `<div class="log-line" data-type="fake" data-id="${fake.id}">${fake.content}</div>`;
        }
        for (let clue of data.realClues) {
            if (!game.clues.includes(clue.id)) {
                html += `<div class="log-line" data-type="clue" data-id="${clue.id}">${clue.content}</div>`;
            } else {
                html += `<div class="log-line clue-found">✅ ${clue.content} (улика найдена)</div>`;
            }
        }
        container.innerHTML = html;
        
        document.querySelectorAll('.log-line[data-type]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const type = el.dataset.type;
                const id = el.dataset.id;
                if (type === 'clue') {
                    const clue = data.realClues.find(c => c.id === id);
                    if (clue && !game.clues.includes(clue.id)) openModal(clue, true);
                } else if (type === 'fake') {
                    const fake = data.fakeClues.find(f => f.id === id);
                    if (fake) openModal(fake, false);
                }
            });
        });
    }

    function renderArchive() {
        const container = document.getElementById('archiveContainer');
        if (!container) return;
        const data = getCurrentData();
        let html = '';
        for (let file of data.archiveFiles) {
            html += `<div class="archive-file" data-file="${file.name}">📄 ${file.name}</div>`;
        }
        container.innerHTML = html;
        
        document.querySelectorAll('.archive-file').forEach(el => {
            el.addEventListener('click', () => {
                const file = data.archiveFiles.find(f => f.name === el.dataset.file);
                if (file) openModal(file, false);
            });
        });
    }

    function openModal(item, isRealClue) {
        const modal = document.getElementById('modalOverlay');
        document.getElementById('modalTitle').innerText = item.title;
        document.getElementById('modalContent').innerHTML = item.content;
        const buttonsDiv = document.getElementById('modalButtons');
        if (isRealClue && !game.clues.includes(item.id)) {
            buttonsDiv.innerHTML = `<button class="modal-btn" id="modalTakeBtn">забрать улику</button><button class="modal-btn" id="modalCloseBtn">закрыть</button>`;
            document.getElementById('modalTakeBtn').onclick = () => { takeClue(item.id); modal.classList.remove('active'); };
        } else {
            buttonsDiv.innerHTML = `<button class="modal-btn" id="modalCloseBtn">закрыть</button>`;
        }
        document.getElementById('modalCloseBtn').onclick = () => modal.classList.remove('active');
        modal.classList.add('active');
    }

    function takeClue(clueId) {
        if (!game.clues.includes(clueId)) {
            game.clues.push(clueId);
            renderLog();
            renderNotebook();
        }
    }

    function renderNotebook() {
        const data = getCurrentData();
        const cluesList = document.getElementById('cluesList');
        const notesList = document.getElementById('notesList');
        if (!cluesList || !notesList) return;
        
        if (game.clues.length === 0) {
            cluesList.innerHTML = '<div class="notebook-clue">нет улик</div>';
        } else {
            let html = '';
            for (let clueId of game.clues) {
                const clue = data.realClues.find(c => c.id === clueId);
                if (clue) html += `<div class="notebook-clue"><strong>${clue.title}</strong><br>${clue.content}</div>`;
            }
            cluesList.innerHTML = html;
        }
        
        const allRealIds = data.realClues.map(c => c.id);
        const hasAllClues = allRealIds.every(id => game.clues.includes(id));
        let note = '';
        if (game.correct && hasAllClues) note = data.successNote;
        else if (!game.correct && hasAllClues) note = data.failNote;
        else if (game.choiceMade && !hasAllClues) note = `смена ${currentShift}: выбор сделан, но улики не найдены. проверь журнал ошибок.`;
        else note = `смена ${currentShift}: ожидание действий.`;
        notesList.innerHTML = `<div class="notebook-clue">${note}</div>`;
        document.getElementById('trustValue').innerText = game.trust;
        document.getElementById('shiftNumber').innerText = currentShift;
    }

    function showDialog(msg, callback) {
        let dlg = document.getElementById('characterDialog');
        document.getElementById('dialogMsg').innerHTML = msg;
        dlg.classList.add('active');
        let close = () => {
            dlg.classList.remove('active');
            document.getElementById('dialogCloseBtn').removeEventListener('click', close);
            if (callback) callback();
        };
        document.getElementById('dialogCloseBtn').addEventListener('click', close);
    }

    function startUpdate() {
        console.log('startUpdate вызвана'); // отладка
        if (game.choiceMade || game.shiftCompleted) {
            console.log('выбор уже сделан или смена завершена');
            return;
        }
        const data = getCurrentData();
        const errorCardText = document.getElementById('error-card-text');
        if (errorCardText) errorCardText.innerHTML = data.updateMessage;
        
        let overlay = document.getElementById('choiceOverlay');
        if (!overlay) {
            console.error('choiceOverlay не найден');
            return;
        }
        overlay.classList.add('active');
        setTimeout(() => {
            overlay.classList.remove('active');
            const choiceButtons = document.getElementById('choiceButtons');
            if (choiceButtons) {
                choiceButtons.innerHTML = `<button class="choice-btn" id="choiceA">${data.choiceAText}</button><button class="choice-btn" id="choiceB">${data.choiceBText}</button>`;
            }
            overlay.classList.add('active');
            const choiceA = document.getElementById('choiceA');
            const choiceB = document.getElementById('choiceB');
            if (choiceA) choiceA.onclick = () => makeChoice('A');
            if (choiceB) choiceB.onclick = () => makeChoice('B');
        }, 1500);
    }

    function makeChoice(choice) {
        document.getElementById('choiceOverlay').classList.remove('active');
        game.choiceMade = true;
        const data = getCurrentData();
        if (choice === 'B') {
            game.trust = Math.min(100, game.trust + data.trustChangeB);
            game.correct = true;
            showDialog(data.correctDialog, () => setActivePage('errorlog'));
        } else {
            game.trust = Math.max(0, game.trust + data.trustChangeA);
            game.correct = false;
            showDialog(data.wrongDialog, () => setActivePage('main'));
        }
        renderNotebook();
    }

    function setActivePage(pageId) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const activePage = document.getElementById(`page-${pageId}`);
        if (activePage) activePage.classList.add('active');
        document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
        const activeNav = document.querySelector(`.nav-item[data-page="${pageId}"]`);
        if (activeNav) activeNav.classList.add('active');
    }

    function finishShift() {
        const data = getCurrentData();
        const allRealIds = data.realClues.map(c => c.id);
        const hasAllClues = allRealIds.every(id => game.clues.includes(id));
        if (hasAllClues && game.choiceMade && !game.shiftCompleted) {
            game.shiftCompleted = true;
            const endScreen = document.getElementById('shiftEndScreen');
            if (endScreen) {
                endScreen.classList.add('active');
                const endTitle = document.getElementById('shiftEndTitle');
                if (endTitle) endTitle.innerHTML = `смена ${currentShift} завершена`;
            }
        } else if (!hasAllClues && game.choiceMade) {
            showDialog('не все улики найдены. проверь журнал ошибок.', () => {});
        } else if (!game.choiceMade) {
            showDialog('сначала выполни обновление системы.', () => {});
        }
    }

    function nextShift() {
        currentShift++;
        if (currentShift > 6) { 
            alert('поздравляем! вы прошли игру!'); 
            location.reload(); 
            return; 
        }
        game = { trust: game.trust, clues: [], choiceMade: false, correct: false, shiftCompleted: false };
        const endScreen = document.getElementById('shiftEndScreen');
        if (endScreen) endScreen.classList.remove('active');
        renderLog(); 
        renderArchive(); 
        renderNotebook();
        setActivePage('main');
        const nextData = shiftsData[currentShift];
        if (nextData) {
            showDialog(`начало смены ${currentShift}: ${nextData.name}.`, () => {});
        }
    }

    // === ПОДКЛЮЧЕНИЕ СОБЫТИЙ ===
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.onclick = () => {
            const titleScreen = document.getElementById('titleScreen');
            if (titleScreen) {
                titleScreen.style.opacity = '0';
                setTimeout(() => { 
                    titleScreen.style.display = 'none'; 
                    const storyScreen = document.getElementById('storyScreen');
                    if (storyScreen) storyScreen.style.display = 'flex'; 
                }, 500);
            }
        };
    }

    const storyContinue = document.getElementById('storyContinue');
    if (storyContinue) {
        storyContinue.onclick = () => { 
            const storyScreen = document.getElementById('storyScreen');
            if (storyScreen) storyScreen.style.display = 'none'; 
            const tutorialScreen = document.getElementById('tutorialScreen');
            if (tutorialScreen) tutorialScreen.style.display = 'flex'; 
        };
    }

    const startShiftBtn = document.getElementById('startShiftBtn');
    if (startShiftBtn) {
        startShiftBtn.onclick = () => { 
            const tutorialScreen = document.getElementById('tutorialScreen');
            if (tutorialScreen) tutorialScreen.style.display = 'none'; 
            const computerWrapper = document.getElementById('computerWrapper');
            if (computerWrapper) computerWrapper.style.display = 'block'; 
            renderLog(); 
            renderArchive(); 
            renderNotebook(); 
            setActivePage('main'); 
        };
    }

    const adminUpdateBtn = document.getElementById('adminUpdateBtn');
    if (adminUpdateBtn) {
        console.log('кнопка обновления найдена, вешаем обработчик');
        adminUpdateBtn.onclick = startUpdate;
    } else {
        console.error('adminUpdateBtn не найдена в DOM');
    }

    const notebookBtn = document.getElementById('notebookBtn');
    if (notebookBtn) notebookBtn.onclick = () => setActivePage('notebook');

    const exitBtn = document.getElementById('exitBtn');
    if (exitBtn) exitBtn.onclick = finishShift;

    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) restartBtn.onclick = nextShift;

    document.querySelectorAll('.nav-item').forEach(btn => { 
        btn.onclick = () => setActivePage(btn.dataset.page); 
    });
    
    console.log('инициализация завершена');
});