import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../config';

function Kwitansi() {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [setting, setSetting] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [payRes, setRes] = await Promise.all([
          axios.get(`${API}/api/pembayaran/${paymentId}`),
          axios.get(`${API}/api/setting`)
        ]);
        setPayment(payRes.data);
        setSetting(setRes.data);
      } catch (err) { console.error('Error:', err); }
    };
    fetchData();
  }, [paymentId]);

  if (!payment) return <div className="loading">⏳ Memuat kwitansi...</div>;
  const formatRupiah = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');
  const formatTgl = (d) => new Date(d).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'});

  return (
    <div className="kwitansi-page">
      <div className="no-print kwitansi-actions">
        <button className="btn btn-secondary" onClick={()=>navigate(-1)}>← Kembali</button>
        <button className="btn btn-primary" onClick={()=>window.print()}>🖨️ Print</button>
      </div>
      <div className="kwitansi-paper">
        <div className="kwitansi-header">
          {setting.logo && <img src={`${API}${setting.logo}`} alt="Logo" className="kwitansi-logo"
            onError={(e)=>{e.target.style.display='none';}} />}
          <div><h2>{setting.nama_kos||'Kos Berkat'}</h2><p>{setting.alamat_kos}</p><p>📞 {setting.no_hp_pemilik}</p></div>
        </div>
        <hr />
        <div className="kwitansi-title"><h3>KWITANSI PEMBAYARAN</h3><p>No: <strong>{payment.no_kwitansi}</strong></p></div>
        <table className="kwitansi-table"><tbody>
          <tr><td width="180">Diterima dari</td><td>: <strong>{payment.nama_penghuni}</strong></td></tr>
          <tr><td>Kamar</td><td>: No. {payment.nomor_kamar}</td></tr>
          <tr><td>Pembayaran</td><td>: Sewa bulan <strong>{payment.bulan_bayar} {payment.tahun_bayar}</strong></td></tr>
          <tr><td>Jumlah</td><td>: <strong className="text-green">{formatRupiah(payment.jumlah_bayar)}</strong></td></tr>
          <tr><td>Metode</td><td>: {payment.metode_bayar==='cash'?'Cash':'Transfer'}</td></tr>
          <tr><td>Tanggal</td><td>: {formatTgl(payment.tanggal_bayar)}</td></tr>
          {payment.keterangan && <tr><td>Keterangan</td><td>: {payment.keterangan}</td></tr>}
        </tbody></table>
        <div className="kwitansi-footer"><div className="ttd-section">
          <p>{formatTgl(new Date())}</p><br /><br /><br /><p><strong>( Pemilik Kos )</strong></p>
        </div></div>
      </div>
    </div>
  );
}

export default Kwitansi;