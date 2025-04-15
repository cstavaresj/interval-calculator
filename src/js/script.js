document.getElementById('add-time-interval').addEventListener('click', function() {
    const timeIntervals = document.getElementById('time-intervals');
    const newInterval = document.createElement('div');
    newInterval.className = 'interval';
    newInterval.innerHTML = `
        <input type="time" class="start-time" onchange="calculateTimeInterval(this.parentElement)">
        <span>até</span>
        <input type="time" class="end-time" onchange="calculateTimeInterval(this.parentElement)">
        <div class="result">00:00</div>
        <button class="remove-btn" onclick="removeInterval(this.parentElement)">X</button>
    `;
    timeIntervals.appendChild(newInterval);
});

document.getElementById('add-date-interval').addEventListener('click', function() {
    const dateIntervals = document.getElementById('date-intervals');
    const newInterval = document.createElement('div');
    newInterval.className = 'interval';
    newInterval.innerHTML = `
        <input type="date" class="start-date" onchange="calculateDateInterval(this.parentElement)">
        <span>até</span>
        <input type="date" class="end-date" onchange="calculateDateInterval(this.parentElement)">
        <div class="result">0 dias</div>
        <button class="remove-btn" onclick="removeInterval(this.parentElement)">X</button>
    `;
    dateIntervals.appendChild(newInterval);
});

document.getElementById('add-datetime-interval').addEventListener('click', function() {
    const datetimeIntervals = document.getElementById('datetime-intervals');
    const newInterval = document.createElement('div');
    newInterval.className = 'interval';
    newInterval.innerHTML = `
        <div class="datetime-group">
            <div class="label">Início:</div>
            <div class="datetime-row">
                <input type="date" class="start-date" onchange="calculateDateTimeInterval(this.parentElement.parentElement.parentElement)">
                <input type="time" class="start-time" onchange="calculateDateTimeInterval(this.parentElement.parentElement.parentElement)">
            </div>
        </div>
        <span>até</span>
        <div class="datetime-group">
            <div class="label">Final:</div>
            <div class="datetime-row">
                <input type="date" class="end-date" onchange="calculateDateTimeInterval(this.parentElement.parentElement.parentElement)">
                <input type="time" class="end-time" onchange="calculateDateTimeInterval(this.parentElement.parentElement.parentElement)">
            </div>
        </div>
        <div class="result">0 dias e 00:00 horas</div>
        <button class="remove-btn" onclick="removeInterval(this.parentElement)">X</button>
    `;
    datetimeIntervals.appendChild(newInterval);
});

function calculateTimeInterval(intervalElement) {
    const startTime = intervalElement.querySelector('.start-time').value;
    const endTime = intervalElement.querySelector('.end-time').value;
    const resultElement = intervalElement.querySelector('.result');
    
    if (!startTime || !endTime) {
        resultElement.textContent = '00:00';
        calculateTotalTime();
        return;
    }
    
    // Converter para minutos desde meia-noite
    let startMinutes = timeToMinutes(startTime);
    let endMinutes = timeToMinutes(endTime);
    
    // Se o horário final for antes do inicial, assume-se que cruza a meia-noite
    if (endMinutes < startMinutes) {
        endMinutes += 24 * 60; // Adicionar 24 horas em minutos
    }
    
    const diffMinutes = endMinutes - startMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    resultElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    calculateTotalTime();
}

function calculateDateInterval(intervalElement) {
    const startDate = intervalElement.querySelector('.start-date').value;
    const endDate = intervalElement.querySelector('.end-date').value;
    const resultElement = intervalElement.querySelector('.result');
    
    if (!startDate || !endDate) {
        resultElement.textContent = '0 dias';
        calculateTotalDays();
        return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Calcular a diferença em dias
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    resultElement.textContent = `${diffDays} dias`;
    calculateTotalDays();
}

function calculateDateTimeInterval(intervalElement) {
    const startDate = intervalElement.querySelector('.start-date').value;
    const startTime = intervalElement.querySelector('.start-time').value;
    const endDate = intervalElement.querySelector('.end-date').value;
    const endTime = intervalElement.querySelector('.end-time').value;
    const resultElement = intervalElement.querySelector('.result');
    
    if (!startDate || !startTime || !endDate || !endTime) {
        resultElement.textContent = '0 dias e 00:00 horas';
        calculateTotalDateTime();
        return;
    }
    
    // Cria objetos Date com as datas e horários
    const start = new Date(`${startDate}T${startTime}:00`);
    const end = new Date(`${endDate}T${endTime}:00`);
    
    // Calcular a diferença em milissegundos
    const diffMs = end - start;
    
    // Converter para dias, horas e minutos
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const remainingMs = diffMs % (1000 * 60 * 60 * 24);
    const diffHours = Math.floor(remainingMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    
    resultElement.textContent = `${diffDays} dias e ${String(diffHours).padStart(2, '0')}:${String(diffMinutes).padStart(2, '0')} horas`;
    calculateTotalDateTime();
}

function timeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

function minutesToTimeString(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function calculateTotalTime() {
    const intervals = document.querySelectorAll('#time-intervals .interval');
    let totalMinutes = 0;
    
    intervals.forEach(interval => {
        const resultText = interval.querySelector('.result').textContent;
        if (resultText !== '00:00') {
            const [hours, minutes] = resultText.split(':').map(Number);
            totalMinutes += hours * 60 + minutes;
        }
    });
    
    document.getElementById('total-time').textContent = minutesToTimeString(totalMinutes);
}

function calculateTotalDays() {
    const intervals = document.querySelectorAll('#date-intervals .interval');
    let totalDays = 0;
    
    intervals.forEach(interval => {
        const resultText = interval.querySelector('.result').textContent;
        if (resultText !== '0 dias') {
            const days = parseInt(resultText);
            totalDays += days;
        }
    });
    
    document.getElementById('total-days').textContent = totalDays;
}

function calculateTotalDateTime() {
    const intervals = document.querySelectorAll('#datetime-intervals .interval');
    let totalDays = 0;
    let totalMinutes = 0;
    
    intervals.forEach(interval => {
        const resultText = interval.querySelector('.result').textContent;
        if (resultText !== '0 dias e 00:00 horas') {
            // Extrair dias e horas do texto do resultado
            const parts = resultText.split(' e ');
            const days = parseInt(parts[0]);
            const [hours, minutes] = parts[1].split(' horas')[0].split(':').map(Number);
            
            totalDays += days;
            totalMinutes += hours * 60 + minutes;
        }
    });
    
    // Converter minutos excedentes em dias
    if (totalMinutes >= 24 * 60) {
        const additionalDays = Math.floor(totalMinutes / (24 * 60));
        totalDays += additionalDays;
        totalMinutes %= (24 * 60);
    }
    
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    
    document.getElementById('total-datetime').textContent = 
        `${totalDays} dias e ${String(totalHours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')} horas`;
}

function removeInterval(intervalElement) {
    const parentId = intervalElement.parentNode.id;
    intervalElement.parentNode.removeChild(intervalElement);
    
    if (parentId === 'time-intervals') {
        calculateTotalTime();
    } else if (parentId === 'date-intervals') {
        calculateTotalDays();
    } else if (parentId === 'datetime-intervals') {
        calculateTotalDateTime();
    }
}

// Função para alternar entre tema claro e escuro
document.getElementById('theme-switch').addEventListener('click', function() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    
    // Alternar a classe de tema
    body.classList.toggle('dark-theme');
    
    // Atualizar o ícone baseado no tema atual
    if (body.classList.contains('dark-theme')) {
        themeIcon.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
});

// Verificar preferência de tema salva
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.getElementById('theme-icon');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.textContent = '☀️';
    }
});