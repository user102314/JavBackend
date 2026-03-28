import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { AppContext } from '../App';

export default function ContentBlocks() {
  const { actionTrigger, showToast, baseUrl } = useContext(AppContext);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newBlock, setNewBlock] = useState({ title: '', description: '', image: null, imagePreview: null });
  const [deleteData, setDeleteData] = useState(null);
  const [viewBlock, setViewBlock] = useState(null);
  const fileInputRef = useRef();
  const [dragOver, setDragOver] = useState(false);

  const root = useCallback(() => baseUrl.replace(/\/$/, ''), [baseUrl]);

  /* ─── Charger tous les blocs depuis l'API ─── */
  const loadBlocks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${root()}/blocks`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setBlocks(Array.isArray(data) ? data : []);
    } catch (e) {
      showToast(`Chargement des blocs impossible : ${e.message || 'erreur'}`, false);
      setBlocks([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root]);

  useEffect(() => {
    loadBlocks();
  }, [loadBlocks]);

  useEffect(() => {
    if (actionTrigger?.action === 'new-block') {
      setEditId(null);
      setNewBlock({ title: '', description: '', image: null, imagePreview: null });
      setModalOpen(true);
    }
  }, [actionTrigger]);

  const openEdit = (block) => {
    setEditId(block.id);
    setNewBlock({
      title: block.titre || block.title || '',
      description: block.description || '',
      image: block.image,
      imagePreview: block.image
    });
    setModalOpen(true);
  };

  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast("Format d'image invalide", false);
      return;
    }
    const url = URL.createObjectURL(file);
    setNewBlock(prev => ({ ...prev, image: file, imagePreview: url }));
  };

  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setNewBlock(prev => ({ ...prev, image: null, imagePreview: null }));
  };

  /* ─── Créer ou mettre à jour un bloc via l'API ─── */
  const saveBlock = async () => {
    if (!newBlock.title.trim()) {
      showToast('Le titre est requis.', false);
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('titre', newBlock.title.trim());
      fd.append('description', newBlock.description || '');

      // Si c'est un vrai fichier (File object), on l'ajoute
      if (newBlock.image instanceof File) {
        fd.append('file', newBlock.image);
      }

      if (editId) {
        /* ─── UPDATE ─── */
        const res = await fetch(`${root()}/blocks/${editId}`, {
          method: 'PUT',
          body: fd,
        });
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(text || `HTTP ${res.status}`);
        }
        showToast('Bloc de contenu mis à jour !');
      } else {
        /* ─── CREATE ─── */
        if (!(newBlock.image instanceof File)) {
          showToast("L'image est requise pour créer un bloc.", false);
          setSaving(false);
          return;
        }
        const res = await fetch(`${root()}/blocks`, {
          method: 'POST',
          body: fd,
        });
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(text || `HTTP ${res.status}`);
        }
        showToast('Bloc de contenu créé !');
      }

      setModalOpen(false);
      setEditId(null);
      await loadBlocks();
    } catch (e) {
      showToast(`Erreur : ${e.message || 'Impossible de sauvegarder'}`, false);
    } finally {
      setSaving(false);
    }
  };

  /* ─── Supprimer un bloc via l'API ─── */
  const handleDelete = async () => {
    if (!deleteData) return;
    try {
      const res = await fetch(`${root()}/blocks/${deleteData.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showToast('Bloc supprimé avec succès.');
      setDeleteData(null);
      await loadBlocks();
    } catch (e) {
      showToast(`Suppression impossible : ${e.message || 'erreur'}`, false);
    }
  };

  /* ─── Helpers ─── */
  const getTitle = (b) => b.titre || b.title || '';
  const getImage = (b) => b.image || null;

  return (
    <>
      {/* Stats header */}
      <div className="stats-row">
        <div className="stat-c">
          <div className="stat-l">Total Blocs</div>
          <div className="stat-v">{loading ? <div className="skeleton" style={{width:'40px'}}></div> : blocks.length}</div>
        </div>
        <div className="stat-c">
          <div className="stat-l">Avec Image</div>
          <div className="stat-v">{loading ? <div className="skeleton" style={{width:'40px'}}></div> : blocks.filter(b => getImage(b)).length}</div>
        </div>
        <div className="stat-c">
          <div className="stat-l">Sans Image</div>
          <div className="stat-v">{loading ? <div className="skeleton" style={{width:'40px'}}></div> : blocks.filter(b => !getImage(b)).length}</div>
        </div>
      </div>

      {/* Blocks grid */}
      <div className="cb-grid">
        {loading ? [...Array(3)].map((_, i) => (
          <div className="cb-card" key={i}>
            <div className="skeleton" style={{width: '100%', height: '180px', borderRadius: 0}}></div>
            <div className="cb-body">
              <div className="skeleton" style={{width: '70%', height: '20px', marginBottom: '12px'}}></div>
              <div className="skeleton" style={{width: '100%', height: '14px', marginBottom: '6px'}}></div>
              <div className="skeleton" style={{width: '85%', height: '14px', marginBottom: '6px'}}></div>
              <div className="skeleton" style={{width: '60%', height: '14px'}}></div>
            </div>
          </div>
        )) : blocks.length === 0 ? (
          <div className="empty" style={{gridColumn:'1/-1'}}>
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.2"/>
              <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="1.2"/>
              <circle cx="8" cy="15" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M14 13h4M14 17h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <p style={{fontWeight: 500, fontSize: '15px', color: 'var(--txt2)'}}>Aucun bloc de contenu</p>
            <p style={{fontSize: '13px'}}>Commencez par créer votre premier bloc avec un titre, une description et une image.</p>
            <button className="btn btn-p" onClick={() => { setEditId(null); setNewBlock({ title: '', description: '', image: null, imagePreview: null }); setModalOpen(true); }} style={{marginTop: '8px'}}>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
              Créer mon premier bloc
            </button>
          </div>
        ) : (
          blocks.map((b, idx) => (
            <div className="cb-card" key={b.id} style={{animationDelay: `${idx * 80}ms`}}>
              {/* Image area */}
              <div className="cb-img-wrap">
                {getImage(b) ? (
                  <img className="cb-img" src={getImage(b)} alt={getTitle(b)} onError={(e) => { e.target.style.display = 'none'; }} />
                ) : (
                  <div className="cb-img-placeholder">
                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                      <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Pas d'image</span>
                  </div>
                )}
                {/* Hover overlay with actions */}
                <div className="cb-overlay">
                  <button className="btn btn-sm" onClick={() => setViewBlock(b)} style={{background: 'rgba(0,0,0,0.6)', borderColor: 'transparent', color: '#fff', backdropFilter: 'blur(4px)'}}>
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/></svg>
                  </button>
                  <button className="btn btn-sm" onClick={() => openEdit(b)} style={{background: 'rgba(0,0,0,0.6)', borderColor: 'transparent', color: '#fff', backdropFilter: 'blur(4px)'}}>
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8"/></svg>
                  </button>
                  <button className="btn btn-sm btn-d" onClick={() => setDeleteData({id: b.id, label: getTitle(b)})} style={{background: 'rgba(248,113,113,0.2)', borderColor: 'transparent', color: '#fff', backdropFilter: 'blur(4px)'}}>
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="1.8"/><path d="M19 6l-1 14H6L5 6M9 6V4h6v2" stroke="currentColor" strokeWidth="1.8"/></svg>
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="cb-body">
                <div className="cb-title">{getTitle(b)}</div>
                <div className="cb-desc">{b.description}</div>
              </div>

              {/* Footer */}
              <div className="cb-footer">
                <span className="badge bb" style={{fontSize: '10px'}}>ID: {b.id}</span>
                <span className="badge bp" style={{fontSize: '10px'}}>
                  {getImage(b) ? '🖼 Image' : '📝 Texte'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Detail Modal */}
      <div className={`mo ${viewBlock ? 'open' : ''}`}>
        <div className="md" style={{width: '600px'}}>
          <div className="mh">
            <div className="mt">Détail du Bloc</div>
            <button className="mc" onClick={() => setViewBlock(null)}>✕</button>
          </div>
          {viewBlock && (
            <>
              {getImage(viewBlock) && (
                <div className="img-preview-wrap" style={{marginBottom: '20px', height: '240px'}}>
                  <img src={getImage(viewBlock)} alt={getTitle(viewBlock)} />
                </div>
              )}
              <div className="fg" style={{marginBottom: '16px'}}>
                <label>Titre</label>
                <input value={getTitle(viewBlock)} readOnly style={{opacity: 0.8}} />
              </div>
              <div className="fg" style={{marginBottom: '16px'}}>
                <label>Description</label>
                <textarea value={viewBlock.description || ''} readOnly style={{opacity: 0.8, minHeight: '100px'}}></textarea>
              </div>
              <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                <span className="badge bb">ID: {viewBlock.id}</span>
                <span className="badge bp">{getImage(viewBlock) ? 'Avec image' : 'Sans image'}</span>
              </div>
              <div style={{marginTop: '18px', paddingTop: '18px', borderTop: '1px solid var(--bdr)', display: 'flex', justifyContent: 'flex-end', gap: '8px'}}>
                <button className="btn btn-sm" onClick={() => { setViewBlock(null); openEdit(viewBlock); }}>Modifier</button>
                <button className="btn btn-sm btn-d" onClick={() => { setViewBlock(null); setDeleteData({id: viewBlock.id, label: getTitle(viewBlock)}); }}>Supprimer</button>
                <button className="btn btn-sm" onClick={() => setViewBlock(null)}>Fermer</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      <div className={`mo ${modalOpen ? 'open' : ''}`}>
        <div className="md" style={{width: '560px'}}>
          <div className="mh">
            <div className="mt">{editId ? 'Modifier le Bloc' : 'Nouveau Bloc de Contenu'}</div>
            <button className="mc" onClick={() => { setModalOpen(false); setEditId(null); }}>✕</button>
          </div>

          {/* Image upload area */}
          {newBlock.imagePreview ? (
            <div className="img-preview-wrap">
              <img src={newBlock.imagePreview} alt="Preview" />
              <button className="img-preview-remove" onClick={removeImage} title="Supprimer l'image">✕</button>
            </div>
          ) : (
            <div
              className={`cb-upload ${dragOver ? 'drag-over' : ''}`}
              style={{marginBottom: '20px'}}
              onClick={() => fileInputRef.current.click()}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
            >
              <input type="file" ref={fileInputRef} accept="image/*" style={{display: 'none'}} onChange={handleFileChange} />
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24" style={{margin: '0 auto', display: 'block', opacity: 0.3, position: 'relative'}}>
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>{dragOver ? 'Relâchez pour uploader...' : 'Cliquez ou glissez une image ici'}</p>
              <small>PNG, JPG, WebP · {editId ? 'Optionnel (garder l\'image actuelle)' : 'Requis'}</small>
            </div>
          )}

          {/* Title Input */}
          <div className="fg" style={{marginBottom: '16px'}}>
            <label>Titre du bloc <code className="f">titre</code></label>
            <input
              type="text"
              value={newBlock.title}
              onChange={e => setNewBlock({...newBlock, title: e.target.value})}
              placeholder="Ex: Notre Mission"
            />
          </div>

          {/* Description Input */}
          <div className="fg">
            <label>Description <code className="f">description</code></label>
            <textarea
              value={newBlock.description}
              onChange={e => setNewBlock({...newBlock, description: e.target.value})}
              placeholder="Décrivez le contenu de ce bloc..."
              style={{minHeight: '120px'}}
            ></textarea>
          </div>

          <div className="f-acts">
            <button className="btn" onClick={() => { setModalOpen(false); setEditId(null); }} disabled={saving}>Annuler</button>
            <button className="btn btn-p" onClick={saveBlock} disabled={saving}>
              {saving ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" style={{animation: 'spin 1s linear infinite'}}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" fill="none" strokeDasharray="31.4 31.4" strokeLinecap="round"/>
                  </svg>
                  Envoi...
                </>
              ) : (
                <>
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.8"/><polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="1.8"/></svg>
                  {editId ? 'Mettre à jour' : 'Créer le Bloc'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div className={`mo ${deleteData ? 'open' : ''}`}>
        <div className="md cmw">
          <div className="ci">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="mt" style={{marginBottom: '8px'}}>Confirmer la suppression</div>
          <div className="ct">
            Le bloc "<strong>{deleteData?.label}</strong>" sera supprimé définitivement.<br/>
            Cette action est irréversible.
          </div>
          <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
            <button className="btn" onClick={() => setDeleteData(null)}>Annuler</button>
            <button className="btn btn-d" onClick={handleDelete}>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="1.8"/><path d="M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.8"/></svg>
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
