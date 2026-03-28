import React, { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '../App';

export default function ContentBlocks() {
  const { actionTrigger, showToast } = useContext(AppContext);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newBlock, setNewBlock] = useState({ title: '', description: '', image: null, imagePreview: null });
  const [deleteData, setDeleteData] = useState(null);
  const [viewBlock, setViewBlock] = useState(null);
  const fileInputRef = useRef();
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setBlocks([
        {
          id: 1,
          title: 'Notre Mission',
          description: 'TransGlobal s\'engage à fournir des solutions de transport et de logistique de qualité supérieure, garantissant la satisfaction totale de nos clients à travers le monde.',
          image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=360&fit=crop',
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          title: 'Services Premium',
          description: 'Découvrez notre gamme complète de services premium incluant le déménagement international, le stockage sécurisé et la gestion logistique personnalisée.',
          image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&h=360&fit=crop',
          createdAt: '2024-02-20'
        },
        {
          id: 3,
          title: 'Engagement Environnemental',
          description: 'Notre flotte de véhicules écologiques et nos pratiques durables contribuent activement à la préservation de l\'environnement tout en maintenant un service de haute qualité.',
          image: null,
          createdAt: '2024-03-10'
        }
      ]);
      setLoading(false);
    }, 700);
  }, []);

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
      title: block.title,
      description: block.description,
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

  const saveBlock = () => {
    if (!newBlock.title.trim()) {
      showToast('Le titre est requis.', false);
      return;
    }
    if (!newBlock.description.trim()) {
      showToast('La description est requise.', false);
      return;
    }

    const imageUrl = newBlock.imagePreview || null;

    if (editId) {
      setBlocks(blocks.map(b =>
        b.id === editId
          ? { ...b, title: newBlock.title, description: newBlock.description, image: imageUrl }
          : b
      ));
      showToast('Bloc de contenu mis à jour !');
    } else {
      setBlocks([...blocks, {
        id: Date.now(),
        title: newBlock.title,
        description: newBlock.description,
        image: imageUrl,
        createdAt: new Date().toISOString().split('T')[0]
      }]);
      showToast('Bloc de contenu créé !');
    }
    setModalOpen(false);
    setEditId(null);
  };

  const handleDelete = () => {
    if (deleteData) {
      setBlocks(blocks.filter(b => b.id !== deleteData.id));
      showToast('Bloc supprimé avec succès.');
      setDeleteData(null);
    }
  };

  const formatDate = (dateStr) => {
    const opts = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('fr-FR', opts);
  };

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
          <div className="stat-v">{loading ? <div className="skeleton" style={{width:'40px'}}></div> : blocks.filter(b => b.image).length}</div>
        </div>
        <div className="stat-c">
          <div className="stat-l">Sans Image</div>
          <div className="stat-v">{loading ? <div className="skeleton" style={{width:'40px'}}></div> : blocks.filter(b => !b.image).length}</div>
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
                {b.image ? (
                  <img className="cb-img" src={b.image} alt={b.title} onError={(e) => { e.target.style.display = 'none'; }} />
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
                  <button className="btn btn-sm btn-d" onClick={() => setDeleteData({id: b.id, label: b.title})} style={{background: 'rgba(248,113,113,0.2)', borderColor: 'transparent', color: '#fff', backdropFilter: 'blur(4px)'}}>
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="1.8"/><path d="M19 6l-1 14H6L5 6M9 6V4h6v2" stroke="currentColor" strokeWidth="1.8"/></svg>
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="cb-body">
                <div className="cb-title">{b.title}</div>
                <div className="cb-desc">{b.description}</div>
              </div>

              {/* Footer */}
              <div className="cb-footer">
                <div className="cb-date">
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  {formatDate(b.createdAt)}
                </div>
                <span className="badge bp" style={{fontSize: '10px'}}>
                  {b.image ? '🖼 Image' : '📝 Texte'}
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
              {viewBlock.image && (
                <div className="img-preview-wrap" style={{marginBottom: '20px', height: '240px'}}>
                  <img src={viewBlock.image} alt={viewBlock.title} />
                </div>
              )}
              <div className="fg" style={{marginBottom: '16px'}}>
                <label>Titre</label>
                <input value={viewBlock.title} readOnly style={{opacity: 0.8}} />
              </div>
              <div className="fg" style={{marginBottom: '16px'}}>
                <label>Description</label>
                <textarea value={viewBlock.description} readOnly style={{opacity: 0.8, minHeight: '100px'}}></textarea>
              </div>
              <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                <span className="badge bb">ID: {viewBlock.id}</span>
                <span className="badge bp">{viewBlock.image ? 'Avec image' : 'Sans image'}</span>
                <span className="badge bg">Créé le {formatDate(viewBlock.createdAt)}</span>
              </div>
              <div style={{marginTop: '18px', paddingTop: '18px', borderTop: '1px solid var(--bdr)', display: 'flex', justifyContent: 'flex-end', gap: '8px'}}>
                <button className="btn btn-sm" onClick={() => { setViewBlock(null); openEdit(viewBlock); }}>Modifier</button>
                <button className="btn btn-sm btn-d" onClick={() => { setViewBlock(null); setDeleteData({id: viewBlock.id, label: viewBlock.title}); }}>Supprimer</button>
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
              <small>PNG, JPG, WebP · Optionnel</small>
            </div>
          )}

          {/* Title Input */}
          <div className="fg" style={{marginBottom: '16px'}}>
            <label>Titre du bloc <code className="f">title</code></label>
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
            <button className="btn" onClick={() => { setModalOpen(false); setEditId(null); }}>Annuler</button>
            <button className="btn btn-p" onClick={saveBlock}>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.8"/><polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="1.8"/></svg>
              {editId ? 'Mettre à jour' : 'Créer le Bloc'}
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
