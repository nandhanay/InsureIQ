// This frontend project was used for development testing only.
// The production application lives in the root /src directory.
// Run `npm run dev` from the project root (not /frontend) to use the real app.

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#030303', color: '#666', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ color: '#fff', marginBottom: '8px' }}>Wrong Frontend</h2>
        <p style={{ fontSize: '14px', maxWidth: '400px' }}>
          This is the development testing frontend. The production app runs from the project root.
          <br /><br />
          Run <code style={{ background: '#1a1a1a', padding: '2px 6px', borderRadius: '4px' }}>npm run dev</code> from the project root directory instead.
        </p>
      </div>
    </div>
  )
}
