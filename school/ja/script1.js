function pcsCalendar(id, date) {
    // id로 전달된 HTML 요소를 찾습니다. 이 요소 안에 달력을 넣을 거예요.
    var pcsCalendar = document.getElementById(id);

    // date가 전달되었는지 확인합니다. 전달되었다면 그 날짜로 달력을 만듭니다.
    if (typeof(date) !== 'undefined') {
        // '2026-06-01'처럼 생긴 문자열을 ['2026','06','01']로 나눕니다.
        date = date.split('-');

        // 자바스크립트 Date 객체는 월을 0부터 셉니다. 그래서 1을 빼줍니다.
        date[1] = date[1] - 1;

        // 새 Date 객체를 만들어서 date 변수에 넣습니다.
        date = new Date(date[0], date[1], date[2]);
    } else {
        // date가 없으면 오늘 날짜로 달력을 만듭니다.
        var date = new Date();
    }

    // 현재 연도, 월, 일을 구합니다.
    var currentYear = date.getFullYear();
    var currentMonth = date.getMonth() + 1; // getMonth()는 0부터 시작하므로 +1
    var currentDate = date.getDate();

    // 달력에 표시할 달의 1일로 바꿉니다.
    date.setDate(1);
    var currentDay = date.getDay(); // 0=일요일, 1=월요일, ..., 6=토요일

    // 요일을 나타내는 클래스 이름 배열입니다.
    var dateString = new Array('sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat');

    // 각 달의 마지막 날짜를 저장한 배열입니다.
    var lastDate = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

    // 윤년인지 검사해서 2월 날짜를 29일로 바꿉니다.
    if ((currentYear % 4 === 0 && currentYear % 100 != 0) || currentYear % 400 == 0) {
        lastDate[1] = 29;
    }

    // 지금 보고 있는 달의 마지막 날짜를 가져옵니다.
    var currentLastDate = lastDate[currentMonth - 1];

    // 달력이 몇 주짜리인지 계산합니다.
    var week = Math.ceil((currentDay + currentLastDate) / 7);

    // 이전 달로 이동할 때 사용할 날짜 문자열을 만듭니다.
    if (currentMonth != 1)
        var prevDate = currentYear + '-' + (currentMonth - 1) + '-' + currentDate;
    else
        var prevDate = (currentYear - 1) + '-' + 12 + '-' + currentDate; //이전달의 날짜 구하기 만약 비언달이 1월이라면 1년전 12월 출력

    // 다음 달로 이동할 때 사용할 날짜 문자열을 만듭니다.
    if (currentMonth != 12)
        var nextDate = currentYear + '-' + (currentMonth + 1) + '-' + currentDate;
    else
        var nextDate = (currentYear + 1) + '-' + 1 + '-' + currentDate;

    // 월이 한 자리 숫자면 0을 붙입니다. 예: 6월 -> 06월
    if (currentMonth < 10)
        var currentMonth = '0' + currentMonth;

    // HTML 문자열을 하나씩 이어붙여서 달력을 만듭니다.
    var calendar = '';
    calendar += '<div id="header">';
    calendar += '<span><a href="#" class="button left" onclick="pcsCalendar(\'' + id + '\', \'' + prevDate + '\')"></a></span>';
    calendar += '<span>' + currentYear + '년 ' + currentMonth + '월</span>';
    calendar += '<span><a href="#" class="button right" onclick="pcsCalendar(\'' + id + '\', \'' + nextDate + '\')"></a></span>';
    calendar += '</div>';

    // 달력 테이블을 만듭니다.
    calendar += '<table border="0" cellspacing="0" cellpadding="0">';
    calendar += '<caption>' + currentYear + '년 ' + currentMonth + '월 달력</caption>';
    calendar += '<thead>';
    calendar += '<tr>';
    calendar += '<th class="sun" scope="row">일</th>';
    calendar += '<th class="mon" scope="row">월</th>';
    calendar += '<th class="tue" scope="row">화</th>';
    calendar += '<th class="wed" scope="row">수</th>';
    calendar += '<th class="thu" scope="row">목</th>';
    calendar += '<th class="fri" scope="row">금</th>';
    calendar += '<th class="sat" scope="row">토</th>';
    calendar += '</tr>';
    calendar += '</thead>';
    calendar += '<tbody>';

    // 달력의 숫자를 채우기 시작합니다.
    // dateNum은 첫 번째 줄에 들어갈 날짜 번호입니다.
    var dateNum = 1 - currentDay;
    for (var i = 0; i < week; i++) {
        calendar += '<tr>';
        for (var j = 0; j < 7; j++, dateNum++) {
            // 날짜가 1일보다 작거나 마지막 날짜보다 크면 빈 칸을 넣습니다.
            if (dateNum < 1 || dateNum > currentLastDate) {
                calendar += '<td class="' + dateString[j] + '"></td>';
                continue;
            }
            // 빈 칸이 아니면 실제 날짜 숫자를 넣습니다.
            calendar += '<td class="' + dateString[j] + '">' + dateNum + '</td>';
        }
        calendar += '</tr>';
    }

    calendar += '</tbody>';
    calendar += '</table>';

    // 만든 달력 HTML을 실제 화면에 넣습니다.
    pcsCalendar.innerHTML = calendar;
}