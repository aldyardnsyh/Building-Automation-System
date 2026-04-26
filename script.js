// Dummy Data Generator for BAS IoT Dashboard
function generateDummyData() {
    return {
        wwtp: {
            flow: Math.floor(Math.random() * 450) + 50, // 50-500 L/min
            pressure: (Math.random() * 8 + 1).toFixed(1), // 1-9 Bar
            ph: (Math.random() * 2 + 6.5).toFixed(1), // 6.5-8.5 pH
            pump_status: Math.random() > 0.3 ? 1 : 0, // 70% chance ON
            valve_status: Math.random() > 0.2 ? 1 : 0 // 80% chance OPEN
        },
        clean_water: {
            flow: Math.floor(Math.random() * 900) + 100, // 100-1000 L/min
            pressure: (Math.random() * 7 + 2).toFixed(1), // 2-9 Bar
            dist_status: Math.random() > 0.1 ? 1 : 0 // 90% chance ON
        },
        fire_system: {
            temp: Math.floor(Math.random() * 15) + 25, // 25-40 °C
            smoke: Math.floor(Math.random() * 800), // 0-800
            status: Math.random() > 0.95 ? 1 : 0 // 5% chance of FIRE ALARM
        }
    };
}

// Initialize Gauges
const gauges = {
    // WWTP Gauges
    wwtpFlow: new LinearGauge({
        renderTo: 'wwtp-flow',
        width: 280,
        height: 120,
        minValue: 0,
        maxValue: 500,
        units: 'L/min',
        colorPlate: '#16213e',
        colorBar: '#00adb5',
        colorText: '#e6e6e6',
        colorBarEnd: '#00ff88'
    }).draw(),
    wwtpPressure: new LinearGauge({
        renderTo: 'wwtp-pressure',
        width: 280,
        height: 120,
        minValue: 0,
        maxValue: 10,
        units: 'Bar',
        colorPlate: '#16213e',
        colorBar: '#00adb5',
        colorText: '#e6e6e6'
    }).draw(),
    wwtpPh: new RadialGauge({
        renderTo: 'wwtp-ph',
        width: 200,
        height: 200,
        minValue: 0,
        maxValue: 14,
        units: 'pH',
        colorPlate: '#16213e',
        colorBar: '#00adb5',
        colorText: '#e6e6e6',
        highlights: [
            { from: 0, to: 6, color: '#ff2e63' },
            { from: 6, to: 8.5, color: '#00ff88' },
            { from: 8.5, to: 14, color: '#ff2e63' }
        ]
    }).draw(),
    // Clean Water Gauges
    cwFlow: new LinearGauge({
        renderTo: 'cw-flow',
        width: 280,
        height: 120,
        minValue: 0,
        maxValue: 1000,
        units: 'L/min',
        colorPlate: '#16213e',
        colorBar: '#00adb5',
        colorText: '#e6e6e6'
    }).draw(),
    cwPressure: new LinearGauge({
        renderTo: 'cw-pressure',
        width: 280,
        height: 120,
        minValue: 0,
        maxValue: 10,
        units: 'Bar',
        colorPlate: '#16213e',
        colorBar: '#00adb5',
        colorText: '#e6e6e6'
    }).draw(),
    // Fire System Gauges
    fireTemp: new LinearGauge({
        renderTo: 'fire-temp',
        width: 280,
        height: 120,
        minValue: 0,
        maxValue: 100,
        units: '°C',
        colorPlate: '#16213e',
        colorBar: '#00adb5',
        colorText: '#e6e6e6',
        colorBarEnd: '#ff2e63'
    }).draw(),
    fireSmoke: new LinearGauge({
        renderTo: 'fire-smoke',
        width: 280,
        height: 120,
        minValue: 0,
        maxValue: 1023,
        units: 'ppm',
        colorPlate: '#16213e',
        colorBar: '#00adb5',
        colorText: '#e6e6e6'
    }).draw()
};

// Update Dashboard Function
function updateDashboard() {
    const d = generateDummyData();
    
    // Update WWTP Gauges
    gauges.wwtpFlow.value = d.wwtp.flow;
    gauges.wwtpPressure.value = d.wwtp.pressure;
    gauges.wwtpPh.value = d.wwtp.ph;
    
    // Update Clean Water Gauges
    gauges.cwFlow.value = d.clean_water.flow;
    gauges.cwPressure.value = d.clean_water.pressure;
    
    // Update Fire System Gauges
    gauges.fireTemp.value = d.fire_system.temp;
    gauges.fireSmoke.value = d.fire_system.smoke;
    
    // Update Indicators
    document.getElementById('wwtp-pump').classList.toggle('active', d.wwtp.pump_status);
    document.getElementById('wwtp-valve').classList.toggle('active', d.wwtp.valve_status);
    document.getElementById('cw-dist').classList.toggle('active', d.clean_water.dist_status);
    document.getElementById('fire-status').classList.toggle('active', d.fire_system.status);
    
    // Fire Alarm Visual Feedback
    const fireCard = document.querySelectorAll('.card')[2];
    fireCard.style.backgroundColor = d.fire_system.status ? '#2d0000' : '#16213e';
}

// Initial Load
updateDashboard();
// Update Every 2 Seconds
setInterval(updateDashboard, 2000);