// ตั้งค่าแผนที่ Leaflet (พิกัดเริ่มต้น อุทยานแห่งชาติแม่วะ จ.ลำปาง)
const map = L.map('map').setView([17.3345, 98.9752], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).default

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

// ข้อมูลตัวอย่าง (Mock Data) สำหรับใส่ตารางและ Card
const mockData = [
    { id: 1, code: 'KKOZ01', date: '21 ต.ค. 2569', time: '14:35', lat: '17.3345', lng: '98.9752', area: 'อุทยานแห่งชาติแม่วะ จ.ลำปาง', battery: '81.25%', temp: '15.50' },
    { id: 2, code: 'KKOZ01', date: '21 ต.ค. 2569', time: '12:10', lat: '17.3281', lng: '98.9623', area: 'อุทยานแห่งชาติแม่วะ จ.ลำปาง', battery: '82.10%', temp: '16.20' },
    { id: 3, code: 'KKOZ01', date: '21 ต.ค. 2569', time: '09:45', lat: '17.3116', lng: '98.9417', area: 'อุทยานแห่งชาติแม่วะ จ.ลำปาง', battery: '83.40%', temp: '16.80' },
    { id: 4, code: 'KKOZ01', date: '21 ต.ค. 2569', time: '07:20', lat: '17.2984', lng: '98.9156', area: 'อุทยานแห่งชาติแม่วะ จ.ลำปาง', battery: '84.10%', temp: '17.10' },
    { id: 5, code: 'KKOZ01', date: '20 ต.ค. 2569', time: '16:30', lat: '17.2862', lng: '98.8931', area: 'อุทยานแห่งชาติแม่วะ จ.ลำปาง', battery: '85.00%', temp: '17.40' },
];

function renderTable(data) {
    const tbody = document.getElementById('table-body');
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

// ฟังก์ชันสำหรับดึงข้อมูลจาก Google Apps Script Web App API
async function fetchHornbillData() {
    const API_URL = "https://script.google.com/macros/s/AKfycbwZPgebby-VcBqA_y089FfcuzT-RuAwqeaMEUDx4X6uKLT5SvZ4yKVXbXSK-TZaQZaljg/exec"; // แทนที่ด้วย URL ของคุณ
    
    if(API_URL.includes("YOUR_GOOGLE_APPS_SCRIPT")) {
        // ใช้ข้อมูลจำลองแสดงผลกรณีพึ่งเริ่มต้น
        renderTable(mockData);
        return;
    }

    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        // สมมติโครงสร้างข้อมูลที่ส่งกลับมาจาก Apps Script เป็น Array ของข้อมูล
        renderTable(result);
    } catch (error) {
        console.error("Error fetching data from Google Sheets:", error);
        renderTable(mockData); // Fallback ใช้ข้อมูล Mock หากเรียก API ไม่สำเร็จ
    }
}

// โหลดข้อมูลเมื่อเปิดหน้าเว็บ
document.addEventListener('DOMContentLoaded', () => {
    fetchHornbillData();
});

// ปุ่มกดอัปเดตข้อมูล
document.getElementById('btn-refresh').addEventListener('click', () => {
    alert('กำลังรีเฟรชข้อมูลล่าสุด...');
    fetchHornbillData();
});