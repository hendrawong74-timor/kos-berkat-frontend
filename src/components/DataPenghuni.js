import React from 'react';
import API from '../config';

function DataPenghuni({ penghuni, kamar }) {
  if (!penghuni) return null;

  const formatTanggal = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <div className="data-penghuni-section">
      <h3>📋 Data Penghuni - Kamar {kamar.nomor_kamar}</h3>
      <div className="penghuni-profile">
        <div className="profile-photo">
          {penghuni.foto_penghuni ? (
            <img src={`${API}${penghuni.foto_penghuni}`} alt="Foto Penghuni"
              className="foto-besar" onError={(e) => { e.target.style.display = 'none'; }} />
          ) : (
            <div className="foto-placeholder-besar">👤</div>
          )}
        </div>
        <div className="profile-data">
          <table className="data-table"><tbody>
            <tr><td className="label">Nama Lengkap</td><td className="value">{penghuni.nama_lengkap}</td></tr>
            <tr><td className="label">No. HP</td><td className="value">{penghuni.no_hp || '-'}</td></tr>
            <tr><td className="label">No. KTP</td><td className="value">{penghuni.no_ktp || '-'}</td></tr>
            <tr><td className="label">Tanggal Masuk</td><td className="value">{formatTanggal(penghuni.tanggal_masuk)}</td></tr>
            <tr><td className="label">Asal Kota</td><td className="value">{penghuni.asal_kota || '-'}</td></tr>
            <tr><td className="label">Kampus</td><td className="value">{penghuni.kampus || '-'}</td></tr>
            <tr><td className="label">Fakultas</td><td className="value">{penghuni.fakultas || '-'}</td></tr>
            <tr><td className="label">Kamar</td><td className="value">No. {kamar.nomor_kamar} (Lantai {kamar.lantai})</td></tr>
            <tr><td className="label">Harga Sewa</td><td className="value">Rp {kamar.harga_sewa?.toLocaleString('id-ID')}/bulan</td></tr>
          </tbody></table>
        </div>
      </div>
      {penghuni.foto_ktp && (
        <div className="ktp-section">
          <h4>📷 Foto KTP</h4>
          <img src={`${API}${penghuni.foto_ktp}`} alt="KTP" className="foto-ktp"
            onError={(e) => { e.target.style.display = 'none'; }} />
        </div>
      )}
    </div>
  );
}

export default DataPenghuni;