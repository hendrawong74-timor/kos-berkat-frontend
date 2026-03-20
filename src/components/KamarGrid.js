import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../config';

function KamarGrid() {
  const [kamars, setKamars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchKamars = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/kamar`);
      setKamars(res.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKamars();
  }, [fetchKamars]);

  const handleKamarClick = (kamar) => {
    navigate(`/kamar/${kamar._id}`);
  };

  if (loading) return <div className="loading">⏳ Memuat data kamar...</div>;

  const lantai1 = kamars.filter(k => k.lantai === 1);
  const lantai2 = kamars.filter(k => k.lantai === 2);

  const renderKamar = (kamar) => (
    <div key={kamar._id} className={`kamar-card ${kamar.status}`}
      onClick={() => handleKamarClick(kamar)}>
      <div className="kamar-number"><span>{kamar.nomor_kamar}</span></div>
      {kamar.status === 'terisi' && kamar.penghuni_id ? (
        <div className="kamar-penghuni">
          {kamar.penghuni_id.foto_penghuni ? (
            <img src={`${API}${kamar.penghuni_id.foto_penghuni}`} alt="Foto"
              className="kamar-foto" onError={(e) => {
                e.target.style.display = 'none';
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
              }} />
          ) : null}
          <div className="kamar-foto-placeholder"
            style={{ display: kamar.penghuni_id.foto_penghuni ? 'none' : 'flex' }}>👤</div>
          <p className="kamar-nama">{kamar.penghuni_id.nama_lengkap}</p>
        </div>
      ) : (
        <div className="kamar-kosong">
          <span className="kosong-icon">🔓</span><p>Kosong</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="kamar-page">
      <div className="page-title">
        <h2>🏠 Daftar Kamar</h2>
        <div className="legend">
          <span className="legend-item"><span className="dot kosong"></span> Kosong</span>
          <span className="legend-item"><span className="dot terisi"></span> Terisi</span>
        </div>
      </div>
      <div className="lantai-section">
        <h3>📍 Lantai 1</h3>
        <div className="kamar-grid">{lantai1.map(renderKamar)}</div>
      </div>
      <div className="lantai-section">
        <h3>📍 Lantai 2</h3>
        <div className="kamar-grid">{lantai2.map(renderKamar)}</div>
      </div>
    </div>
  );
}

export default KamarGrid;