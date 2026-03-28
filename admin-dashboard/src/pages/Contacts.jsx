import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AppContext } from '../App';

function formatContactDate(value) {
  if (value == null) return '—';
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.length >= 3) {
    const [y, m, d] = value;
    return `${String(y)}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  return String(value);
}

export default function Contacts() {
  const { showToast, baseUrl } = useContext(AppContext);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewContact, setViewContact] = useState(null);
  const [deleteData, setDeleteData] = useState(null);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const url = `${baseUrl.replace(/\/$/, '')}/contacts`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setContacts(
        list.map((c) => ({
          ...c,
          date: formatContactDate(c.date),
        }))
      );
    } catch (e) {
      setLoadError(e.message || 'Erreur réseau');
      setContacts([]);
      showToast(`Impossible de charger les contacts : ${e.message || 'erreur'}`, false);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- showToast stable for UX
  }, [baseUrl]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const handleDelete = async () => {
    if (!deleteData) return;
    try {
      const res = await fetch(`${baseUrl.replace(/\/$/, '')}/contacts/${deleteData.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showToast(`Contact "${deleteData.label}" supprimé.`);
      setDeleteData(null);
      setViewContact(null);
      await loadContacts();
    } catch (e) {
      showToast(`Suppression impossible : ${e.message || 'erreur'}`, false);
    }
  };

  const filteredContacts = contacts.filter(c => 
    `${c.firstName} ${c.lastName} ${c.email} ${c.originCity} ${c.distnationCity}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="stats-row">
        <div className="stat-c">
          <div className="stat-l">Total Contacts</div>
          <div className="stat-v">{loading ? <div className="skeleton" style={{width:'50px'}}></div> : contacts.length}</div>
        </div>
        <div className="stat-c">
          <div className="stat-l">Ce Mois</div>
          <div className="stat-v">{loading ? <div className="skeleton" style={{width:'50px'}}></div> : contacts.length}</div>
        </div>
        <div className="stat-c">
          <div className="stat-l">Villes Uniques</div>
          <div className="stat-v">{loading ? <div className="skeleton" style={{width:'50px'}}></div> : new Set(contacts.map(c => c.originCity)).size}</div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-hdr">
          <div>
            <div className="card-title">Liste des Contacts</div>
            <div className="card-sub">Liste et gestion des prises de contact</div>
          </div>
          <button className="btn btn-sm" onClick={() => { loadContacts().then(() => showToast('Contacts rafraîchis !')); }} disabled={loading}>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><polyline points="23,4 23,10 17,10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            Rafraîchir
          </button>
        </div>
        
        {loadError && (
          <div className="empty" style={{ margin: '0 0 12px', padding: '12px', background: 'var(--bg4)', borderRadius: '8px' }}>
            <p style={{ margin: 0 }}>API : {baseUrl}/contacts — {loadError}</p>
          </div>
        )}

        <div className="srch">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8"/><path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          <input type="text" placeholder="Rechercher par nom, email, ville…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        
        <div className="tw">
          <table>
            <thead><tr>
              <th>Nom</th><th>Email</th><th>Téléphone</th>
              <th>Trajet</th>
              <th>Date</th><th>Description</th><th width="80"></th>
            </tr></thead>
            <tbody>
              {loading ? [...Array(3)].map((_, i) => (
                <tr key={i}>
                  <td><div className="skeleton" style={{width:'100px'}}></div></td>
                  <td><div className="skeleton" style={{width:'140px'}}></div></td>
                  <td><div className="skeleton" style={{width:'100px'}}></div></td>
                  <td><div className="skeleton" style={{width:'100px'}}></div></td>
                  <td><div className="skeleton" style={{width:'80px'}}></div></td>
                  <td><div className="skeleton" style={{width:'150px'}}></div></td>
                  <td></td>
                </tr>
              )) : filteredContacts.length === 0 ? (
                <tr><td colSpan="7"><div className="empty"><p>Aucun contact trouvé.</p></div></td></tr>
              ) : filteredContacts.map(c => (
                <tr key={c.id}>
                  <td><strong>{c.firstName} {c.lastName}</strong></td>
                  <td className="tdm">{c.email}</td>
                  <td className="tdm">{c.phone}</td>
                  <td><div style={{display:'flex', gap:'6px', flexWrap:'wrap', alignItems:'center'}}>
                    <span className="badge bb">{c.originCity || '—'}</span> ➔ <span className="badge ba">{c.distnationCity || '—'}</span>
                  </div></td>
                  <td className="tdm">{c.date}</td>
                  <td className="tdm" title={c.description} style={{maxWidth:'160px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis', cursor:'help'}}>{c.description || '—'}</td>
                  <td>
                    <div style={{display:'flex',gap:'5px', justifyContent:'flex-end'}}>
                      <button className="btn btn-sm" onClick={() => setViewContact(c)} title="Détail">
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/></svg>
                      </button>
                      <button className="btn btn-sm btn-d" onClick={() => setDeleteData({id: c.id, label: `${c.firstName} ${c.lastName}`})} title="Supprimer">
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M19 6l-1 14H6L5 6M9 6V4h6v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`mo ${viewContact ? 'open' : ''}`}>
        <div className="md" style={{width:'560px'}}>
          <div className="mh">
            <div className="mt">Détail Contact</div>
            <button className="mc" onClick={() => setViewContact(null)}>✕</button>
          </div>
          {viewContact && (
            <>
              <div className="fg2" style={{gap:'14px'}}>
                <div className="fg"><label>Prénom</label><input value={viewContact.firstName} readOnly style={{opacity:.7}} /></div>
                <div className="fg"><label>Nom</label><input value={viewContact.lastName} readOnly style={{opacity:.7}} /></div>
                <div className="fg"><label>Email</label><input value={viewContact.email} readOnly style={{opacity:.7}} /></div>
                <div className="fg"><label>Téléphone</label><input value={viewContact.phone} readOnly style={{opacity:.7}} /></div>
                <div className="fg"><label>Ville Départ</label><input value={viewContact.originCity} readOnly style={{opacity:.7}} /></div>
                <div className="fg"><label>Ville Arrivée</label><input value={viewContact.distnationCity} readOnly style={{opacity:.7}} /></div>
                <div className="fg"><label>Date</label><input value={viewContact.date} readOnly style={{opacity:.7}} /></div>
                <div className="fg fc"><label>Description</label><textarea readOnly style={{opacity:.7}} value={viewContact.description}></textarea></div>
              </div>
              <div style={{marginTop:'16px',paddingTop:'16px',borderTop:'1px solid var(--bdr)',display:'flex',justifyContent:'flex-end',gap:'8px'}}>
                <button className="btn btn-d btn-sm" onClick={() => setDeleteData({id: viewContact.id, label: `${viewContact.firstName} ${viewContact.lastName}`})}>Supprimer ce contact</button>
                <button className="btn btn-sm" onClick={() => setViewContact(null)}>Fermer</button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className={`mo ${deleteData ? 'open' : ''}`}>
        <div className="md cmw">
          <div className="ci">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="mt" style={{marginBottom:'8px'}}>Confirmer</div>
          <div className="ct">"{deleteData?.label}" sera supprimé définitivement.</div>
          <div style={{display:'flex',gap:'10px',justifyContent:'center'}}>
            <button className="btn" onClick={() => setDeleteData(null)}>Annuler</button>
            <button className="btn btn-d" onClick={handleDelete}>Supprimer</button>
          </div>
        </div>
      </div>
    </>
  );
}
