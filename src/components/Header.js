import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API from '../config';

function Header() {
  const [setting, setSetting] = useState({});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    fetchSetting();
  }, []);

  const fetchSetting = async () => {
    try {
      const res = await axios.get(`${API}/api/setting`);
      setSetting(res.data);
      setFormData(res.data);
    } catch (err) {
      console.error('Error fetch setting:', err);
    }
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append('nama_kos', formData.nama_kos || '');
      data.append('alamat_kos', formData.alamat_kos || '');
      data.append('no_hp_pemilik', formData.no_hp_pemilik || '');
      if (logoFile) data.append('logo', logoFile);

      const res = await axios.put(`${API}/api/setting`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSetting(res.data);
      setEditing(false);
      setLogoFile(null);
      alert('✅ Setting berhasil disimpan!');
    } catch (err) {
      alert('❌ Gagal menyimpan setting');
    }
  };

  return (
    <header className="header">
      <Link to="/" className="header-link">
        <div className="header-content">
          {setting.logo ? (
            <img src={`${API}${setting.logo}`} alt="Logo" className="header-logo"
              onError={(e) => { e.target.style.display = 'none'; }} />
          ) : (
            <div className="header-logo-placeholder">🏠</div>
          )}
          {!editing && (
            <div className="header-info">
              <h1>{setting.nama_kos || 'Kos Berkat'}</h1>
              {setting.alamat_kos && <p>{setting.alamat_kos}</p>}
              {setting.no_hp_pemilik && <p>📞 {setting.no_hp_pemilik}</p>}
            </div>
          )}
        </div>
      </Link>

      {editing && (
        <div className="header-edit-form" onClick={(e) => e.stopPropagation()}>
          <div className="edit-row">
            <input type="text" placeholder="Nama Kos" value={formData.nama_kos || ''}
              onChange={(e) => setFormData({...formData, nama_kos: e.target.value})} />
            <input type="text" placeholder="Alamat Kos" value={formData.alamat_kos || ''}
              onChange={(e) => setFormData({...formData, alamat_kos: e.target.value})} />
            <input type="text" placeholder="No HP Pemilik" value={formData.no_hp_pemilik || ''}
              onChange={(e) => setFormData({...formData, no_hp_pemilik: e.target.value})} />
            <div className="file-upload-wrapper">
              <label>Logo:</label>
              <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} />
            </div>
            <div className="edit-buttons">
              <button className="btn btn-success btn-sm" onClick={handleSave}>💾 Simpan</button>
              <button className="btn btn-secondary btn-sm" onClick={() => setEditing(false)}>Batal</button>
            </div>
          </div>
        </div>
      )}

      <button className="btn-edit-header"
        onClick={(e) => { e.preventDefault(); setEditing(!editing); }} title="Edit Info Kos">
        ⚙️
      </button>
    </header>
  );
}

export default Header;