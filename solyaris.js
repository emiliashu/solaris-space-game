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

    // ========== ВСЕ ФАЙЛЫ АРХИВА ==========
    const allArchiveFiles = [
        { name: "system_log_2024_12_01.log", title: "системный лог", content: "архив системных сообщений за декабрь 2154. зафиксированы множественные ошибки подключения.", isClue: false, showFromShift: 1 },
        { name: "exit_protocol.md", title: "инструкция по увольнению", content: "протокол увольнения сотрудника: перед удалением данных необходимо закрыть активную сессию командой terminate_session(pid).", isClue: true, clueId: "exit_protocol", clueTitle: "инструкция по увольнению", showFromShift: 4 },
        { name: "last_words_of_crew.log", title: "последнее письмо команды", content: "", isClue: true, clueId: "terminate_command", clueTitle: "команда terminate_session", showFromShift: 5, isLetter: true },
        { name: "unknown_message.log", title: "неизвестное сообщение", content: "не трогай нас... мы ещё здесь... нам больно... закройте сессии, не удаляйте нас.", isClue: true, clueId: "close_sessions_hint", clueTitle: "подсказка из архива", showFromShift: 3 },
        { name: "session_backup_2025_01.sav", title: "резервная копия", content: "бэкап сессий от 15.01.2155: кельвин(4913), хари(4914), снаут(4915).", isClue: false, showFromShift: 1 },
        { name: "crew_manifest_old.txt", title: "манифест команды", content: "состав экипажа: кельвин К., хари, снаут. должности: инженер, ai-специалист, аналитик.", isClue: false, showFromShift: 1 }
    ];

    // Улики в журнале ошибок (смены 1 и 2)
    let errorLogClues = {
        1: { id: "kelvin_log", title: "лог сессии Кельвина", content: "[ошибка] 23:15:44 - сессия Кельвина активна 180 дней. pid 4913", found: false },
        2: [
            { id: "hari_log", title: "лог сессии Хари", content: "[предупреждение] сессия Хари активна 180 дней. pid 4914", found: false },
            { id: "snaut_log", title: "лог сессии Снаута", content: "[предупреждение] сессия Снаута активна 180 дней. pid 4915", found: false },
            { id: "system_rule", title: "правило системы", content: "[система] нельзя удалять данные активного сотрудника", found: false }
        ]
    };

    // Архивные улики
    let archiveCluesStatus = {
        "close_sessions_hint": false,
        "exit_protocol": false,
        "terminate_command": false
    };

    function resetGame() {
        for (let s in errorLogClues) {
            if (Array.isArray(errorLogClues[s])) {
                for (let clue of errorLogClues[s]) clue.found = false;
            } else {
                errorLogClues[s].found = false;
            }
        }
        for (let key in archiveCluesStatus) {
            archiveCluesStatus[key] = false;
        }
        localStorage.removeItem('solaris_error_clues');
        localStorage.removeItem('solaris_archive_clues');
        game = {
            trust: 50,
            choiceMade: false,
            correct: false,
            shiftCompleted: false
        };
        currentShift = 1;
        saveClues();
    }

    function loadClues() {
        const savedError = localStorage.getItem('solaris_error_clues');
        if (savedError) {
            const saved = JSON.parse(savedError);
            for (let s in errorLogClues) {
                if (Array.isArray(errorLogClues[s])) {
                    for (let clue of errorLogClues[s]) {
                        if (saved[clue.id]) clue.found = saved[clue.id];
                    }
                } else if (saved[errorLogClues[s].id]) {
                    errorLogClues[s].found = saved[errorLogClues[s].id];
                }
            }
        }
        const savedArchive = localStorage.getItem('solaris_archive_clues');
        if (savedArchive) {
            const saved = JSON.parse(savedArchive);
            for (let key in archiveCluesStatus) {
                if (saved[key]) archiveCluesStatus[key] = saved[key];
            }
        }
    }

    function saveClues() {
        const toSaveError = {};
        for (let s in errorLogClues) {
            if (Array.isArray(errorLogClues[s])) {
                for (let clue of errorLogClues[s]) toSaveError[clue.id] = clue.found;
            } else {
                toSaveError[errorLogClues[s].id] = errorLogClues[s].found;
            }
        }
        localStorage.setItem('solaris_error_clues', JSON.stringify(toSaveError));
        localStorage.setItem('solaris_archive_clues', JSON.stringify(archiveCluesStatus));
    }

    const shiftsData = {
        1: {
            name: "призрак в системе",
            updateMessage: "нЕ тРоГаЙ нАс!<br>мЫ еЩЁ зДеСь...",
            choiceAText: "игнорировать предупреждение",
            choiceBText: "отменить и проверить логи",
            trustChangeA: -20,
            trustChangeB: 10,
            correctDialog: { person: "Николь", text: "Гибарян, я вижу, обновление не запустилось. Что случилось? Разберись, пожалуйста." },
            wrongDialog: { person: "Николь", text: "Ты уверен, что справляешься? Может, подключить Бертона?" },
            hint: "Проверь журнал ошибок",
            needHint: true,
            clueInErrorLog: true
        },
        2: {
            name: "три призрачных сессии",
            updateMessage: "мЫ нЕ зАкОнЧиЛи...<br>тРи сЕсСиИ вСё еЩЁ аКтИвНы",
            choiceAText: "принудительно завершить сессии",
            choiceBText: "отменить и запросить причину",
            trustChangeA: -10,
            trustChangeB: 15,
            correctDialog: { person: "Бертон", text: "Эй, Гибарян. А может, они правда там? Не физически, но... ну, знаешь?" },
            wrongDialog: null,
            hint: "Найди ответ системы",
            needHint: true,
            clueInErrorLog: true,
            hasMessageOnMain: true,
            mainMessage: "Мы не закончили"
        },
        3: {
            name: "голоса из чата",
            updateMessage: "НЕ УДАЛЯЙ МЕНЯ.<br>Я БОЮСЬ ТЕМНОТЫ",
            choiceAText: "«так надо»",
            choiceBText: "«обещаю помочь»",
            trustChangeA: -15,
            trustChangeB: 20,
            correctDialog: { person: "Бертон", text: "Ты молодец, что ответил Хари. Я бы испугался. А ты смелый и... хороший." },
            wrongDialog: { person: "Николь", text: "Ты уверен, что справляешься? Может, подключить Бертона?" },
            hint: "Открой файл в архиве",
            needHint: true
        },
        4: {
            name: "технический барьер",
            updateMessage: "ОШИБКА FOREIGN KEY CONSTRAINT<br>НЕВОЗМОЖНО УДАЛИТЬ ЗАПИСЬ",
            choiceAText: "взломать БД",
            choiceBText: "прочитать инструкцию",
            trustChangeA: -30,
            trustChangeB: 5,
            correctDialog: { person: "Николь", text: "Я смотрела логи. Хорошая работа. Продолжай." },
            wrongDialog: null,
            hint: "Найди файл в архиве",
            needHint: true
        },
        5: {
            name: "последнее письмо",
            updateMessage: "В АРХИВЕ ОБНАРУЖЕН НОВЫЙ ФАЙЛ<br>last_words_of_crew.log",
            choiceAText: "пропустить файл",
            choiceBText: "прочитать и сохранить",
            trustChangeA: 0,
            trustChangeB: 0,
            correctDialog: { person: "Бертон", text: "Они прощаются?.. Грустно. Сделай для них всё правильно, ладно?" },
            wrongDialog: null,
            needHint: false,
            hasLetter: true
        }
    };

    const finalTexts = {
        win: {
            80: "ПОБЕДА\n\nВЫ ПРОВЕЛИ НОЧНОЙ РЕЛИЗ УСПЕШНО!\n\nСистема ответила:\n«Спасибо, Гибарян. Ты нас отпустил.\nУдачи тебе. Береги станцию.\nНам было хорошо... пока мы были здесь».\n\nА потом — тихий голос в динамиках:\n«Гибарян... приходи в архив иногда.\nМы будем тебя ждать».",
            50: "ПОБЕДА\n\nВЫ ПРОВЕЛИ НОЧНОЙ РЕЛИЗ УСПЕШНО!\n\nСистема ответила:\n«Спасибо. Ты справился. Удачи на станции».",
            20: "ПОБЕДА\n\nВЫ ПРОВЕЛИ НОЧНОЙ РЕЛИЗ УСПЕШНО!\n\nСистема ответила:\n«Сессии закрыты. Обновление завершено. Работайте».",
            1: "ПОБЕДА\n\nВЫ ПРОВЕЛИ НОЧНОЙ РЕЛИЗ УСПЕШНО!\n\nСистема ответила:\n«Сессии закрыты. Приступайте к работе»."
        },
        lose: "ПОРАЖЕНИЕ\n\nСИСТЕМА ЗАБЛОКИРОВАНА\nОБНОВЛЕНИЕ ПРОВАЛЕНО\n\n«ACCESS DENIED. Доверие аннулировано.»"
    };

    let currentShift = 1;
    let game = {
        trust: 50,
        choiceMade: false,
        correct: false,
        shiftCompleted: false
    };

    let mainMessageTimeout = null;

    function getCurrentErrorClues() {
        const clues = errorLogClues[currentShift];
        if (!clues) return [];
        if (Array.isArray(clues)) return clues;
        return [clues];
    }

    function showMainMessage(message) {
        const msgDiv = document.getElementById('shiftMessage');
        msgDiv.innerHTML = message;
        msgDiv.classList.add('show');
        if (mainMessageTimeout) clearTimeout(mainMessageTimeout);
        mainMessageTimeout = setTimeout(() => {
            msgDiv.classList.remove('show');
        }, 5000);
    }

    function renderLog() {
        const container = document.getElementById('errorlogContainer');
        if (!container) return;
        
        const fakeClues = [
            "[предупреждение] 11:23:07 - сбой шины данных sec-73",
            "[ошибка] 11:24:12 - невозможно подключиться к модулю okean.core",
            "[предупреждение] 11:34:56 - потеря пакетов 47% на канале 4d",
            "[ошибка] 11:41:03 - сессия неизвестного пользователя с ip 0.0.0.0",
            "[критично] 12:01:22 - ошибка четности в блоке памяти",
            "[предупреждение] 12:15:44 - загрузка cpu 99%",
            "[ошибка] 12:28:33 - не удалось смонтировать раздел /var/log"
        ];
        
        let html = '';
        for (let fake of fakeClues) {
            html += `<div class="log-line" data-type="fake">${fake}</div>`;
        }
        
        const currentClues = getCurrentErrorClues();
        for (let clue of currentClues) {
            if (!clue.found) {
                html += `<div class="log-line" data-type="clue" data-id="${clue.id}">${clue.content}</div>`;
            } else {
                html += `<div class="log-line clue-found">✅ ${clue.content} (улика найдена)</div>`;
            }
        }
        
        if (currentShift === 4) {
            html += `<div class="log-line">[ошибка] FOREIGN KEY CONSTRAINT - невозможно удалить запись</div>`;
        }
        
        container.innerHTML = html;
        
        document.querySelectorAll('.log-line[data-type="clue"]').forEach(el => {
            el.addEventListener('click', () => {
                const id = el.dataset.id;
                const clue = getCurrentErrorClues().find(c => c.id === id);
                if (clue && !clue.found) openErrorModal(clue);
            });
        });
    }

    function openErrorModal(clue) {
        const modal = document.getElementById('modalOverlay');
        document.getElementById('modalTitle').innerText = clue.title;
        document.getElementById('modalContent').innerHTML = clue.content;
        
        const buttonsDiv = document.getElementById('modalButtons');
        buttonsDiv.innerHTML = `<button class="modal-btn" id="modalTakeBtn">забрать улику</button><button class="modal-btn" id="modalCloseBtn">закрыть</button>`;
        document.getElementById('modalTakeBtn').onclick = () => { 
            if (!clue.found) {
                clue.found = true;
                saveClues();
                renderLog();
                renderNotebook();
            }
            modal.classList.remove('active');
        };
        document.getElementById('modalCloseBtn').onclick = () => modal.classList.remove('active');
        modal.classList.add('active');
    }

    function openArchiveModal(file, isClue, clueId, clueTitle) {
        const modal = document.getElementById('modalOverlay');
        document.getElementById('modalTitle').innerText = file.title;
        document.getElementById('modalContent').innerHTML = file.content;
        
        const buttonsDiv = document.getElementById('modalButtons');
        if (isClue && !archiveCluesStatus[clueId]) {
            buttonsDiv.innerHTML = `<button class="modal-btn" id="modalTakeBtn">забрать улику</button><button class="modal-btn" id="modalCloseBtn">закрыть</button>`;
            document.getElementById('modalTakeBtn').onclick = () => {
                archiveCluesStatus[clueId] = true;
                saveClues();
                renderArchive();
                renderNotebook();
                modal.classList.remove('active');
            };
        } else {
            buttonsDiv.innerHTML = `<button class="modal-btn" id="modalCloseBtn">закрыть</button>`;
        }
        document.getElementById('modalCloseBtn').onclick = () => modal.classList.remove('active');
        modal.classList.add('active');
    }

    function renderArchive() {
        const container = document.getElementById('archiveContainer');
        if (!container) return;
        let html = '';
        for (let file of allArchiveFiles) {
            if (file.showFromShift > currentShift) continue;
            let displayName = file.name;
            if (file.isClue && archiveCluesStatus[file.clueId]) {
                displayName = `✅ ${file.name} (улика найдена)`;
            }
            html += `<div class="archive-file" data-file="${file.name}">📄 ${displayName}</div>`;
        }
        container.innerHTML = html;
        
        document.querySelectorAll('.archive-file').forEach(el => {
            el.addEventListener('click', () => {
                const fileName = el.dataset.file;
                const file = allArchiveFiles.find(f => f.name === fileName);
                if (file) {
                    if (fileName === "last_words_of_crew.log" && currentShift === 5) {
                        showLetter();
                    } else if (file.isClue) {
                        openArchiveModal(file, true, file.clueId, file.clueTitle);
                    } else {
                        openArchiveModal(file, false, null, null);
                    }
                }
            });
        });
    }

    let letterParts = [];
    let letterPartIndex = 0;

    function showLetter() {
        letterParts = [
            "Это наша последняя запись.\n\nМы — команда станции Солярис-7.\nКрис Кельвин, Хари, Снаут.",
            "Мы поняли, что океан реагирует на наши эмоции.\nОн не просто вода. Он помнит. Он чувствует.",
            "Мы пытались обновить систему во время сеанса связи.\nОкеан ответил. Он не убил нас.\nОн... отразил.",
            "Наши тела исчезли. Мы стали частью океана.\nНо наши цифровые копии остались в системе.\nНаши сессии зависли.",
            "Теперь мы — и там, и здесь.\nНо мы не живые. И не мёртвые.\nМы просто... застряли.",
            "Если вы читаете это — значит, нас уже нет.\nНе пытайтесь нас удалить. Это не сработает.",
            "Вот что нужно сделать:\n1. ЗАКРОЙТЕ НАШИ СЕССИИ\nКоманда: terminate_session(PID)\nНаши PID:\nКельвин — 4913\nХари — 4914\nСнаут — 4915",
            "2. ДАННЫЕ УЙДУТ В АРХИВ\nСистема сделает всё сама.\nНе удаляйте нас. Пусть мы останемся в архиве.",
            "3. ОБНОВЛЕНИЕ ЗАПУСТИТСЯ\nПосле закрытия сессий — обновление пройдёт.\nСтанция заработает как новая.",
            "Мы знаем, что просим многого.\nВы нас не знали. Мы для вас — призраки.",
            "Но мы были здесь. Мы любили эту станцию.\nМы смотрели на океан и верили, что не одни.",
            "Не дайте нам исчезнуть навсегда.\nПросто закройте дверь. Тихо. Без боли.",
            "Спасибо тому, кто это прочитает.\nСпасибо тому, кто нас отпустит.\n\nКельвин, Хари, Снаут.\nПоследняя запись перед выходом в эфир."
        ];
        letterPartIndex = 0;
        const letterScreen = document.getElementById('finalLetterScreen');
        const letterText = document.getElementById('finalLetterText');
        const nextBtn = document.getElementById('finalLetterNextBtn');
        const closeBtn = document.getElementById('finalLetterCloseBtn');
        
        letterText.innerHTML = letterParts[0].replace(/\n/g, '<br>');
        letterScreen.classList.add('active');
        
        nextBtn.onclick = () => {
            letterPartIndex++;
            if (letterPartIndex < letterParts.length) {
                letterText.innerHTML = letterParts[letterPartIndex].replace(/\n/g, '<br>');
            } else {
                nextBtn.style.display = 'none';
                closeBtn.style.display = 'block';
            }
        };
        
        closeBtn.onclick = () => {
            letterScreen.classList.remove('active');
            if (!archiveCluesStatus["terminate_command"]) {
                archiveCluesStatus["terminate_command"] = true;
                saveClues();
                renderArchive();
                renderNotebook();
            }
            showDialog(shiftsData[5].correctDialog.person, shiftsData[5].correctDialog.text);
            nextBtn.style.display = 'block';
            closeBtn.style.display = 'none';
        };
    }

    function renderNotebook() {
        const cluesList = document.getElementById('cluesList');
        const notesList = document.getElementById('notesList');
        
        let allFoundHtml = '';
        
        for (let s in errorLogClues) {
            if (Array.isArray(errorLogClues[s])) {
                for (let clue of errorLogClues[s]) {
                    if (clue.found) allFoundHtml += `<div class="notebook-clue"><strong>${clue.title}</strong><br>${clue.content}</div>`;
                }
            } else if (errorLogClues[s].found) {
                allFoundHtml += `<div class="notebook-clue"><strong>${errorLogClues[s].title}</strong><br>${errorLogClues[s].content}</div>`;
            }
        }
        
        for (let file of allArchiveFiles) {
            if (file.isClue && archiveCluesStatus[file.clueId]) {
                allFoundHtml += `<div class="notebook-clue"><strong>${file.clueTitle}</strong><br>${file.content}</div>`;
            }
        }
        
        cluesList.innerHTML = allFoundHtml || '<div class="notebook-clue">нет улик</div>';
        
        let allFound = true;
        const data = shiftsData[currentShift];
        
        if (data && data.clueInErrorLog) {
            const currentClues = getCurrentErrorClues();
            allFound = currentClues.every(c => c.found);
        } else if (data) {
            if (currentShift === 3) allFound = archiveCluesStatus["close_sessions_hint"];
            else if (currentShift === 4) allFound = archiveCluesStatus["exit_protocol"];
            else if (currentShift === 5) allFound = archiveCluesStatus["terminate_command"];
        }
        
        let note = '';
        if (game.correct && allFound) note = `смена ${currentShift}: правильный выбор, улики найдены.`;
        else if (!game.correct && allFound) note = `смена ${currentShift}: неправильный выбор, но улики найдены.`;
        else if (game.choiceMade && !allFound) note = `смена ${currentShift}: выбор сделан, но не все улики найдены.`;
        else note = `смена ${currentShift}: ожидание действий.`;
        notesList.innerHTML = `<div class="notebook-clue">${note}</div>`;
        
        document.getElementById('trustValue').innerText = game.trust;
        document.getElementById('shiftNumber').innerText = currentShift;
    }

    function showDialog(person, msg, callback) {
        const dlg = document.getElementById('characterDialog');
        document.getElementById('dialogPortrait').innerHTML = person === 'Николь' ? '👩‍🚀' : (person === 'Бертон' ? '👨‍🔧' : '🤖');
        document.getElementById('dialogMsg').innerHTML = msg;
        dlg.classList.add('active');
        const close = () => {
            dlg.classList.remove('active');
            document.getElementById('dialogCloseBtn').removeEventListener('click', close);
            if (callback) callback();
        };
        document.getElementById('dialogCloseBtn').addEventListener('click', close);
    }

    function startUpdate() {
        if (game.choiceMade || game.shiftCompleted) return;
        const data = shiftsData[currentShift];
        if (!data) return;
        document.getElementById('error-card-text').innerHTML = data.updateMessage;
        
        const overlay = document.getElementById('choiceOverlay');
        overlay.classList.add('active');
        
        const choiceButtons = document.getElementById('choiceButtons');
        choiceButtons.innerHTML = `<button class="choice-btn" id="choiceA">${data.choiceAText}</button><button class="choice-btn" id="choiceB">${data.choiceBText}</button>`;
        
        const choiceA = document.getElementById('choiceA');
        const choiceB = document.getElementById('choiceB');
        choiceA.onclick = () => makeChoice('A');
        choiceB.onclick = () => makeChoice('B');
    }

    function makeChoice(choice) {
        document.getElementById('choiceOverlay').classList.remove('active');
        game.choiceMade = true;
        const data = shiftsData[currentShift];
        if (!data) return;
        
        if (choice === 'B') {
            game.trust = Math.min(100, game.trust + data.trustChangeB);
            game.correct = true;
            if (data.correctDialog) {
                showDialog(data.correctDialog.person, data.correctDialog.text, () => {
                    if (data.needHint) showDialog('Система', data.hint);
                });
            }
        } else {
            game.trust = Math.max(0, game.trust + data.trustChangeA);
            game.correct = false;
            if (data.wrongDialog) {
                showDialog(data.wrongDialog.person, data.wrongDialog.text);
            }
        }
        
        renderNotebook();
        setActivePage('main');
        
        // Показываем сообщение при возврате на главную после выбора в смене 2
        if (currentShift === 2 && data.hasMessageOnMain) {
            setTimeout(() => {
                showMainMessage(data.mainMessage);
            }, 500);
        }
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
        let allFound = true;
        const data = shiftsData[currentShift];
        
        if (!data) return;
        
        if (data.clueInErrorLog) {
            const currentClues = getCurrentErrorClues();
            allFound = currentClues.every(c => c.found);
        } else {
            if (currentShift === 3) allFound = archiveCluesStatus["close_sessions_hint"];
            else if (currentShift === 4) allFound = archiveCluesStatus["exit_protocol"];
            else if (currentShift === 5) allFound = archiveCluesStatus["terminate_command"];
        }
        
        if (allFound && game.choiceMade && !game.shiftCompleted) {
            game.shiftCompleted = true;
            document.getElementById('shiftEndScreen').classList.add('active');
            document.getElementById('shiftEndTitle').innerHTML = `смена ${currentShift} завершена`;
        } else if (!allFound && game.choiceMade) {
            showDialog('Система', 'Не все улики найдены. Проверь журнал ошибок или архив.', () => {});
        } else if (!game.choiceMade) {
            showDialog('Система', 'Сначала выполни обновление системы на панели администратора.', () => {});
        }
    }

    function nextShift() {
        currentShift++;
        
        if (currentShift > 6) {
            return;
        }
        
        if (currentShift === 6) {
            // Закрываем экран завершения смены
            document.getElementById('shiftEndScreen').classList.remove('active');
            // Показываем финальное решение
            setTimeout(() => {
                showFinalChoice();
            }, 100);
            return;
        }
        
        game = { trust: game.trust, choiceMade: false, correct: false, shiftCompleted: false };
        document.getElementById('shiftEndScreen').classList.remove('active');
        
        renderLog();
        renderArchive();
        renderNotebook();
        setActivePage('main');
        
        showDialog('Система', `Начало смены ${currentShift}: ${shiftsData[currentShift].name}.`, () => {});
    }

    function showFinalChoice() {
        const collectedCluesCount = (() => {
            let count = 0;
            for (let s in errorLogClues) {
                if (Array.isArray(errorLogClues[s])) {
                    for (let clue of errorLogClues[s]) if (clue.found) count++;
                } else if (errorLogClues[s].found) count++;
            }
            for (let key in archiveCluesStatus) if (archiveCluesStatus[key]) count++;
            return count;
        })();
        
        const overlay = document.getElementById('choiceOverlay');
        document.getElementById('error-card-text').innerHTML = `ИТОГОВОЕ РЕШЕНИЕ<br><br>СОБРАНО УЛИК: ${collectedCluesCount}/7<br>ДОВЕРИЕ: ${game.trust}%<br><br>АКТИВНЫЕ СЕССИИ:<br>Кельвин: PID 4913<br>Хари: PID 4914<br>Снаут: PID 4915`;
        document.getElementById('choiceButtons').innerHTML = `<button class="choice-btn" id="choiceA">закрыть сессии terminate_session(PID)</button><button class="choice-btn" id="choiceB">удалить данные прошлой команды</button>`;
        overlay.classList.add('active');
        
        document.getElementById('choiceA').onclick = () => finalMakeChoice('A');
        document.getElementById('choiceB').onclick = () => finalMakeChoice('B');
    }

    function finalMakeChoice(choice) {
        document.getElementById('choiceOverlay').classList.remove('active');
        
        if (choice === 'A') {
            game.trust = Math.min(100, game.trust + 50);
            showDialog('Николь', 'Гибарян... что бы ты ни решил — я за тобой. Действуй.', () => showFinal(true));
        } else {
            game.trust = 0;
            showDialog('Николь', 'Гибарян... что бы ты ни решил — я за тобой. Действуй.', () => showFinal(false));
        }
    }

    function showFinal(isWin) {
        const finalScreen = document.getElementById('finalScreen');
        const finalTitle = document.getElementById('finalTitle');
        const finalTextElem = document.getElementById('finalText');
        const finalStats = document.getElementById('finalStats');
        
        const collectedCluesCount = (() => {
            let count = 0;
            for (let s in errorLogClues) {
                if (Array.isArray(errorLogClues[s])) {
                    for (let clue of errorLogClues[s]) if (clue.found) count++;
                } else if (errorLogClues[s].found) count++;
            }
            for (let key in archiveCluesStatus) if (archiveCluesStatus[key]) count++;
            return count;
        })();
        
        finalStats.innerHTML = `СОБРАНО УЛИК: ${collectedCluesCount}/7 | ДОВЕРИЕ: ${game.trust}`;
        
        if (isWin && game.trust > 0) {
            finalTitle.innerHTML = "ПОБЕДА";
            if (game.trust >= 80) finalTextElem.innerHTML = finalTexts.win[80].replace(/\n/g, '<br>');
            else if (game.trust >= 50) finalTextElem.innerHTML = finalTexts.win[50].replace(/\n/g, '<br>');
            else if (game.trust >= 20) finalTextElem.innerHTML = finalTexts.win[20].replace(/\n/g, '<br>');
            else finalTextElem.innerHTML = finalTexts.win[1].replace(/\n/g, '<br>');
        } else {
            finalTitle.innerHTML = "ПОРАЖЕНИЕ";
            finalTextElem.innerHTML = finalTexts.lose.replace(/\n/g, '<br>');
        }
        
        finalScreen.classList.add('active');
    }

    // ========== СОБЫТИЯ ==========
    
    document.getElementById('startBtn').onclick = () => {
        resetGame();
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
    
    document.getElementById('storyContinue').onclick = () => {
        document.getElementById('storyScreen').style.display = 'none';
        document.getElementById('tutorialScreen').style.display = 'flex';
    };
    
    document.getElementById('startShiftBtn').onclick = () => {
        document.getElementById('tutorialScreen').style.display = 'none';
        document.getElementById('computerWrapper').style.display = 'block';
        renderLog();
        renderArchive();
        renderNotebook();
        setActivePage('main');
    };
    
    document.getElementById('adminUpdateBtn').onclick = startUpdate;
    document.getElementById('notebookBtn').onclick = () => setActivePage('notebook');
    document.getElementById('exitBtn').onclick = finishShift;
    document.getElementById('restartBtn').onclick = nextShift;
    document.getElementById('finalNewGameBtn').onclick = () => location.reload();
    
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.onclick = () => setActivePage(btn.dataset.page);
    });
    
    loadClues();
});