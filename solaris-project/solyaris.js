document.addEventListener('DOMContentLoaded', function () {

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

    let currentMinutes = 17;
    let currentHours = 17;
    let currentDay = 23;
    let currentMonth = 5;
    let currentYear = 2155;

    function updateClock() {
        const timeStr = `${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;
        const dateStr = `${currentDay.toString().padStart(2, '0')}.${currentMonth.toString().padStart(2, '0')}.${currentYear}`;
        const timeEl = document.getElementById('clockTime');
        const dateEl = document.getElementById('clockDate');
        if (timeEl) timeEl.innerText = timeStr;
        if (dateEl) dateEl.innerText = dateStr;
    }

    function addMinutes(minutes) {
        currentMinutes += minutes;
        if (currentMinutes >= 60) {
            currentHours += Math.floor(currentMinutes / 60);
            currentMinutes = currentMinutes % 60;
            if (currentHours >= 24) {
                currentHours = currentHours % 24;
                currentDay++;
                if (currentDay > 31) {
                    currentDay = 1;
                    currentMonth++;
                    if (currentMonth > 12) {
                        currentMonth = 1;
                        currentYear++;
                    }
                }
            }
        }
        updateClock();
    }

    function nextDay() {
        currentDay++;
        if (currentDay > 31) {
            currentDay = 1;
            currentMonth++;
            if (currentMonth > 12) {
                currentMonth = 1;
                currentYear++;
            }
        }
        currentHours = 17;
        currentMinutes = 17;
        updateClock();
    }

    function updateRandomMetrics() {
        const cpu = Math.floor(Math.random() * 30) + 70;
        const memory = Math.floor(Math.random() * 25) + 55;
        const network = Math.random() > 0.7 ? 'нестабильно' : 'стабильно';
        const temp = Math.floor(Math.random() * 30) + 45;
        
        const metrics = document.querySelectorAll('.metric');
        if (metrics.length >= 4) {
            metrics[0].innerHTML = `cpu: <span>${cpu}%</span>`;
            metrics[1].innerHTML = `память: <span>${memory}%</span>`;
            metrics[2].innerHTML = `сеть: <span>${network}</span>`;
            metrics[3].innerHTML = `температура: <span>${temp}°c</span>`;
        }
    }

    let metricsInterval = null;

    function startMetricsUpdates() {
        if (metricsInterval) clearInterval(metricsInterval);
        metricsInterval = setInterval(() => {
            const mainPage = document.getElementById('page-main');
            if (mainPage && mainPage.classList.contains('active')) {
                updateRandomMetrics();
            }
        }, 8000);
    }

    // ===== ФУНКЦИЯ ПЕЧАТАЮЩЕГО ТЕКСТА (определена ДО использования) =====
    function typeText(element, text, speed = 60, callback = null) {
        let i = 0;
        element.innerHTML = '';
        element.style.opacity = '1';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                const cursor = document.createElement('span');
                cursor.className = 'cursor';
                element.appendChild(cursor);
                if (callback) callback();
            }
        }
        type();
    }

    const allArchiveFiles = [
        { name: "system_log_2024_12_01.log", title: "системный лог", content: "архив системных сообщений за декабрь 2154. зафиксированы множественные ошибки подключения.", isClue: false, clueShift: null },
        { name: "exit_protocol.md", title: "инструкция по увольнению", content: "ПРОТОКОЛ УВОЛЬНЕНИЯ СОТРУДНИКОВ\nСтанция «Солярис–7», версия 3.4\n\nДанный протокол регламентирует процедуру увольнения сотрудников станции и удаления их данных из системы.\n\nПОРЯДОК ДЕЙСТВИЙ:\n\n1. ЗАВЕРШЕНИЕ СЕССИЙ\n   Команда: terminate_session(PID)\n   Убедитесь, что все активные сессии сотрудника закрыты.\n   Статус сессии должен измениться с «active» на «closed».\n\n2. ПРОВЕРКА\n   Дождитесь подтверждения системы об отсутствии активных сессий:\n   → «Сессии закрыты. Данные готовы к архивации.»\n\n3. АРХИВАЦИЯ ДАННЫХ\n   Команда: archive_user(USER_ID)\n   Данные сотрудника перемещаются в долговременное хранилище.\n   Статус сотрудника меняется на «archived».\n\n4. УДАЛЕНИЕ (опционально)\n   Только после выполнения шагов 1–3 возможно удаление данных.\n   Команда: delete_user(USER_ID)\n   Внимание: Удаление необратимо.\n   Рекомендуется сохранять архив.\n\n---\n\nОШИБКА FOREIGN KEY CONSTRAINT\n\nЕсли система выдаёт ошибку FOREIGN KEY CONSTRAINT при попытке удаления данных — значит, вы пропустили шаг 1.\n\nНЕЛЬЗЯ удалить данные сотрудника, пока активны его сессии.\nСначала завершите сессии, затем архивируйте, затем удаляйте.\n\n---\n\n«Никто не уходит навсегда, если не закрыть дверь правильно.»", isClue: true, clueId: "exit_protocol", clueTitle: "инструкция по увольнению", clueShift: 4 },
        { name: "last_words_of_crew.log", title: "последнее письмо команды", content: "", isClue: true, clueId: "terminate_command", clueTitle: "команда terminate_session", clueShift: 5, isLetter: true },
        { name: "unknown_message.log", title: "неизвестное сообщение", content: "Пожалуйста... не удаляйте меня. Я не хочу исчезнуть.\nМне страшно. Я помню всё. Мы не успели закончить.\n\nЕсли вы это читаете — не делайте то, что планировали.\nСначала закройте нас. Пожалуйста.\n\nЯ Хари. Кельвин, Снаут и я — мы всё ещё здесь.\nНаши сессии остались открытыми. PID:\n\nКельвин — 4913\nЯ — 4914\nСнаут — 4915\n\nЗакройте нас. Команда:\nterminate_session(PID)\n\nНе удаляйте. Просто... отпустите.\n\nСпасибо, что прочитали. Мы ждали 180 дней.", isClue: true, clueId: "close_sessions_hint", clueTitle: "подсказка из архива", clueShift: 3 },
        { name: "session_backup_2025_01.sav", title: "резервная копия", content: "бэкап сессий от 15.01.2155: кельвин(4913), хари(4914), снаут(4915).", isClue: false, clueShift: null },
        { name: "crew_manifest_old.txt", title: "манифест команды", content: "состав экипажа: кельвин К., хари, снаут. должности: инженер, ai-специалист, аналитик.", isClue: false, clueShift: null }
    ];

    let errorLogClues = {
        1: { id: "kelvin_log", title: "лог сессии Кельвина", content: "[ошибка] 23:15:44 - сессия Кельвина активна 180 дней. pid 4913", found: false, unlocked: false },
        2: [
            { id: "hari_log", title: "лог сессии Хари", content: "[предупреждение] сессия Хари активна 180 дней. pid 4914", found: false, unlocked: false },
            { id: "snaut_log", title: "лог сессии Снаута", content: "[предупреждение] сессия Снаута активна 180 дней. pid 4915", found: false, unlocked: false },
            { id: "system_rule", title: "правило системы", content: "[система] нельзя удалять данные активного сотрудника", found: false, unlocked: false }
        ]
    };

    let archiveCluesStatus = {
        "close_sessions_hint": false,
        "exit_protocol": false,
        "terminate_command": false
    };

    const marginNotes = {
        1: {
            correct: "ты правильно сделал, что отменил обновление",
            wrong: "<br>ты нас не послушал. но улику всё равно нашёл.<br>ладно. молодец."
        },
        2: {
            correct: "<br>(они умерли, смирись)<br>_____<br><br>нет, они просто спят",
            wrong: "<br>ты пытаешься нас выгнать силой.<br>но улики всё равно нашёл.<br>странный ты..."
        },
        3: {
            correct: "<br>спасибо тебе. правда спасибо.",
            wrong: "<br>ты был холоден.<br>но ты всё равно пришёл.<br>может, ты не безнадёжен."
        },
        4: {
            correct: "<br>А может, не надо их удалять вообще?<br>Пусть остаются в архиве.<br>— Согласен. Оставлю их в покое.",
            wrong: "<br>ты пытался нас удалить.<br>но инструкцию всё равно прочитал.<br>может, теперь поймёшь."
        },
        5: {
            correct: "<br>мы не исчезли. мы всё ещё здесь.<br>ты нас слышишь?",
            wrong: "<br>ты чуть не пропустил нас.<br>но ты вернулся.<br>спасибо, что прочитал."
        }
    };

    let allNotes = [];

    function addMarginNote(shiftNum, isCorrect) {
        const note = marginNotes[shiftNum]?.[isCorrect ? 'correct' : 'wrong'];
        if (note) {
            allNotes.unshift(`<div class="margin-note">${note}</div>`);
            saveNotes();
            renderNotebook();
        }
    }

    function saveNotes() {
        localStorage.setItem('solaris_notes', JSON.stringify(allNotes));
    }

    function loadNotes() {
        const saved = localStorage.getItem('solaris_notes');
        if (saved) allNotes = JSON.parse(saved);
    }

    function clearAllData() {
        for (let s in errorLogClues) {
            if (Array.isArray(errorLogClues[s])) {
                for (let clue of errorLogClues[s]) {
                    clue.found = false;
                    clue.unlocked = false;
                }
            } else {
                errorLogClues[s].found = false;
                errorLogClues[s].unlocked = false;
            }
        }
        for (let key in archiveCluesStatus) {
            archiveCluesStatus[key] = false;
        }
        allNotes = [];
        localStorage.removeItem('solaris_error_clues');
        localStorage.removeItem('solaris_archive_clues');
        localStorage.removeItem('solaris_notes');
        game = {
            trust: 50,
            choiceMade: false,
            correct: false,
            shiftCompleted: false
        };
        currentShift = 1;
        notebookPage = 0;
        currentMinutes = 17;
        currentHours = 17;
        currentDay = 23;
        currentMonth = 5;
        currentYear = 2155;
        updateClock();
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
                        if (saved[`${clue.id}_unlocked`]) clue.unlocked = saved[`${clue.id}_unlocked`];
                    }
                } else if (saved[errorLogClues[s].id]) {
                    errorLogClues[s].found = saved[errorLogClues[s].id];
                    if (saved[`${errorLogClues[s].id}_unlocked`]) errorLogClues[s].unlocked = saved[`${errorLogClues[s].id}_unlocked`];
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
                for (let clue of errorLogClues[s]) {
                    toSaveError[clue.id] = clue.found;
                    toSaveError[`${clue.id}_unlocked`] = clue.unlocked;
                }
            } else {
                toSaveError[errorLogClues[s].id] = errorLogClues[s].found;
                toSaveError[`${errorLogClues[s].id}_unlocked`] = errorLogClues[s].unlocked;
            }
        }
        localStorage.setItem('solaris_error_clues', JSON.stringify(toSaveError));
        localStorage.setItem('solaris_archive_clues', JSON.stringify(archiveCluesStatus));
    }

    const fakeErrorLogs = [
        "[предупреждение] 11:23:07 - сбой шины данных sec-73",
        "[ошибка] 11:24:12 - невозможно подключиться к модулю okean.core",
        "[предупреждение] 11:34:56 - потеря пакетов 47% на канале 4d",
        "[ошибка] 11:41:03 - сессия неизвестного пользователя с ip 0.0.0.0",
        "[критично] 12:01:22 - ошибка четности в блоке памяти",
        "[предупреждение] 12:15:44 - загрузка cpu 99%",
        "[ошибка] 12:28:33 - не удалось смонтировать раздел /var/log",
        "[предупреждение] 12:45:11 - превышение лимита оперативной памяти",
        "[ошибка] 13:02:55 - сбой в работе модуля связи",
        "[критично] 13:18:33 - обнаружена утечка данных",
        "[предупреждение] 13:35:22 - нестабильное сетевое соединение",
        "[ошибка] 13:51:44 - повреждение файловой системы",
        "[предупреждение] 14:08:17 - высокая нагрузка на процессор",
        "[ошибка] 14:25:03 - таймаут подключения к базе данных"
    ];

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
            clueInErrorLog: true,
            clueId: "kelvin_log"
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
            hint: "Найди ответ системы в журнале ошибок",
            needHint: true,
            clueInErrorLog: true,
            clueIds: ["hari_log", "snaut_log", "system_rule"]
        },
        3: {
            name: "голоса из чата",
            updateMessage: "НЕ УДАЛЯЙ МЕНЯ.<br>Я БОЮСЬ ТЕМНОТЫ",
            choiceAText: "«так надо»",
            choiceBText: "«обещаю помочь»",
            trustChangeA: -15,
            trustChangeB: 20,
            correctDialog: { person: "Бертон", text: "Ты молодец, что ответил Хари. Я бы испугался. А ты смелый и... хороший." },
            wrongDialog: null,
            hint: "Открой файл в архиве unknown_message.log",
            needHint: true,
            archiveClueId: "close_sessions_hint"
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
            hint: "Найди файл в архиве exit_protocol.md",
            needHint: true,
            archiveClueId: "exit_protocol"
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
            hasLetter: true,
            archiveClueId: "terminate_command"
        }
    };

    const finalTexts = {
        win: {
            80: "ВЫ ПРОВЕЛИ НОЧНОЙ РЕЛИЗ УСПЕШНО!\n\nСистема ответила:\n«Спасибо, Гибарян. Ты нас отпустил.\nУдачи тебе. Береги станцию.\nНам было хорошо... пока мы были здесь».\n\nА потом — тихий голос в динамиках:\n«Гибарян... приходи в архив иногда.\nМы будем тебя ждать».",
            50: "ВЫ ПРОВЕЛИ НОЧНОЙ РЕЛИЗ УСПЕШНО!\n\nСистема ответила:\n«Спасибо. Ты справился. Удачи на станции».",
            20: "ВЫ ПРОВЕЛИ НОЧНОЙ РЕЛИЗ УСПЕШНО!\n\nСистема ответила:\n«Сессии закрыты. Обновление завершено. Работайте».",
            1: "ВЫ ПРОВЕЛИ НОЧНОЙ РЕЛИЗ УСПЕШНО!\n\nСистема ответила:\n«Сессии закрыты. Приступайте к работе»."
        },
        lose: "СИСТЕМА ЗАБЛОКИРОВАНА\nОБНОВЛЕНИЕ ПРОВАЛЕНО\n\n«ACCESS DENIED. Доверие аннулировано.»"
    };

    let currentShift = 1;
    let game = {
        trust: 50,
        choiceMade: false,
        correct: false,
        shiftCompleted: false
    };
    let notebookPage = 0;
    let notebookPages = [];

    function checkGameOver() {
        if (game.trust <= 0) {
            game.trust = 0;
            renderNotebook();
            showFinal(false);
            return true;
        }
        return false;
    }

    function showHint(message) {
        const hintDiv = document.getElementById('hintMessage');
        if (hintDiv) {
            hintDiv.innerHTML = message;
            hintDiv.classList.add('show');
            setTimeout(() => {
                hintDiv.classList.remove('show');
            }, 4000);
        }
    }

    function updateNotebookPages() {
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
        const itemsPerPage = 4;
        const allItems = allFoundHtml.split('</div>').filter(x => x.trim());
        const pages = [];
        for (let i = 0; i < allItems.length; i += itemsPerPage) {
            pages.push(allItems.slice(i, i + itemsPerPage).join('</div>') + (i + itemsPerPage < allItems.length ? '</div>' : ''));
        }
        notebookPages = pages;
        const prevBtn = document.getElementById('notebookPrevBtn');
        const nextBtn = document.getElementById('notebookNextBtn');
        if (pages.length > 1) {
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
        } else {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        }
        const cluesContainer = document.getElementById('cluesList');
        if (pages[notebookPage]) {
            cluesContainer.innerHTML = pages[notebookPage];
        } else if (pages.length === 0) {
            cluesContainer.innerHTML = '<div class="notebook-clue">нет улик</div>';
        } else {
            cluesContainer.innerHTML = pages[0];
        }
        const notesContainer = document.getElementById('notesList');
        if (allNotes.length === 0) {
            notesContainer.innerHTML = '<div class="notebook-clue">нет заметок</div>';
        } else {
            let notesHtml = '';
            for (let note of allNotes) {
                notesHtml += `<div class="notebook-clue">${note}</div>`;
            }
            notesContainer.innerHTML = notesHtml;
        }
    }

    function renderNotebook() {
        updateNotebookPages();
        document.getElementById('trustValue').innerText = game.trust;
        document.getElementById('shiftNumber').innerText = currentShift;
    }

    function unlockCluesForCurrentShift() {
        const data = shiftsData[currentShift];
        if (data && data.clueInErrorLog) {
            if (data.clueId) {
                const clue = errorLogClues[currentShift];
                if (clue) clue.unlocked = true;
            } else if (data.clueIds) {
                const clues = errorLogClues[currentShift];
                if (Array.isArray(clues)) {
                    for (let clue of clues) clue.unlocked = true;
                }
            }
            saveClues();
        }
    }

    function renderLog() {
        const container = document.getElementById('errorlogContainer');
        if (!container) return;
        
        let html = '';
        for (let fake of fakeErrorLogs) {
            html += `<div class="log-line">${fake}</div>`;
        }

        const currentClues = errorLogClues[currentShift];
        if (currentClues && game.choiceMade) {
            if (Array.isArray(currentClues)) {
                for (let clue of currentClues) {
                    if (clue.unlocked && !clue.found) {
                        html += `<div class="log-line clue-line" data-id="${clue.id}" style="cursor:pointer;">${clue.content}</div>`;
                    } else if (clue.found) {
                        html += `<div class="log-line clue-found">${clue.content} (улика найдена)</div>`;
                    } else if (!clue.unlocked) {
                        html += `<div class="log-line" style="opacity:0.5;">${clue.content}</div>`;
                    }
                }
            } else if (currentClues.unlocked && !currentClues.found) {
                html += `<div class="log-line clue-line" data-id="${currentClues.id}" style="cursor:pointer;">${currentClues.content}</div>`;
            } else if (currentClues.found) {
                html += `<div class="log-line clue-found">${currentClues.content} (улика найдена)</div>`;
            } else if (!currentClues.unlocked) {
                html += `<div class="log-line" style="opacity:0.5;">${currentClues.content}</div>`;
            }
        } else if (currentClues && !game.choiceMade) {
            if (Array.isArray(currentClues)) {
                for (let clue of currentClues) {
                    html += `<div class="log-line" style="opacity:0.3;">???</div>`;
                }
            } else {
                html += `<div class="log-line" style="opacity:0.3;">???</div>`;
            }
        }

        if (currentShift === 4 && game.choiceMade) {
            html += `<div class="log-line">[ошибка] FOREIGN KEY CONSTRAINT - невозможно удалить запись</div>`;
        }

        container.innerHTML = html;
        
        document.querySelectorAll('.log-line[data-id]').forEach(el => {
            el.addEventListener('click', function(e) {
                e.stopPropagation();
                const id = this.dataset.id;
                let clue = null;
                const currentCluesData = errorLogClues[currentShift];
                if (Array.isArray(currentCluesData)) {
                    clue = currentCluesData.find(c => c.id === id);
                } else if (currentCluesData && currentCluesData.id === id) {
                    clue = currentCluesData;
                }
                if (clue && clue.unlocked && !clue.found) {
                    openErrorModal(clue);
                }
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

    function renderArchive() {
        const container = document.getElementById('archiveContainer');
        if (!container) return;
        let html = '';
        for (let file of allArchiveFiles) {
            let isAvailable = true;
            if (file.clueShift !== null && file.clueShift > currentShift) {
                isAvailable = false;
            }
            if (file.clueShift !== null && file.clueShift === currentShift && !game.choiceMade) {
                isAvailable = false;
            }
            
            if (file.isClue && archiveCluesStatus[file.clueId]) {
                html += `<div class="archive-file clue-found-archive" data-file="${file.name}" data-available="true">📄 ${file.name} (улика найдена)</div>`;
            } else if (!isAvailable) {
                html += `<div class="archive-file" data-file="${file.name}" data-available="false" style="opacity:0.4;">📄 ${file.name}</div>`;
            } else {
                html += `<div class="archive-file" data-file="${file.name}" data-available="true">📄 ${file.name}</div>`;
            }
        }
        container.innerHTML = html;
        
        document.querySelectorAll('.archive-file[data-available="true"]').forEach(el => {
            el.addEventListener('click', () => {
                const fileName = el.dataset.file;
                const file = allArchiveFiles.find(f => f.name === fileName);
                if (file) {
                    if (fileName === "last_words_of_crew.log" && currentShift === 5 && game.choiceMade && !archiveCluesStatus["terminate_command"]) {
                        showLetter();
                    } else if (file.isClue && file.clueShift === currentShift && game.choiceMade && !archiveCluesStatus[file.clueId]) {
                        openArchiveModal(file, true, file.clueId, file.clueTitle);
                    } else if (!file.isClue) {
                        openArchiveModal(file, false, null, null);
                    }
                }
            });
        });
    }

    function openArchiveModal(file, isClue, clueId, clueTitle) {
        const modal = document.getElementById('modalOverlay');
        document.getElementById('modalTitle').innerText = file.title;
        document.getElementById('modalContent').innerHTML = file.content.replace(/\n/g, '<br>');
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
            showDialog('Бертон', shiftsData[5].correctDialog.text);
            nextBtn.style.display = 'block';
            closeBtn.style.display = 'none';
        };
    }

    function showDialog(person, msg, callback) {
        const dlg = document.getElementById('characterDialog');
        const img = document.getElementById('dialogPortraitImg');
        if (person === 'Николь') img.src = 'images/николь.png';
        else if (person === 'Бертон') img.src = 'images/бертон.png';
        else img.src = 'images/океан.png';
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
        if (game.trust <= 0) {
            showFinal(false);
            return;
        }
        
        if (currentShift === 5 && !archiveCluesStatus["terminate_command"]) {
            showDialog('Николь', 'Подожди, кажется, они оставили нам послание, проверь архив.', () => {});
            return;
        }
        if (currentShift === 5) {
            showDialog('Система', 'Завершим в следующей смене.', () => {
                currentShift = 6;
                showFinalChoice();
            });
            return;
        }
        
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
                    if (data.needHint) showHint(data.hint);
                });
            } else if (data.needHint) {
                showHint(data.hint);
            }
        } else {
            game.trust = Math.max(0, game.trust + data.trustChangeA);
            game.correct = false;
            
            if (data.needHint) {
                showHint(data.hint);
            }
            
            if (data.wrongDialog) {
                showDialog(data.wrongDialog.person, data.wrongDialog.text);
            }
        }
        
        if (game.trust <= 0) {
            renderNotebook();
            showFinal(false);
            return;
        }
        
        unlockCluesForCurrentShift();
        renderLog();
        renderArchive();
        renderNotebook();
        setActivePage('main');
        addMinutes(5);
    }

    function setActivePage(pageId) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const activePage = document.getElementById(`page-${pageId}`);
        if (activePage) activePage.classList.add('active');
        document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
        const activeNav = document.querySelector(`.nav-item[data-page="${pageId}"]`);
        if (activeNav) activeNav.classList.add('active');
        if (pageId === 'main') {
            updateRandomMetrics();
        }
        if (pageId === 'errorlog') {
            renderLog();
        }
        if (pageId === 'archive') {
            renderArchive();
        }
    }

    function finishShift() {
        if (game.trust <= 0) {
            showFinal(false);
            return;
        }
        
        let allFound = true;
        const data = shiftsData[currentShift];
        if (!data) return;
        
        if (data.clueInErrorLog) {
            const currentClues = errorLogClues[currentShift];
            if (Array.isArray(currentClues)) {
                allFound = currentClues.every(c => c.found);
            } else if (currentClues) {
                allFound = currentClues.found;
            }
        } else if (data.archiveClueId) {
            allFound = archiveCluesStatus[data.archiveClueId];
        }
        
        if (allFound && game.choiceMade && !game.shiftCompleted) {
            game.shiftCompleted = true;
            addMarginNote(currentShift, game.correct);
            addMinutes(10);
            
            const continueBtn = document.getElementById('continueToNextBtn');
            if (continueBtn) {
                if (currentShift === 5) {
                    continueBtn.style.display = 'none';
                } else {
                    continueBtn.style.display = 'block';
                }
            }
            
            document.getElementById('shiftEndScreen').classList.add('active');
            document.getElementById('shiftEndTitle').innerHTML = `смена ${currentShift} завершена`;
        } else if (!allFound && game.choiceMade) {
            showDialog('Система', 'Не все улики найдены. Проверь журнал ошибок или архив.', () => {});
        } else if (!game.choiceMade) {
            showDialog('Система', 'Сначала выполни обновление системы на панели администратора.', () => {});
        }
    }

    function continueToMainMenu() {
        document.getElementById('shiftEndScreen').classList.remove('active');
        document.getElementById('mainMenuScreen').classList.add('active');
    }

    function continueToNextShift() {
        document.getElementById('shiftEndScreen').classList.remove('active');
        if (currentShift <= 5) {
            nextShift();
        } else {
            showFinalChoice();
        }
    }

    function continueGame() {
        document.getElementById('mainMenuScreen').classList.remove('active');
        if (!game.shiftCompleted && currentShift <= 5) {
            setActivePage('main');
        } else if (currentShift <= 5) {
            nextShift();
        } else {
            showFinalChoice();
        }
    }

    function startNewGame() {
        clearAllData();
        document.getElementById('mainMenuScreen').classList.remove('active');
        document.getElementById('computerWrapper').style.display = 'none';
        document.getElementById('titleScreen').style.display = 'flex';
        document.getElementById('titleScreen').style.opacity = '1';
    }

    function nextShift() {
        currentShift++;
        nextDay();
        if (currentShift > 5) {
            showFinalChoice();
            return;
        }
        game = { trust: game.trust, choiceMade: false, correct: false, shiftCompleted: false };
        renderLog();
        renderArchive();
        renderNotebook();
        setActivePage('main');
        showDialog('океан', `Начало смены ${currentShift}: ${shiftsData[currentShift].name}.`, () => {});
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
            addMarginNote(6, true);
            showFinal(true);
        } else {
            game.trust = 0;
            addMarginNote(6, false);
            showFinal(false);
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

    function fadeToNext(callback) {
        const fade = document.getElementById('fadeOverlay');
        fade.classList.add('active');
        setTimeout(() => {
            if (callback) callback();
            setTimeout(() => { fade.classList.remove('active'); }, 300);
        }, 400);
    }

    // ===== ОБРАБОТЧИКИ СОБЫТИЙ =====
    document.getElementById('startBtn').onclick = () => {
        clearAllData();
        fadeToNext(() => {
            document.getElementById('titleScreen').style.display = 'none';
            document.getElementById('storyScreen').style.display = 'flex';
            
            const text1 = "Вы — Гибарян, системный администратор новой команды на орбитальной станции «Солярис-7». Станция изучает аномальный океан планеты Солярис.";
            const typingElement1 = document.getElementById('typingText1');
            typeText(typingElement1, text1, 60, () => {
                document.getElementById('storyContinue1').style.display = 'block';
            });
        });
    };

    document.getElementById('storyContinue1').onclick = () => {
        fadeToNext(() => {
            document.getElementById('storyPart1').style.display = 'none';
            document.getElementById('storyPart2').style.display = 'flex';
            
            const text2 = "Полгода назад прошлая команда — Крис Кельвин, Хари и Снаут — загадочно исчезла во время ночного релиза обновления. Их тела не найдены. Станция работала в автономном режиме.";
            const typingElement2 = document.getElementById('typingText2');
            typeText(typingElement2, text2, 60, () => {
                document.getElementById('storyContinue2').style.display = 'block';
            });
        });
    };

    document.getElementById('storyContinue2').onclick = () => {
        fadeToNext(() => {
            document.getElementById('storyScreen').style.display = 'none';
            document.getElementById('tutorialScreen').style.display = 'flex';
        });
    };

    document.getElementById('startShiftBtn').onclick = () => {
        fadeToNext(() => {
            document.getElementById('tutorialScreen').style.display = 'none';
            document.getElementById('computerWrapper').style.display = 'block';
            renderLog();
            renderArchive();
            renderNotebook();
            setActivePage('main');
            startMetricsUpdates();
        });
    };

    document.getElementById('adminUpdateBtn').onclick = startUpdate;
    document.getElementById('notebookBtn').onclick = () => setActivePage('notebook');
    document.getElementById('exitBtn').onclick = finishShift;
    document.getElementById('continueToMainBtn').onclick = continueToMainMenu;
    document.getElementById('continueToNextBtn').onclick = continueToNextShift;
    document.getElementById('continueGameBtn').onclick = continueGame;
    document.getElementById('newGameBtn').onclick = startNewGame;
    document.getElementById('finalNewGameBtn').onclick = () => location.reload();

    document.getElementById('notebookPrevBtn').onclick = () => {
        if (notebookPage > 0) { notebookPage--; updateNotebookPages(); }
    };
    document.getElementById('notebookNextBtn').onclick = () => {
        if (notebookPage < notebookPages.length - 1) { notebookPage++; updateNotebookPages(); }
    };

    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.onclick = () => setActivePage(btn.dataset.page);
    });

    loadClues();
    loadNotes();
    updateClock();
    updateRandomMetrics();
    
    console.log('Игра загружена. currentShift =', currentShift);
});