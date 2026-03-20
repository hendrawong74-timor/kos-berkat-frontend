import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import API from '../config';

function KeteranganPenghuni({ penghuni }) {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  const fetchNotes = useCallback(async () => {
    if (!penghuni) return;
    try {
      const res = await axios.get(`${API}/api/keterangan/penghuni/${penghuni._id}`);
      setNotes(res.data);
    } catch (err) { console.error('Error:', err); }
  }, [penghuni]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const handleAdd = async () => {
    if (!newNote.trim()) return alert('Isi keterangan dulu!');
    try {
      await axios.post(`${API}/api/keterangan`, {
        penghuni_id: penghuni._id, nama_penghuni: penghuni.nama_lengkap,
        nomor_kamar: penghuni.nomor_kamar, isi_keterangan: newNote
      });
      setNewNote(''); fetchNotes();
    } catch (err) { alert('❌ Gagal menyimpan'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus keterangan ini?')) {
      try { await axios.delete(`${API}/api/keterangan/${id}`); fetchNotes(); }
      catch (err) { alert('❌ Gagal'); }
    }
  };

  const formatTgl = (d) => new Date(d).toLocaleDateString('id-ID',
    {day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});

  return (
    <div className="keterangan-section">
      <h3>📝 Keterangan - {penghuni.nama_lengkap}</h3>
      <div className="keterangan-input">
        <textarea value={newNote} onChange={(e)=>setNewNote(e.target.value)}
          placeholder="Tulis keterangan..." rows="3" />
        <button className="btn btn-primary" onClick={handleAdd}>➕ Tambah</button>
      </div>
      <div className="keterangan-list">
        {notes.length === 0 ? <p className="empty-text">Belum ada keterangan</p> :
          notes.map(note => (
            <div key={note._id} className="keterangan-item">
              <div className="keterangan-content">
                <p>{note.isi_keterangan}</p>
                <small className="keterangan-date">{formatTgl(note.tanggal)}</small>
              </div>
              <button className="btn btn-danger btn-sm" onClick={()=>handleDelete(note._id)}>🗑️</button>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default KeteranganPenghuni;