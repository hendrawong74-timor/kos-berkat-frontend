import React, { useState } from 'react';
import axios from 'axios';
import API from '../config';

function FormPenghuni({ kamar, penghuni, editMode, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    nama_lengkap: penghuni?.nama_lengkap || '',
    no_hp: penghuni?.no_hp || '',
    no_ktp: penghuni?.no_ktp || '',
    tanggal_masuk: penghuni?.tanggal_masuk
      ? new Date(penghuni.tanggal_masuk).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    asal_kota: penghuni?.asal_kota || '',
    kampus: penghuni?.kampus || '',
    fakultas: penghuni?.fakultas || ''
  });
  const [fotoPenghuni, setFotoPenghuni] = useState(null);
  const [fotoKtp, setFotoKtp] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(
    penghuni?.foto_penghuni ? `${API}${penghuni.foto_penghuni}` : null
  );
  const [previewKtp, setPreviewKtp] = useState(
    penghuni?.foto_ktp ? `${API}${penghuni.foto_ktp}` : null
  );
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('File terlalu besar! Maks 5MB'); return; }
    if (e.target.name === 'foto_penghuni') {
      setFotoPenghuni(file); setPreviewFoto(URL.createObjectURL(file));
    } else if (e.target.name === 'foto_ktp') {
      setFotoKtp(file); setPreviewKtp(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      data.append('kamar_id', kamar._id);
      if (fotoPenghuni) data.append('foto_penghuni', fotoPenghuni);
      if (fotoKtp) data.append('foto_ktp', fotoKtp);

      if (editMode && penghuni) {
        await axios.put(`${API}/api/penghuni/${penghuni._id}`, data,
          { headers: { 'Content-Type': 'multipart/form-data' } });
        alert('✅ Data berhasil diupdate!');
      } else {
        await axios.post(`${API}/api/penghuni`, data,
          { headers: { 'Content-Type': 'multipart/form-data' } });
        alert('✅ Penghuni baru ditambahkan!');
      }
      onSuccess();
    } catch (err) {
      alert('❌ Gagal: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-section">
      <h3>{editMode ? '✏️ Edit Penghuni' : '➕ Tambah Penghuni'} - Kamar {kamar.nomor_kamar}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Nama Lengkap *</label>
            <input type="text" name="nama_lengkap" value={formData.nama_lengkap}
              onChange={handleChange} required placeholder="Nama lengkap" />
          </div>
          <div className="form-group"><label>No. HP</label>
            <input type="text" name="no_hp" value={formData.no_hp} onChange={handleChange} placeholder="08xxx" /></div>
          <div className="form-group"><label>No. KTP</label>
            <input type="text" name="no_ktp" value={formData.no_ktp} onChange={handleChange} placeholder="No KTP" /></div>
          <div className="form-group"><label>Tanggal Masuk</label>
            <input type="date" name="tanggal_masuk" value={formData.tanggal_masuk} onChange={handleChange} /></div>
          <div className="form-group"><label>Asal Kota</label>
            <input type="text" name="asal_kota" value={formData.asal_kota} onChange={handleChange} placeholder="Kota asal" /></div>
          <div className="form-group"><label>Kampus</label>
            <input type="text" name="kampus" value={formData.kampus} onChange={handleChange} placeholder="Nama kampus" /></div>
          <div className="form-group"><label>Fakultas</label>
            <input type="text" name="fakultas" value={formData.fakultas} onChange={handleChange} placeholder="Fakultas" /></div>
          <div className="form-group"><label>📷 Pas Foto</label>
            <input type="file" name="foto_penghuni" accept="image/*" onChange={handleFileChange} className="file-input" />
            {previewFoto && <img src={previewFoto} alt="Preview" className="preview-img" />}</div>
          <div className="form-group"><label>🪪 Foto KTP</label>
            <input type="file" name="foto_ktp" accept="image/*" onChange={handleFileChange} className="file-input" />
            {previewKtp && <img src={previewKtp} alt="KTP" className="preview-img" />}</div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? '⏳ Menyimpan...' : (editMode ? '💾 Update' : '💾 Simpan')}</button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Batal</button>
        </div>
      </form>
    </div>
  );
}

export default FormPenghuni;