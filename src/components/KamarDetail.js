import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../config';
import DataPenghuni from './DataPenghuni';
import FormPenghuni from './FormPenghuni';
import Pembayaran from './Pembayaran';
import KeteranganPenghuni from './KeteranganPenghuni';

function KamarDetail() {
  const { kamarId } = useParams();
  const navigate = useNavigate();
  const [kamar, setKamar] = useState(null);
  const [penghuni, setPenghuni] = useState(null);
  const [activeMenu, setActiveMenu] = useState('data');
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const fetchKamar = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/kamar/${kamarId}`);
      setKamar(res.data);
      if (res.data.penghuni_id) {
        const penghuniId = res.data.penghuni_id._id || res.data.penghuni_id;
        const penghuniRes = await axios.get(`${API}/api/penghuni/${penghuniId}`);
        setPenghuni(penghuniRes.data);
      } else {
        setPenghuni(null);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, [kamarId]);

  useEffect(() => { fetchKamar(); }, [fetchKamar]);

  const handlePenghuniAdded = () => {
    setShowAddForm(false);
    setEditMode(false);
    setActiveMenu('data');
    fetchKamar();
  };

  const handlePenghuniKeluar = async () => {
    if (!penghuni) return;
    if (!window.confirm(`⚠️ Yakin ${penghuni.nama_lengkap} keluar dari Kamar ${kamar.nomor_kamar}?`)) return;
    try {
      await axios.put(`${API}/api/penghuni/${penghuni._id}/keluar`);
      alert('✅ Penghuni telah keluar');
      setPenghuni(null);
      setActiveMenu('data');
      fetchKamar();
    } catch (err) {
      alert('❌ Gagal: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="loading">⏳ Memuat data kamar...</div>;
  if (!kamar) return <div className="loading">❌ Kamar tidak ditemukan</div>;

  return (
    <div className="kamar-detail-page">
      <div className="detail-header">
        <button className="btn-back" onClick={() => navigate('/')}>← Kembali</button>
        <div className="detail-title">
          <h2>🚪 Kamar {kamar.nomor_kamar}</h2>
          <span className={`status-badge ${kamar.status}`}>
            {kamar.status === 'terisi' ? '🟢 Terisi' : '⚪ Kosong'}
          </span>
          <span className="harga-badge">Rp {kamar.harga_sewa?.toLocaleString('id-ID')}/bulan</span>
        </div>
      </div>

      {kamar.status === 'kosong' && !showAddForm && (
        <div className="empty-room">
          <div className="empty-icon">🔓</div>
          <h3>Kamar ini kosong</h3>
          <p>Belum ada penghuni di kamar ini</p>
          <button className="btn btn-primary btn-lg" onClick={() => setShowAddForm(true)}>
            ➕ Tambah Penghuni Baru
          </button>
        </div>
      )}

      {showAddForm && !penghuni && (
        <FormPenghuni kamar={kamar} onSuccess={handlePenghuniAdded}
          onCancel={() => setShowAddForm(false)} />
      )}

      {penghuni && (
        <>
          <div className="sub-menu">
            <button className={`menu-btn ${activeMenu === 'data' ? 'active' : ''}`}
              onClick={() => { setActiveMenu('data'); setEditMode(false); }}>📋 Data Penghuni</button>
            <button className={`menu-btn ${activeMenu === 'pembayaran' ? 'active' : ''}`}
              onClick={() => setActiveMenu('pembayaran')}>💰 Pembayaran</button>
            <button className={`menu-btn ${activeMenu === 'edit' ? 'active' : ''}`}
              onClick={() => { setActiveMenu('edit'); setEditMode(true); }}>✏️ Edit Penghuni</button>
            <button className={`menu-btn ${activeMenu === 'keterangan' ? 'active' : ''}`}
              onClick={() => setActiveMenu('keterangan')}>📝 Keterangan</button>
            <button className="menu-btn menu-btn-danger" onClick={handlePenghuniKeluar}>
              🚪 Penghuni Keluar</button>
          </div>
          <div className="sub-content">
            {activeMenu === 'data' && <DataPenghuni penghuni={penghuni} kamar={kamar} />}
            {activeMenu === 'pembayaran' && <Pembayaran penghuni={penghuni} kamar={kamar} />}
            {activeMenu === 'edit' && editMode && (
              <FormPenghuni kamar={kamar} penghuni={penghuni} editMode={true}
                onSuccess={handlePenghuniAdded}
                onCancel={() => { setActiveMenu('data'); setEditMode(false); }} />
            )}
            {activeMenu === 'keterangan' && <KeteranganPenghuni penghuni={penghuni} />}
          </div>
        </>
      )}
    </div>
  );
}

export default KamarDetail;