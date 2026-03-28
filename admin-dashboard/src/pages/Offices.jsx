import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';

export default function Offices() {
  const { actionTrigger, showToast } = useContext(AppContext);
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editOId, setEditOId] = useState(null);
  const [officeName, setOfficeName] = useState('');
  
  const [deleteData, setDeleteData] = useState(null); 
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setOffices([ { id: 1, officeName: 'Agence Paris' }, { id: 2, officeName: 'Agence Lyon' } ]);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    if (actionTrigger?.action === 'new-office') {
      setEditOId(null); setOfficeName(''); setModalOpen(true);
    }
  }, [actionTrigger]);

  const openEdit = (id, nm) => {
    setEditOId(id); setOfficeName(nm); setModalOpen(true);
  };

  const saveOffice = () => {
    if (!officeName.trim()) { showToast('Nom requis.', false); return; }
    if (editOId) {
      setOffices(offices.map(o => o.id === editOId ? { ...o, officeName } : o));
      showToast('Agence mise à jour !');
    } else {
      setOffices([...offices, { id: Date.now(), officeName }]);
      showToast('Agence créée !');
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteConfirmText !== deleteData.label) {
      showToast('Texte de confirmation incorrect.', false); return;
    }
    setOffices(offices.filter(o => o.id !== deleteData.id));
    showToast(`Agence supprimée.`);
    setDeleteData(null); setDeleteConfirmText('');
  };

  const triggerDeleteModal = (o) => {
    setDeleteData({id: o.id, label: o.officeName});
    setDeleteConfirmText('');
  };

  return (
    <>
      <div className="og">
        {loading ? [...Array(4)].map((_, i) => (
          <div className="oc" key={i}>
             <div className="skeleton" style={{width: '36px', height: '36px', borderRadius: '9px', marginBottom: '8px'}}></div>
             <div className="skeleton" style={{width: '120px', marginBottom: '14px'}}></div>
             <div className="skeleton" style={{width: '100%', height: '30px', borderRadius: '6px'}}></div>
          </div>
        )) : offices.length === 0 ? (
          <div className="empty" style={{gridColumn:'1/-1'}}>
            <svg width="34" height="34" fill="none" viewBox="0 0 24 24"><path d="M3 21h18M9 21V9l6-6 6 6v12" stroke="currentColor" strokeWidth="1.5"/></svg>
            <p>Il n'y a actuellement aucune agence enregistrée.</p>
            <button className="btn btn-p" onClick={() => { setEditOId(null); setOfficeName(''); setModalOpen(true); }} style={{marginTop:'12px'}}>Créer ma première Agence</button>
          </div>
        ) : (
          offices.map(o => (
            <div className="oc" key={o.id}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'4px'}}>
                <div className="oc-ico"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M3 21h18M9 21V9l6-6 6 6v12M9 21H3M21 21h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg></div>
                <span className="badge bb" style={{fontSize:'10px'}}>ID {o.id}</span>
              </div>
              <div className="oc-n">{o.officeName}</div>
              <div style={{fontSize:'11px',color:'var(--txt3)',marginBottom:'14px'}}>Information de l'agence affiliée</div>
              <div style={{display:'flex',gap:'6px'}}>
                <button className="btn btn-sm" style={{flex:1,justifyContent:'center'}} onClick={() => openEdit(o.id, o.officeName)}>Modifier</button>
                <button className="btn btn-sm btn-d" onClick={() => triggerDeleteModal(o)} title="Supprimer">
                  <svg width="11" height="11" fill="none" viewBox="0 0 24 24"><polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="1.8"/><path d="M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.8"/></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={`mo ${modalOpen ? 'open' : ''}`}>
        <div className="md">
          <div className="mh">
            <div className="mt">{editOId ? "Modifier l'Agence" : "Nouvelle Agence"}</div>
            <button className="mc" onClick={() => setModalOpen(false)}>✕</button>
          </div>
          <div className="fg">
            <label>Nom de l'Agence</label>
            <input type="text" value={officeName} onChange={e => setOfficeName(e.target.value)} placeholder="Ex: Agence Sfax" />
          </div>
          <div className="f-acts">
            <button className="btn" onClick={() => setModalOpen(false)}>Annuler</button>
            <button className="btn btn-p" onClick={saveOffice}>Enregistrer</button>
          </div>
        </div>
      </div>

      <div className={`mo ${deleteData ? 'open' : ''}`}>
        <div className="md cmw" style={{width: '420px'}}>
          <div className="ci"><svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
          <div className="mt" style={{marginBottom:'8px'}}>Suppression Critique</div>
          <div className="ct">
             La suppression de <strong>{deleteData?.label}</strong> supprimera tous les éléments attachés. C'est irréversible.<br/><br/>
             Veuillez saisir <strong style={{color: 'var(--err)', userSelect: 'none'}}>{deleteData?.label}</strong> pour confirmer.
          </div>
          <div className="fg" style={{marginBottom: '20px', textAlign: 'left'}}>
             <input type="text" value={deleteConfirmText} onChange={e => setDeleteConfirmText(e.target.value)} placeholder={deleteData?.label} />
          </div>
          <div style={{display:'flex',gap:'9px',justifyContent:'center'}}>
            <button className="btn" onClick={() => setDeleteData(null)}>Annuler</button>
            <button className="btn btn-p" style={{background: 'var(--err)', borderColor: 'var(--err)'}} onClick={handleDelete} disabled={deleteConfirmText !== deleteData?.label}>Supprimer définitivement</button>
          </div>
        </div>
      </div>
    </>
  );
}
