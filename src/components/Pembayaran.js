import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../config';

function Pembayaran({ penghuni, kamar }) {
  const [payments, setPayments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bulan_bayar: '', tahun_bayar: new Date().getFullYear(),
    jumlah_bayar: kamar?.harga_sewa || 0, metode_bayar: 'cash', keterangan: ''
  });

  const bulanList = ['Januari','Februari','Maret','April','Mei','Juni',
    'Juli','Agustus','September','Oktober','November','Desember'];

  const fetchPayments = useCallback(async () => {
    if (!penghuni) return;
    try {
      const res = await axios.get(`${API}/api/pembayaran/penghuni/${penghuni._id}`);
      setPayments(res.data);
    } catch (err) { console.error('Error:', err); }
  }, [penghuni]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/pembayaran`, {
        penghuni_id: penghuni._id, nama_penghuni: penghuni.nama_lengkap,
        nomor_kamar: kamar.nomor_kamar, ...formData
      });
      alert('✅ Pembayaran dicatat!');
      setShowForm(false);
      setFormData({ bulan_bayar: '', tahun_bayar: new Date().getFullYear(),
        jumlah_bayar: kamar?.harga_sewa || 0, metode_bayar: 'cash', keterangan: '' });
      fetchPayments();
    } catch (err) { alert('❌ Gagal: ' + (err.response?.data?.message || err.message)); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin hapus?')) {
      try { await axios.delete(`${API}/api/pembayaran/${id}`); fetchPayments(); }
      catch (err) { alert('❌ Gagal'); }
    }
  };

  const formatRupiah = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');
  const formatTgl = (d) => new Date(d).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'});

  return (
    <div className="pembayaran-section">
      <div className="section-header">
        <h3>💰 Pembayaran - {penghuni.nama_lengkap}</h3>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Tutup' : '+ Catat Pembayaran'}</button>
      </div>
      {showForm && (
        <div className="card form-card"><form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group"><label>Nama</label>
              <input type="text" value={penghuni.nama_lengkap} disabled className="disabled" /></div>
            <div className="form-group"><label>Kamar</label>
              <input type="text" value={`No. ${kamar.nomor_kamar}`} disabled className="disabled" /></div>
            <div className="form-group"><label>Bulan *</label>
              <select value={formData.bulan_bayar} onChange={(e)=>setFormData({...formData,bulan_bayar:e.target.value})} required>
                <option value="">-- Pilih --</option>
                {bulanList.map(b=><option key={b} value={b}>{b}</option>)}</select></div>
            <div className="form-group"><label>Tahun *</label>
              <input type="number" value={formData.tahun_bayar}
                onChange={(e)=>setFormData({...formData,tahun_bayar:e.target.value})} required /></div>
            <div className="form-group"><label>Jumlah (Rp) *</label>
              <input type="number" value={formData.jumlah_bayar}
                onChange={(e)=>setFormData({...formData,jumlah_bayar:e.target.value})} required /></div>
            <div className="form-group"><label>Metode</label>
              <select value={formData.metode_bayar} onChange={(e)=>setFormData({...formData,metode_bayar:e.target.value})}>
                <option value="cash">💵 Cash</option><option value="transfer">🏦 Transfer</option></select></div>
            <div className="form-group full-width"><label>Keterangan</label>
              <input type="text" value={formData.keterangan}
                onChange={(e)=>setFormData({...formData,keterangan:e.target.value})} placeholder="Opsional" /></div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-success">💾 Simpan</button>
            <button type="button" className="btn btn-secondary" onClick={()=>setShowForm(false)}>Batal</button>
          </div></form></div>
      )}
      <div className="card"><h4>📜 Riwayat Pembayaran</h4>
        {payments.length === 0 ? <p className="empty-text">Belum ada pembayaran</p> : (
          <div className="table-responsive"><table className="data-table-full"><thead><tr>
            <th>No</th><th>Kwitansi</th><th>Bulan/Tahun</th><th>Jumlah</th><th>Metode</th><th>Tanggal</th><th>Aksi</th>
          </tr></thead><tbody>
            {payments.map((p,i)=><tr key={p._id}>
              <td>{i+1}</td><td><strong>{p.no_kwitansi}</strong></td>
              <td>{p.bulan_bayar} {p.tahun_bayar}</td>
              <td className="text-green"><strong>{formatRupiah(p.jumlah_bayar)}</strong></td>
              <td>{p.metode_bayar==='cash'?'💵 Cash':'🏦 Transfer'}</td>
              <td>{formatTgl(p.tanggal_bayar)}</td>
              <td><div className="action-buttons">
                <button className="btn btn-info btn-sm" onClick={()=>navigate(`/kwitansi/${p._id}`)}>🖨️</button>
                <button className="btn btn-danger btn-sm" onClick={()=>handleDelete(p._id)}>🗑️</button>
              </div></td></tr>)}
          </tbody></table></div>
        )}
      </div>
    </div>
  );
}

export default Pembayaran;
