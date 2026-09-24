// ตั้งค่าแผนที่ Leaflet (พิกัดเริ่มต้น อุทยานแห่งชาติแม่วะ จ.ลำปาง)
const map = L.map('map').setView([17.3345, 98.9752], 10);

// แก้ไข URL ให้ถูกต้องและเติม .addTo(map)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// ตัวอย่างพิกัดเส้นทางการเดินทางของนก
const trackCoords = [
    [17.2862, 98.8931],
    [17.2984, 98.9156],
    [17.3116, 98.9417],
    [17.3281, 98.9623],
    [17.3345, 98.9752]
];

// วาดเส้นทางและหมุดบนแผนที่
const polyline = L.polyline(trackCoords, {color: '#198754', weight: 4, dashArray: '5, 10'}).addTo(map);

trackCoords.forEach((coord, index) => {
    let marker = L.circleMarker(coord, {
        radius: index === trackCoords.length - 1 ? 8 : 6,
        color: '#fff',
        fillColor: index === trackCoords.length - 1 ? '#ffc107' : '#198754',
        fillOpacity: 1,
        weight: 2
    }).addTo(map);
    
    if (index === trackCoords.length - 1) {
        marker.bindPopup("<b>KKOZ01</b><br>ตำแหน่งล่าสุด").openPopup();
    }
});

// ข้อมูลตัวอย่าง (Mock Data)
const mockData = [
    { id: 1, code: 'KKOZ01', date: '21 ต.ค. 2569', time: '14:35', lat: '17.3345', lng: '98.9752', area: 'อุทยานแห่งชาติแม่วะ จ.ลำปาง', battery: '81.25%', temp: '15.50' },
    { id: 2, code: 'KKOZ01', date: '21 ต.ค. 2569', time: '12:10', lat: '17.3281', lng: '98.9623', area: 'อุทยานแห่งชาติแม่วะ จ.ลำปาง', battery: '82.10%', temp: '16.20' },
    { id: 3, code: 'KKOZ01', date: '21 ต.ค. 2569', time: '09:45', lat: '17.3116', lng: '98.9417', area: 'อุทยานแห่งชาติแม่วะ จ.ลำปาง', battery: '83.40%', temp: '16.80' },
    { id: 4, code: 'KKOZ01', date: '21 ต.ค. 2569', time: '07:20', lat: '17.2984', lng: '98.9156', area: 'อุทยานแห่งชาติแม่วะ จ.ลำปาง', battery: '84.10%', temp: '17.10' },
    { id: 5, code: 'KKOZ01', date: '20 ต.ค. 2569', time: '16:30', lat: '17.2862', lng: '98.8931', area: 'อุทยานแห่งชาติแม่วะ จ.ลำปาง', battery: '85.00%', temp: '17.40' },
];

function renderTable(data) {
    const tbody = document.getElementById('table-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    data.forEach(item => {
        let row = `<tr>
            <td class="ps-3">${item.id}</td>
            <td>${item.code}</td>
            <td>${item.date}</td>
            <td>${item.time}</td>
            <td>${item.lat}</td>
            <td>${item.lng}</td>
            <td>${item.area}</td>
            <td>${item.battery}</td>
            <td class="pe-3">${item.temp}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

// ฟังก์ชันดึงข้อมูลจาก Google Apps Script API ของคุณ
async function fetchHornbillData() {
    const API_URL = "https://script.google.com/macros/s/AKfycbwZPgebby-VcBqA_y089FfcuzT-RuAwqeaMEUDx4X6uKLT5SvZ4yKVXbXSK-TZaQZaljg/exec";
    
    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        if (Array.isArray(result) && result.length > 0) {
            renderTable(result);
        } else {
            renderTable(mockData);
        }
    } catch (error) {
        console.error("Error fetching data, using mock data:", error);
        renderTable(mockData);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchHornbillData();
    // สั่งให้แผนที่คำนวณขนาดใหม่ป้องกันบั๊กเทาๆ หรือแสดงไม่เต็ม
    setTimeout(() => { map.invalidateSize(); }, 200);
});

document.getElementById('btn-refresh').addEventListener('click', () => {
    fetchHornbillData();
    map.invalidateSize();
    alert('อัปเดตข้อมูลเรียบร้อยแล้ว');
});