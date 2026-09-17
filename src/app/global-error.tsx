'use client';

// Komponen error wajib App Router: menangkap error di root layout agar tidak masuk loop refresh.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body
        style={{
          background: '#f1f5f9',
          color: '#1e293b',
          fontFamily: 'sans-serif',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 0,
        }}
      >
        <div style={{ textAlign: 'center', padding: 24 }}>
          <h1 style={{ fontSize: 20, marginBottom: 8 }}>Terjadi kesalahan sistem</h1>
          <p style={{ fontSize: 14, color: '#475569', marginBottom: 16 }}>
            Silakan muat ulang halaman untuk mencoba lagi.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: '12px 20px',
              minHeight: 44,
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#1d4ed8',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Muat ulang
          </button>
        </div>
      </body>
    </html>
  );
}
