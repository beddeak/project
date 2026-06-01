function pcsCalendar(id,date)//함수 호출시 입력된 id, date의 데이터를 받아올 변수
{
	var pcsCalendar = document.getElementById(id); //id의 데이터를 html요소의 아이디로 정의(= 뒤에 밑줄)
	
	if(typeof(date) !== 'undefined')// date값이 존재할 경우
	{
		date = date.split('-');//date의 값을 -를 기준으로 분리하여 배열로 정의(밑줄)
		date[1] = date[1] -1;//컴퓨터의 월과 맞추기 위해 -1 수행(컴퓨터 월은 0부터 시작)
		date = new Date(date[0],date[1],date[2]);
	}
	else
	{
		var date = new Date();//date 값이 존재하지 않는 경우 오늘 날짜로 기억
	}
	
	var currentYear = date.getFullYear();	//오늘일자 중 연(=뒤에 밑줄)
	var currentMonth = date.getMonth() + 1;//오늘일자 중 월은(=뒤에 밑줄)
	
	var currentDate = date.getDate(); //오늘일자 중 일
	date.setDate(1);				  //요일셋팅, 이번달 1일의 요일은 출력. 0은 일요일 6은 토요일(밑줄)
	var currentDay = date.getDay(); //(=뒤에 밑줄)
	
	//[3] 요일명 정의
	//클래스명으로 활용
	
	var dateString = new Array('sun','mon','tue','wed','thu','fri','sat');
	var lastDate = new Array(31,28,31,30,31,30,31,31,30,31,30,31);//월별 마지막 일자 정리
	
	//윤년 처리
	
	if((currentYear % 4 === 0 && currentYear % 100 !== 0) || currentYear % 400 === 0)//이부분 밑줄
		lastDate[1] = 29;
	//각 달의 마지막 일을 계산, 윤년의 경우 년도가 4의 배수이고 100의 배수가 아닐 때 혹은 400의 배수일 때 2월달이 29일임
	
	
	var currentLastDate = lastDate[currentMonth-1];//월은 0부터 시작하는 배열을 맞춤(=뒤에 밑줄)
	var week = Math.ceil((currentDay + currentLastDate) / 7) //이번달은 몇주인지 계산(= 뒤에 밑줄)
	
    //현재를 기준으로 이전/다음 구하기
	//currentYear/currentMonth/currentDate, prevDate, nextDate
	
    if (currentMonth !== 1)
		 var prevDate = currentYear + '-' + (currentMonth-1) + '-' + currentDate;//=뒤에 밑줄
	else 
        var prevDate = (currentYear - 1) + '-' + 12 + '-' + currentDate;//(=뒤에 밑줄)
        //이전달의 날짜 구하기, 만약 이번달이 1월이라면 1년전 12월로 출력

    if (currentMonth !== 12)
		 var nextDate = currentYear + '-' + (currentMonth +1 ) + '-' + currentDate;//=뒤에 밑줄
	else
        var nextDate = (currentYear + 1) + '-' + 1  + '-' + currentDate;//=뒤에 밑줄
        //다음달의 날짜 구하기, 만약 이번달이 12월이라면 1년 후 1월로 출력
    if (currentMonth < 10)
		 var currentMonth= '0' + currentMonth; //10월 이하라면 앞에 0을 붙여준다

    var calendar = '';

    calendar += '<div id="header">';
    calendar += '<span><a href="#" class="button left" onclick="pcsCalendar(\'' + id + '\',\'' + prevDate + '\')"><</a></span>'; //클릭시 pcsCalendar 함수에 이전달의 날짜 데이터 입력해서 호출[onclick ~ )"까지밑줄]
    calendar += '<span id="date">' + currentYear + '년 ' + currentMonth + '월</span>';//pcsCalendar 가 다시 실행된 상태이브로 계산 후의 현재 연/월 출력
    calendar += '<span><a href="#" class="button right" onclick="pcsCalendar(\'' + id + '\',\'' + nextDate + '\')">></a></span>';//클릭시 pcsCalendar 함수에 다음달의 날짜 데이터 입력해서 호출 [onClick ~ )까지 밑줄]
    calendar += '</div>';
    calendar += '<table border="0" cellspacing="0" cellpadding="0">'; 
    calendar += '<caption>' + currentYear + '년 ' + currentMonth + '월 달력</caption>';//= 뒤에 밑줄
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

    var dateNum = 1 - currentDay;// var 뒤에 밑줄

    for (var i = 0; i < week; i++) {//이번 달 주수 만큼 행<tr>을 만듦(i < week 밑줄)
        calendar += '<tr>';
        for (var j = 0; j < 7; j++, dateNum++) { //행마다 7개의 칸 <td>을 만듦
            if (dateNum < 1 || dateNum > currentLastDate) { //주간에 해당 월 기간내 밖의 일자 판별(1일 이전, 말일 이후)     (if 조건 밑줄)
                calendar += '<td class="' + dateString[j] + '"></td>'; //+= 뒤에 밑줄
                continue;
            }
            calendar += '<td class="' + dateString[j] + '">' + dateNum + '</td>'; //+= 뒤에 밑줄
        }
        calendar += '</tr>';
    }

    calendar += '</tbody>';
    calendar += '</table>';

    pcsCalendar.innerHTML = calendar; //pcsCalendar 아이디에 html 형식으로 calendar 값 출력(밑줄)
}