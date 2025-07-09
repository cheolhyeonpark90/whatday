// app.js (최종 수정 - 올바른 프로퍼티 사용)

// 모든 리소스(CDN 스크립트 포함)가 로드된 후 코드를 실행합니다.
window.onload = function() {
    
    // date-fns의 기본 함수들을 가져옵니다.
    const { format, addDays, differenceInDays, parseISO } = dateFns;
    
    // 🔴 여기가 진짜 원인이자 해결책입니다.
    // date-fns v3는 복수형(locales)이 아닌 단수형(locale) 객체에 로케일을 저장합니다.
    const { ko } = dateFns.locale; 

    // --- DOM 요소 ---
    const html = document.documentElement;
    const darkModeToggle = document.getElementById('darkModeToggle');
    const modeBtn1 = document.getElementById('modeBtn1');
    const modeBtn2 = document.getElementById('modeBtn2');
    const mode1 = document.getElementById('mode1');
    const mode2 = document.getElementById('mode2');

    // 모드 1
    const startDateInput = document.getElementById('startDate');
    const daysInput = document.getElementById('days');
    const calculateBtn1 = document.getElementById('calculateBtn1');

    // 모드 2
    const diffStartDateInput = document.getElementById('diffStartDate');
    const diffEndDateInput = document.getElementById('diffEndDate');
    const calculateBtn2 = document.getElementById('calculateBtn2');

    // 결과
    const resultCard = document.getElementById('resultCard');
    const resultText = document.getElementById('resultText');
    const subResultText = document.getElementById('subResultText');
    const copyBtn = document.getElementById('copyBtn');

    // --- 초기화 ---
    const today = new Date();
    startDateInput.value = format(today, 'yyyy-MM-dd');
    diffStartDateInput.value = format(today, 'yyyy-MM-dd');
    diffEndDateInput.value = format(addDays(today, 7), 'yyyy-MM-dd');

    // --- 다크 모드 (변경 없음) ---
    const applyDarkMode = (isDark) => {
        html.classList.toggle('dark', isDark);
        localStorage.setItem('darkMode', isDark);
    };
    darkModeToggle.addEventListener('click', () => applyDarkMode(!html.classList.contains('dark')));
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedMode = localStorage.getItem('darkMode');
    applyDarkMode(savedMode === null ? prefersDark : savedMode === 'true');

    // --- 모드 전환 (변경 없음) ---
    const switchMode = (targetMode) => {
        resultCard.classList.add('hidden');
        mode1.classList.toggle('hidden', targetMode !== 1);
        mode2.classList.toggle('hidden', targetMode !== 2);
        modeBtn1.classList.toggle('active', targetMode === 1);
        modeBtn2.classList.toggle('active', targetMode === 2);
    };
    modeBtn1.addEventListener('click', () => switchMode(1));
    modeBtn2.addEventListener('click', () => switchMode(2));

    // --- 계산 함수 ---
    const calculateNdays = () => {
        if (!startDateInput.value) return;
        const startDate = parseISO(startDateInput.value);
        const days = parseInt(daysInput.value) || 0;

        const resultDate = addDays(startDate, days);
        resultText.textContent = format(resultDate, 'yyyy년 M월 d일');
        
        // 🔴 이제 'ko' 변수가 올바르게 정의되었으므로 에러가 발생하지 않습니다.
        subResultText.textContent = format(resultDate, 'EEEE', { locale: ko });
        
        resultCard.classList.remove('hidden');
    };

    const calculateDiff = () => {
        if (!diffStartDateInput.value || !diffEndDateInput.value) return;
        const startDate = parseISO(diffStartDateInput.value);
        const endDate = parseISO(diffEndDateInput.value);

        const diff = differenceInDays(endDate, startDate);
        const sign = diff < 0 ? '전' : '후';
        const absDiff = Math.abs(diff);

        resultText.textContent = `${absDiff}일 ${sign}`;
        
        const weeks = Math.floor(absDiff / 7);
        const remainingDays = absDiff % 7;
        subResultText.textContent = weeks > 0 ? `(${weeks}주 ${remainingDays}일)` : `(1주 미만)`;

        resultCard.classList.remove('hidden');
    };

    calculateBtn1.addEventListener('click', calculateNdays);
    calculateBtn2.addEventListener('click', calculateDiff);

    // --- 복사 기능 (변경 없음) ---
    copyBtn.addEventListener('click', () => {
        const textToCopy = `${resultText.textContent} ${subResultText.textContent}`.trim();
        navigator.clipboard.writeText(textToCopy).then(() => {
            copyBtn.textContent = '복사 완료!';
            setTimeout(() => { copyBtn.textContent = '복사'; }, 1500);
        });
    });
};