'use client';

interface PIDDiagramProps {
  type: 'wwtp' | 'clean-water' | 'fire-system';
}

export default function PIDDiagram({ type }: PIDDiagramProps) {
  const renderDiagram = () => {
    switch (type) {
      case 'wwtp':
        return (
          <svg viewBox="0 0 500 280" className="w-full h-auto">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
              </marker>
            </defs>
            
            <rect x="20" y="60" width="100" height="80" fill="#fef3c7" stroke="#d97706" strokeWidth="2" rx="8" />
            <text x="70" y="95" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#92400e">Inlet</text>
            <text x="70" y="115" textAnchor="middle" fontSize="9" fill="#92400e">Tank</text>
            
            <line x1="120" y1="100" x2="180" y2="100" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
            
            <rect x="180" y="40" width="120" height="120" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" rx="8" />
            <text x="240" y="95" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1d4ed8">Primary</text>
            <text x="240" y="115" textAnchor="middle" fontSize="9" fill="#1d4ed8">Treatment</text>
            
            <line x1="300" y1="80" x2="360" y2="80" stroke="#64748b" strokeWidth="2" />
            <line x1="300" y1="120" x2="360" y2="120" stroke="#64748b" strokeWidth="2" />
            
            <circle cx="380" cy="80" r="25" fill="#fce7f3" stroke="#db2777" strokeWidth="2" />
            <text x="380" y="75" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#be185d">pH</text>
            <text x="380" y="87" textAnchor="middle" fontSize="8" fill="#9d174d">Sensor</text>
            
            <rect x="360" y="130" width="100" height="60" fill="#d1fae5" stroke="#059669" strokeWidth="2" rx="8" />
            <text x="410" y="155" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#065f46">Outlet</text>
            <text x="410" y="172" textAnchor="middle" fontSize="9" fill="#065f46">Clean Water</text>
            
            <circle cx="70" cy="160" r="15" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
            <text x="70" y="165" textAnchor="middle" fontSize="16">P</text>
            
            <line x1="70" y1="145" x2="70" y2="120" stroke="#ef4444" strokeWidth="2" />
            
            <rect x="40" y="200" width="60" height="40" fill="#f3f4f6" stroke="#6b7280" strokeWidth="1" rx="4" />
            <text x="70" y="225" textAnchor="middle" fontSize="9" fill="#4b5563">PLC</text>
            <text x="70" y="238" textAnchor="middle" fontSize="8" fill="#6b7280">Slave 1</text>
            
            <line x1="70" y1="240" x2="70" y2="200" stroke="#6b7280" strokeWidth="1" strokeDasharray="4" />
            
            <text x="250" y="260" textAnchor="middle" fontSize="10" fill="#94a3b8">P&ID - Waste Water Treatment Plant</text>
          </svg>
        );
      
      case 'clean-water':
        return (
          <svg viewBox="0 0 500 280" className="w-full h-auto">
            <defs>
              <marker id="arrowhead2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
              </marker>
            </defs>
            
            <rect x="30" y="80" width="90" height="70" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" rx="8" />
            <text x="75" y="110" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1d4ed8">Reservoir</text>
            <text x="75" y="128" textAnchor="middle" fontSize="9" fill="#1d4ed8">Input</text>
            
            <line x1="120" y1="115" x2="170" y2="115" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead2)" />
            
            <circle cx="195" cy="115" r="22" fill="#fce7f3" stroke="#db2777" strokeWidth="2" />
            <text x="195" y="110" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#be185d">Flow</text>
            <text x="195" y="122" textAnchor="middle" fontSize="8" fill="#9d174d">Sensor</text>
            
            <line x1="217" y1="115" x2="270" y2="115" stroke="#64748b" strokeWidth="2" />
            
            <circle cx="295" cy="115" r="20" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
            <text x="295" y="110" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#92400e">Pressure</text>
            <text x="295" y="122" textAnchor="middle" fontSize="8" fill="#92400e">Transmitter</text>
            
            <line x1="315" y1="115" x2="370" y2="115" stroke="#64748b" strokeWidth="2" />
            
            <rect x="370" y="85" width="80" height="60" fill="#d1fae5" stroke="#059669" strokeWidth="2" rx="8" />
            <text x="410" y="110" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#065f46">Distribution</text>
            <text x="410" y="128" textAnchor="middle" fontSize="9" fill="#065f46">Network</text>
            
            <circle cx="75" cy="200" r="15" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
            <text x="75" y="205" textAnchor="middle" fontSize="16">P</text>
            
            <line x1="75" y1="185" x2="75" y2="150" stroke="#ef4444" strokeWidth="2" />
            
            <rect x="45" y="230" width="60" height="35" fill="#f3f4f6" stroke="#6b7280" strokeWidth="1" rx="4" />
            <text x="75" y="252" textAnchor="middle" fontSize="9" fill="#4b5563">PLC</text>
            <text x="75" y="264" textAnchor="middle" fontSize="8" fill="#6b7280">Slave 2</text>
            
            <text x="250" y="260" textAnchor="middle" fontSize="10" fill="#94a3b8">P&ID - Clean Water Distribution System</text>
          </svg>
        );
      
      case 'fire-system':
        return (
          <svg viewBox="0 0 500 280" className="w-full h-auto">
            <defs>
              <marker id="arrowhead3" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
              </marker>
            </defs>
            
            <rect x="40" y="60" width="120" height="100" fill="#f3f4f6" stroke="#6b7280" strokeWidth="2" rx="8" strokeDasharray="8,4" />
            <text x="100" y="100" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#374151">Protected</text>
            <text x="100" y="118" textAnchor="middle" fontSize="9" fill="#6b7280">Area</text>
            <text x="100" y="150" textAnchor="middle" fontSize="8" fill="#9ca3af">Zone A</text>
            
            <circle cx="70" cy="130" r="18" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
            <text x="70" y="125" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#92400e">Temp</text>
            <text x="70" y="137" textAnchor="middle" fontSize="7" fill="#92400e">Sensor</text>
            
            <circle cx="130" cy="130" r="18" fill="#fce7f3" stroke="#db2777" strokeWidth="2" />
            <text x="130" y="125" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#be185d">Smoke</text>
            <text x="130" y="137" textAnchor="middle" fontSize="7" fill="#9d174d">Detector</text>
            
            <line x1="160" y1="110" x2="210" y2="110" stroke="#64748b" strokeWidth="2" />
            <line x1="160" y1="150" x2="210" y2="150" stroke="#64748b" strokeWidth="2" />
            
            <rect x="210" y="80" width="100" height="80" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" rx="8" />
            <text x="260" y="115" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#dc2626">Fire Alarm</text>
            <text x="260" y="135" textAnchor="middle" fontSize="9" fill="#dc2626">Control Panel</text>
            
            <line x1="310" y1="120" x2="380" y2="120" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowhead3)" />
            
            <rect x="380" y="90" width="80" height="60" fill="#fef2f2" stroke="#ef4444" strokeWidth="2" rx="8" />
            <text x="420" y="115" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#dc2626">Alarm</text>
            <text x="420" y="135" textAnchor="middle" fontSize="9" fill="#dc2626">Bell/Siren</text>
            
            <circle cx="80" cy="210" r="15" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
            <text x="80" y="215" textAnchor="middle" fontSize="16">P</text>
            
            <rect x="50" y="230" width="60" height="35" fill="#f3f4f6" stroke="#6b7280" strokeWidth="1" rx="4" />
            <text x="80" y="252" textAnchor="middle" fontSize="9" fill="#4b5563">PLC</text>
            <text x="80" y="264" textAnchor="middle" fontSize="8" fill="#6b7280">Slave 3</text>
            
            <text x="250" y="260" textAnchor="middle" fontSize="10" fill="#94a3b8">P&ID - Fire Protection System</text>
          </svg>
        );
    }
  };

  return (
    <div className="detail-section">
      <div className="detail-section-header">Process Diagram (P&ID)</div>
      <div className="detail-section-body">
        <div className="pid-diagram">
          {renderDiagram()}
        </div>
      </div>
    </div>
  );
}