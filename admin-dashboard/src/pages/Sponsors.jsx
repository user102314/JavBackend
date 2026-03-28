import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppContext } from '../App';

export default function Sponsors() {
  const { showToast } = useContext(AppContext);
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef();

  const [deleteData, setDeleteData] = useState(null); 
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setSponsors([
        { id: 1, image: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&h=150&fit=crop' },
        { id: 2, image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=300&h=150&fit=crop' }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const handleDelete = () => {
    if (deleteData) {
      setSponsors(sponsors.filter(s => s.id !== deleteData.id));
      showToast(`Sponsor supprimé.`);
      setDeleteData(null);
    }
  };

  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        showToast("Format d'image invalide", false); return;
    }
    const fakeUrl = URL.createObjectURL(file);
    setSponsors([...sponsors, { id: Date.now(), image: fakeUrl }]);
    showToast('Nouveau logo sponsor ajouté !');
  };

  const handleUploadClick = (e) => {
    const f = e.target.files[0]; 
    processFile(f);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) processFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setDragOver(false); };

  return (
    <>
      <div className="card">
        <div className="card-hdr" style={{marginBottom: 0}}>
          <div>
            <div className="card-title">Sponsors & Partenaires</div>
            <div className="card-sub">Gérez les logos de vos partenaires et sponsors</div>
          </div>
        </div>
        
        <div 
          className={`uz ${dragOver ? 'drag-over' : ''}`} 
          style={{marginTop: '20px'}} 
          onClick={() => fileInputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input type="file" ref={fileInputRef} accept="image/*" style={{display:'none'}} onChange={handleUploadClick} />
          {dragOver ? (
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" style={{margin:'0 auto',display:'block',opacity:.8, color:'var(--amber)'}}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M12 3v12M16 7l-4-4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          ) : (
            <svg width="38" height="38" fill="none" viewBox="0 0 24 24" style={{margin:'0 auto',display:'block',opacity:.3}}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          )}
          <p>{dragOver ? 'Relâchez pour uploader...' : 'Cliquez ou Glissez un logo sponsor ici'}</p>
          <small>Formats recommandés : PNG, JPG, SVG</small>
        </div>
      </div>

      <div className="sg">
        {loading ? [...Array(4)].map((_, i) => (
           <div className="sc" key={i}><div className="skeleton" style={{width:'100%', height:'100%', borderRadius:0}}></div></div>
        )) : sponsors.length === 0 ? (
          <div className="empty" style={{gridColumn:'1/-1'}}>
             <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.5"/></svg>
             <p>Aucun partenaire affiché dans la galerie.</p>
             <button className="btn btn-sm" onClick={() => fileInputRef.current.click()} style={{marginTop:'8px'}}>Uploader mon premier logo</button>
          </div>
        ) : (
          sponsors.map(s => (
            <div className="sc" key={s.id}>
              {s.image ? (
                <img className="si" src={s.image} alt="sponsor" onError={(e) => e.target.style.display='none'} />
              ) : (
                 <div className="si" style={{display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Syne, sans-serif',fontSize:'11px',fontWeight:700,color:'var(--txt3)'}}>ID {s.id}</div>
              )}
              <div className="so">
                <button className="btn btn-d btn-sm" onClick={() => setDeleteData({id: s.id, label: `Sponsor #${s.id}`})}>Supprimer</button>
              </div>
              <div className="sl">{s.image || `Sponsor #${s.id}`}</div>
            </div>
          ))
        )}
      </div>

      <div className={`mo ${deleteData ? 'open' : ''}`}>
        <div className="md cmw">
          <div className="ci"><svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
          <div className="mt" style={{marginBottom:'8px'}}>Confirmer</div>
          <div className="ct">L'image du "{deleteData?.label}" sera supprimée définitivement.</div>
          <div style={{display:'flex',gap:'9px',justifyContent:'center'}}>
            <button className="btn" onClick={() => setDeleteData(null)}>Annuler</button>
            <button className="btn btn-d" onClick={handleDelete}>Supprimer</button>
          </div>
        </div>
      </div>
    </>
  );
}
