import { useState, useEffect } from 'react'
import axios from 'axios'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function App() {
  const [logs, setLogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState(null)
  
  // Stats for Chart
  const [stats, setStats] = useState([{ name: 'Safe', value: 0 }, { name: 'Threats', value: 0 }])

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/logs')
        setLogs(res.data)
        
        const threats = res.data.filter(l => l.is_threat).length
        const safe = res.data.length - threats
        setStats([{ name: 'Safe', value: safe }, { name: 'Threats', value: threats }])
      } catch (err) { console.error("Backend offline") }
    }
    fetchLogs()
    const interval = setInterval(fetchLogs, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setStatus('Scanning...')
    try {
      await axios.post('http://localhost:5000/api/login', { username, password })
      setStatus('✅ ACCESS GRANTED')
    } catch (err) {
      if (err.response && err.response.data.ip_banned) {
        setStatus('⛔ YOUR IP IS PERMANENTLY BANNED')
      } else if (err.response && err.response.status === 403) {
        setStatus('🛡️ BLOCKED BY AEGIS AI')
      } else {
        setStatus('❌ Server Error')
      }
    }
  }

  const blockIP = async (ip) => {
    await axios.post('http://localhost:5000/api/block-ip', { ip })
    alert(`⛔ IP ${ip} has been banned!`)
  }

  const COLORS = ['#00C49F', '#FF4444'];

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', backgroundColor: '#0d0d0d', color: '#0f0', minHeight: '100vh' }}>
      <h1 style={{ borderBottom: '2px solid #333', paddingBottom: '20px' }}>🛡️ AEGIS SECURITY SYSTEM</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', marginTop: '40px' }}>
        
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ border: '1px solid #333', padding: '30px', borderRadius: '8px', background: '#1a1a1a' }}>
            <h3 style={{ color: 'white', marginTop: 0 }}>🚀 Attack Simulator</h3>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={{ padding: '12px', background: '#333', color: 'white', border: 'none', borderRadius: '4px' }} />
              <input placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '12px', background: '#333', color: 'white', border: 'none', borderRadius: '4px' }} />
              <button type="submit" style={{ padding: '12px', background: '#0f0', color: 'black', fontWeight: 'bold', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>ATTEMPT LOGIN</button>
            </form>
            {status && <div style={{ marginTop: '20px', padding: '10px', border: '1px solid white', textAlign: 'center', color: status.includes('BANNED') ? 'red' : 'white' }}>{status}</div>}
          </div>

          <div style={{ border: '1px solid #333', padding: '20px', borderRadius: '8px', background: '#1a1a1a', height: '300px' }}>
             <h3 style={{ color: 'white', marginTop: 0, textAlign: 'center' }}>📊 Threat Analysis</h3>
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {stats.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT COLUMN: LOGS WITH BLOCK BUTTON */}
        <div style={{ border: '1px solid #333', padding: '30px', borderRadius: '8px', background: '#1a1a1a', maxHeight: '700px', overflowY: 'auto' }}>
          <h3 style={{ color: 'white', marginTop: 0 }}>📡 Live Traffic Monitor</h3>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #555', color: '#888' }}>
                <th style={{ padding: '10px' }}>Time</th>
                <th style={{ padding: '10px' }}>Payload</th>
                <th style={{ padding: '10px' }}>Status</th>
                <th style={{ padding: '10px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid #333', color: log.is_threat ? '#ff4444' : '#fff' }}>
                  <td style={{ padding: '10px' }}>{log.timestamp}</td>
                  <td style={{ padding: '10px', fontFamily: 'Courier New' }}>{log.payload}</td>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{log.is_threat ? '🛑 THREAT' : '✅ SAFE'}</td>
                  <td style={{ padding: '10px' }}>
                    {log.is_threat && (
                      <button 
                        onClick={() => blockIP(log.ip)}
                        style={{ padding: '5px 10px', background: 'red', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '12px' }}>
                        BLOCK IP
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default App