'use client';

import { useState } from 'react';

const sugerencias = [
  'el tiempo y la memoria',
  'lo extraño dentro de lo cotidiano',
  'las respuestas poco habituales',
  'la identidad y el doble',
  'el lenguaje como trampa',
  'el deseo y la obligación',
];

interface Libro {
  titulo: string;
  autor: string;
  año: string;
  propuesta: string;
  por_que: string;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [libros, setLibros] = useState<Libro[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  async function buscar() {
    if (!query.trim()) return;
    setCargando(true);
    setLibros([]);
    setError('');

    try {
      const res = await fetch('/api/recomendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        setError('Hubo un error. Intentá de nuevo.');
        setCargando(false);
        return;
      }

      const data = await res.json();
      setLibros(data.libros);
    } catch (e) {
      setError('Hubo un error. Intentá de nuevo.');
    }

    setCargando(false);
  }

  function reset() {
    setQuery('');
    setLibros([]);
    setError('');
  }

  return (
    <main style={{ maxWidth: '640px', margin: '0 auto', padding: '3rem 1.5rem', fontFamily: 'Georgia, serif' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '400', marginBottom: '0.4rem' }}>Literatura argentina</h1>
      <p style={{ fontSize: '14px', color: '#888', marginBottom: '2rem', fontFamily: 'sans-serif' }}>
        Describí qué querés explorar. Encontramos el libro cuya propuesta resuene con eso.
      </p>

      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ej: quiero entender cómo la historia oficial oculta otras historias..."
        style={{ width: '100%', minHeight: '90px', fontSize: '15px', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontFamily: 'sans-serif', marginBottom: '1rem', resize: 'none' }}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.2rem' }}>
        {sugerencias.map((s) => (
          <span
            key={s}
            onClick={() => setQuery(s)}
            style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '20px', border: '1px solid #ddd', cursor: 'pointer', fontFamily: 'sans-serif', color: '#555' }}
          >
            {s}
          </span>
        ))}
      </div>

      <button
        onClick={buscar}
        disabled={cargando}
        style={{ fontSize: '14px', padding: '8px 18px', borderRadius: '8px', border: '1px solid #ccc', background: 'white', cursor: 'pointer', fontFamily: 'sans-serif' }}
      >
        {cargando ? 'Buscando...' : 'Buscar libros'}
      </button>

      {error && (
        <p style={{ color: 'red', fontSize: '14px', marginTop: '1rem', fontFamily: 'sans-serif' }}>{error}</p>
      )}

      {libros.length > 0 && (
        <div style={{ marginTop: '2.5rem' }}>
          {libros.map((libro, i) => (
            <div key={i} style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '17px', fontStyle: 'italic' }}>{libro.titulo}</span>
                <span style={{ fontSize: '13px', color: '#888', fontFamily: 'sans-serif' }}>{libro.autor}</span>
                <span style={{ fontSize: '12px', color: '#bbb', fontFamily: 'sans-serif', marginLeft: 'auto' }}>{libro.año}</span>
              </div>
              <p style={{ fontSize: '14px', lineHeight: '1.7', marginBottom: '0.8rem', fontFamily: 'sans-serif' }}>{libro.propuesta}</p>
              <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.6', fontFamily: 'sans-serif' }}><strong>Por qué este libro:</strong> {libro.por_que}</p>
            </div>
          ))}
          <button onClick={reset} style={{ fontSize: '13px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'sans-serif' }}>
            Nueva búsqueda
          </button>
        </div>
      )}
    </main>
  );
}