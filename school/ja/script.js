// 일정 정보를 브라우저 저장소에 저장할 때 사용할 이름
var scheduleStorageKey = 'pcsCalendarSchedules';
// 현재 화면에 그려진 달력의 id를 기억해서 일정 추가 후 다시 그릴 때 사용
var activeCalendarId = 'pcsCalendar';

// 해마다 날짜가 바뀌지 않는 공휴일 목록
var fixedHolidayMap = {
    '01-01': '신정',
    '03-01': '삼일절',
    '05-05': '어린이날',
    '06-06': '현충일',
    '08-15': '광복절',
    '10-03': '개천절',
    '10-09': '한글날',
    '12-25': '성탄절'
};

// 음력 공휴일이나 대체공휴일처럼 해마다 날짜가 달라지는 공휴일 목록
var holidayMapByYear = {
    '2026': {
        '02-16': '설날 연휴',
        '02-17': '설날',
        '02-18': '설날 연휴',
        '03-02': '삼일절 대체공휴일',
        '05-24': '부처님오신날',
        '05-25': '부처님오신날 대체공휴일',
        '08-17': '광복절 대체공휴일',
        '09-24': '추석 연휴',
        '09-25': '추석',
        '09-26': '추석 연휴',
        '10-05': '개천절 대체공휴일'
    }
};

// 한 자리 숫자를 01, 02처럼 두 자리 문자열로 바꾸는 함수
function padNumber(number) {
    return number < 10 ? '0' + number : '' + number;
}

// 연, 월, 일을 일정 저장에 쓰기 좋은 YYYY-MM-DD 형태로 만드는 함수
function makeDateKey(year, month, day) {
    return year + '-' + padNumber(month) + '-' + padNumber(day);
}

// 해당 날짜가 공휴일이면 공휴일 이름을 돌려주는 함수
function getHolidayName(year, month, day) {
    var monthDay = padNumber(month) + '-' + padNumber(day);
    var yearlyHolidayMap = holidayMapByYear[year] || {};

    if (year >= 2026 && monthDay === '05-01') {
        return '노동절';
    }

    if (year >= 2026 && monthDay === '07-17') {
        return '제헌절';
    }

    return yearlyHolidayMap[monthDay] || fixedHolidayMap[monthDay] || '';
}

// 브라우저에 저장된 일정들을 읽어 오는 함수
function getSchedules() {
    try {
        var savedSchedules = localStorage.getItem(scheduleStorageKey);
        return savedSchedules ? JSON.parse(savedSchedules) : {};
    } catch (error) {
        return {};
    }
}

// 일정 전체를 브라우저 저장소에 다시 저장하는 함수
function saveSchedules(schedules) {
    localStorage.setItem(scheduleStorageKey, JSON.stringify(schedules));
}

// 사용자가 입력한 글자가 HTML 태그로 해석되지 않도록 바꾸는 함수
function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// 일정 입력칸의 기본 날짜와 버튼 동작을 처음 한 번 연결하는 함수
function initScheduleForm() {
    var scheduleDate = document.getElementById('scheduleDate');
    var scheduleText = document.getElementById('scheduleText');
    var addScheduleButton = document.getElementById('addScheduleButton');
    var emojiButtons = document.querySelectorAll('#emojiPicker button');
    var today = new Date();
    var i;

    scheduleDate.value = makeDateKey(today.getFullYear(), today.getMonth() + 1, today.getDate());
    addScheduleButton.onclick = addSchedule;

    // 이모티콘 버튼을 누르면 각 버튼의 data-emoji 값을 입력칸에 넣음
    for (i = 0; i < emojiButtons.length; i++) {
        emojiButtons[i].onclick = function () {
            insertEmoji(this.getAttribute('data-emoji'));
        };
    }

    // 일정 입력칸에서 Enter를 눌러도 바로 추가되게 함
    scheduleText.onkeydown = function (event) {
        if (event.key === 'Enter') {
            addSchedule();
        }
    };
}

// 선택한 이모티콘을 현재 커서 위치에 넣는 함수
function insertEmoji(emoji) {
    var scheduleText = document.getElementById('scheduleText');
    var start = scheduleText.selectionStart;
    var end = scheduleText.selectionEnd;
    var beforeText = scheduleText.value.substring(0, start);
    var afterText = scheduleText.value.substring(end);

    scheduleText.value = beforeText + emoji + afterText;
    scheduleText.focus();
    scheduleText.setSelectionRange(start + emoji.length, start + emoji.length);
}

// 입력한 날짜와 내용을 새 일정으로 저장하는 함수
function addSchedule() {
    var scheduleDate = document.getElementById('scheduleDate');
    var scheduleText = document.getElementById('scheduleText');
    var dateKey = scheduleDate.value;
    var text = scheduleText.value.trim();
    var schedules = getSchedules();

    if (dateKey === '' || text === '') {
        return;
    }

    if (!schedules[dateKey]) {
        schedules[dateKey] = [];
    }

    schedules[dateKey].push(text);
    saveSchedules(schedules);
    scheduleText.value = '';
    pcsCalendar(activeCalendarId, dateKey);
}

// 선택한 일정 하나를 삭제하는 함수
function removeSchedule(dateKey, index) {
    var schedules = getSchedules();

    if (!schedules[dateKey]) {
        return;
    }

    schedules[dateKey].splice(index, 1);

    if (schedules[dateKey].length === 0) {
        delete schedules[dateKey];
    }

    saveSchedules(schedules);
    pcsCalendar(activeCalendarId, dateKey);
}

// 달력의 날짜 칸을 누르면 그 날짜를 일정 입력칸에 넣는 함수
function selectScheduleDate(dateKey) {
    var scheduleDate = document.getElementById('scheduleDate');
    var scheduleText = document.getElementById('scheduleText');

    scheduleDate.value = dateKey;
    scheduleText.focus();
}

// 현재 보고 있는 달의 일정들을 날짜순 배열로 정리하는 함수
function getMonthScheduleItems(year, month) {
    var schedules = getSchedules();
    var monthPrefix = year + '-' + padNumber(month) + '-';
    var monthScheduleItems = [];
    var dateKey;
    var i;

    for (dateKey in schedules) {
        if (schedules.hasOwnProperty(dateKey) && dateKey.indexOf(monthPrefix) === 0) {
            for (i = 0; i < schedules[dateKey].length; i++) {
                monthScheduleItems.push({
                    dateKey: dateKey,
                    monthDay: dateKey.substring(5),
                    text: schedules[dateKey][i],
                    index: i
                });
            }
        }
    }

    monthScheduleItems.sort(function (a, b) {
        return a.dateKey.localeCompare(b.dateKey);
    });

    return monthScheduleItems;
}

// 현재 보고 있는 달의 일정 목록을 왼쪽 패널과 아래쪽 목록에 함께 보여 주는 함수
function renderScheduleList(year, month) {
    var scheduleList = document.getElementById('scheduleList');
    var monthScheduleList = document.getElementById('monthScheduleList');
    var monthScheduleTitle = document.getElementById('monthScheduleTitle');
    var monthScheduleItems = getMonthScheduleItems(year, month);
    var editorListHtml = '';
    var summaryListHtml = '';
    var i;

    monthScheduleTitle.innerHTML = year + '년 ' + month + '월 일정';

    for (i = 0; i < monthScheduleItems.length; i++) {
        editorListHtml += '<li>';
        editorListHtml += '<span>' + monthScheduleItems[i].monthDay + '</span>';
        editorListHtml += '<strong>' + escapeHtml(monthScheduleItems[i].text) + '</strong>';
        editorListHtml += '<button type="button" onclick="removeSchedule(\'' + monthScheduleItems[i].dateKey + '\', ' + monthScheduleItems[i].index + ')">삭제</button>';
        editorListHtml += '</li>';

        summaryListHtml += '<li onclick="selectScheduleDate(\'' + monthScheduleItems[i].dateKey + '\')">';
        summaryListHtml += '<span>' + monthScheduleItems[i].monthDay + '</span>';
        summaryListHtml += '<strong>' + escapeHtml(monthScheduleItems[i].text) + '</strong>';
        summaryListHtml += '</li>';
    }

    if (monthScheduleItems.length === 0) {
        editorListHtml = '<li class="empty">등록된 일정이 없습니다.</li>';
        summaryListHtml = '<li class="empty">이번 달 일정이 없습니다.</li>';
    }

    scheduleList.innerHTML = editorListHtml;
    monthScheduleList.innerHTML = summaryListHtml;
}

// 달력 전체를 화면에 그리는 메인 함수
function pcsCalendar(id, date) {
    activeCalendarId = id;
    var pcsCalendar = document.getElementById(id); // 달력을 표시할 요소 선택
    // 날짜 처리부분 
    if (typeof date !== 'undefined') { // date가 전달된 경우
        var dateArray = date.split('-'); // 날짜를 '-'로 분리하여 배열로 만듦
        dateArray[1] = dateArray[1] - 1; // 월은 0부터 시작하므로 1을 빼줌
        date = new Date(dateArray[0], dateArray[1], dateArray[2]); // 전달받은 날짜로 초기화
    } else {
        date = new Date(); // 현재 날짜로 초기화
    }

    // 현재 달력을 그리는 데 필요한 연도, 월, 일을 구함
    var currentYear = date.getFullYear(); // 년도
    var currentMonth = date.getMonth() + 1; // 월 (0부터 시작하므로 +1)
    var currentDate = date.getDate(); // 일
    // 달력의 첫 번째 날짜 구하기
    date.setDate(1); // 달력의 첫 번째 날짜로 설정
    var currentDay = date.getDay(); // 요일 (0=일요일, 1=월요일, ..., 6=토요일)

    var lastDate = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 각 달의 마지막 날짜
    var dateString = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']; // 요일별 CSS 클래스 이름

    // 윤년 처리
    if ((currentYear % 4 === 0 && currentYear % 100 !== 0) || currentYear % 400 === 0) {
        lastDate[1] = 29; // 윤년인 경우 2월의 마지막 날짜는 29일
    }
    // 해당 달 정보 
    var currentMonthLastDate = lastDate[currentMonth - 1]; // 해당 달의 마지막 날짜
    var week = Math.ceil((currentDay + currentMonthLastDate) / 7); // 달력의 주 수 계산

    if (currentMonth != 1) 
        var prevDate = currentYear + '-' + (currentMonth - 1) + '-1'; // 이전 달 날짜
    else 
        var prevDate = (currentYear - 1) + '-' + 12 + '-1'; // 이전 달 날짜 (1월인 경우)
        
    
    if (currentMonth != 12) 
        var nextDate = currentYear + '-' + (currentMonth + 1) + '-1'; // 다음 달 날짜
    else 
        var nextDate = (currentYear + 1) + '-' + 1 + '-1'; // 다음 달 날짜 (12월인 경우)
   
    
    // 달력의 윗부분과 요일 제목을 문자열로 만듦
    var calendar = "";
    calendar += '<div id="header">';
    calendar += '<span><a href="#" class="button left" onclick="pcsCalendar(\'' + id + '\', \'' + prevDate + '\')">&lt;&lt;</a></span>';
    calendar += '<span>' + currentYear + '년 ' + currentMonth + '월</span>';
    calendar += '<span><a href="#" class="button right" onclick="pcsCalendar(\'' + id + '\', \'' + nextDate + '\')">&gt;&gt;</a></span>';
    calendar += '</div>';

    calendar += '<table border="0" cellspacing="0" cellpadding="0">';
    calendar += '<caption>' + currentYear + '년 ' + currentMonth + '월 달력</caption>';
    calendar += '<thead>';
    calendar += '<tr>';
    calendar += '<th scope="sun">일</th>';
    calendar += '<th scope="mon">월</th>';
    calendar += '<th scope="tue">화</th>';
    calendar += '<th scope="wed">수</th>';
    calendar += '<th scope="thu">목</th>';
    calendar += '<th scope="fri">금</th>';
    calendar += '<th scope="sat">토</th>';
    calendar += '</tr>';
    calendar += '</thead>';
    calendar += '<tbody>';

    var dateNum = 1 - currentDay; // 달력에 표시할 날짜 번호 (1일부터 시작)
    var schedules = getSchedules(); // 저장된 일정 전체를 한 번 읽어 둠
    for (var i = 0; i < week; i++) { // 주 수만큼 반복
        calendar += '<tr>';
        for (var j = 0; j < 7; j++) { // 7일씩 반복
            if (dateNum < 1 || dateNum > currentMonthLastDate) { // 달력에 표시할 날짜가 유효하지 않은 경우
                calendar += '<td class="' + dateString[j] + '"></td>'; // 빈 셀 추가
            } else {
                var dateKey = makeDateKey(currentYear, currentMonth, dateNum);
                var holidayName = getHolidayName(currentYear, currentMonth, dateNum); // 해당 날짜의 공휴일 이름
                var daySchedules = schedules[dateKey] || []; // 해당 날짜에 등록된 일정 목록
                var cellClass = dateString[j]; // 기본 요일 색상 클래스

                if (holidayName !== '') {
                    cellClass += ' holiday';
                }

                if (daySchedules.length > 0) {
                    cellClass += ' hasSchedule';
                }

                calendar += '<td class="' + cellClass + '" onclick="selectScheduleDate(\'' + dateKey + '\')">';
                calendar += '<span class="dateNumber">' + dateNum + '</span>';

                if (holidayName !== '') {
                    calendar += '<span class="holidayLabel">' + holidayName + '</span>';
                }

                if (daySchedules.length > 0) {
                    calendar += '<span class="scheduleLabel">' + escapeHtml(daySchedules[0]) + '</span>';

                    // 일정이 여러 개면 첫 일정만 보여 주고 나머지 개수를 표시
                    if (daySchedules.length > 1) {
                        calendar += '<span class="scheduleMore">+' + (daySchedules.length - 1) + '</span>';
                    }
                }

                calendar += '</td>'; // 날짜 셀 추가
            }
            dateNum++;
        }
        calendar += '</tr>';
    }
    calendar += '</tbody>';
    calendar += '</table>';
    pcsCalendar.innerHTML = calendar; // 달력을 표시할 요소에 생성한 달력 HTML을 삽입
    renderScheduleList(currentYear, currentMonth); // 달력 아래 일정 목록도 함께 새로 그림
}   
