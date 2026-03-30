import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import { AppContext } from '../App';

/** Même fiche « Informations générales » : les sponsors y sont rattachés côté API. */
const SPONSOR_INFORMATION_ID = 1;

function isLikelyValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const u = url.trim();
  // Pour les buckets privés on reçoit des URLs signées (http/https).
  return u.startsWith('http');
}

export default function Sponsors() {
  const { showToast, baseUrl } = useContext(AppContext);
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const [deleteData, setDeleteData] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  /** IDs dont le <img> a déclenché onError — jamais de manipulation DOM hors React. */
  const [brokenImageIds, setBrokenImageIds] = useState(() => new Set());

  const root = useCallback(() => baseUrl.replace(/\/$/, ''), [baseUrl]);

  const loadSponsors = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch(`${root()}/sponsors`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setSponsors(Array.isArray(data) ? data : []);
      setBrokenImageIds(new Set());
    } catch (e) {
      setLoadError(e.message || 'Erreur réseau');
      setSponsors([]);
      showToast(`Chargement des sponsors impossible : ${e.message || 'erreur'}`, false);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root]);

  useEffect(() => {
    loadSponsors();
  }, [loadSponsors]);

  const uploadSponsorFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast("Format d'image invalide", false);
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(
        `${root()}/informations/${SPONSOR_INFORMATION_ID}/sponsors/upload`,
        { method: 'POST', body: fd }
      );
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        let detail = text || `HTTP ${res.status}`;
        try {
          const j = JSON.parse(text);
          if (j.message) detail = j.message;
        } catch {
          /* pas du JSON */
        }
        throw new Error(detail);
      }
      showToast('Logo sponsor ajouté !');
      await loadSponsors();
    } catch (e) {
      showToast(`Upload impossible : ${e.message || 'erreur'}`, false);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteData) return;
    try {
      const res = await fetch(`${root()}/sponsors/${deleteData.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showToast('Sponsor supprimé.');
      setDeleteData(null);
      await loadSponsors();
    } catch (e) {
      showToast(`Suppression impossible : ${e.message || 'erreur'}`, false);
    }
  };

  const processFile = (file) => {
    uploadSponsorFile(file);
  };

  const handleUploadClick = (e) => {
    const f = e.target.files[0];
    processFile(f);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (uploading) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) processFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <>
      <div className="card">
        <div className="card-hdr" style={{ marginBottom: 0 }}>
          <div>
            <div className="card-title">Sponsors & Partenaires</div>
            <div className="card-sub">Gérez les logos de vos partenaires et sponsors</div>
          </div>
        </div>

        {loadError && (
          <div className="empty" style={{ marginTop: '16px', padding: '12px', background: 'var(--bg4)', borderRadius: '8px' }}>
            <p style={{ margin: 0 }}>GET {root()}/sponsors — {loadError}</p>
          </div>
        )}

        <div
          className={`uz ${dragOver ? 'drag-over' : ''}`}
          style={{ marginTop: '20px', opacity: uploading ? 0.7 : 1, pointerEvents: uploading ? 'none' : 'auto' }}
          onClick={() => !uploading && fileInputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleUploadClick}
            disabled={uploading}
          />
          {dragOver ? (
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" style={{ margin: '0 auto', display: 'block', opacity: 0.8, color: 'var(--amber)' }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M12 3v12M16 7l-4-4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          ) : (
            <svg width="38" height="38" fill="none" viewBox="0 0 24 24" style={{ margin: '0 auto', display: 'block', opacity: 0.3 }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          )}
          <p>{uploading ? 'Envoi en cours…' : dragOver ? 'Relâchez pour uploader...' : 'Cliquez ou Glissez un logo sponsor ici'}</p>
          <small>Formats recommandés : PNG, JPG, SVG — liaison fiche information #{SPONSOR_INFORMATION_ID}</small>
        </div>
      </div>

      <div className="sg">
        {loading ? [...Array(4)].map((_, i) => (
          <div className="sc" key={i}><div className="skeleton" style={{ width: '100%', height: '100%', borderRadius: 0 }}></div></div>
        )) : sponsors.length === 0 ? (
          <div className="empty" style={{ gridColumn: '1/-1' }}>
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.5" /></svg>
            <p>Aucun partenaire affiché dans la galerie.</p>
            <button type="button" className="btn btn-sm" onClick={() => fileInputRef.current.click()} style={{ marginTop: '8px' }} disabled={uploading}>
              Uploader mon premier logo
            </button>
          </div>
        ) : (
          sponsors.map((s) => {
            const urlOk = isLikelyValidImageUrl(s.image);
            const imgBroken = brokenImageIds.has(s.id);
            return (
              <div className="sc" key={s.id}>
                {s.image && urlOk && !imgBroken ? (
                  <img
                    className="si"
                    src={s.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onError={() => {
                      setBrokenImageIds((prev) => new Set(prev).add(s.id));
                    }}
                  />
                ) : s.image && urlOk && imgBroken ? (
                  <div
                    className="si"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      padding: '12px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--txt3)',
                    }}
                  >
                    Image introuvable (URL invalide ou fichier supprimé)
                  </div>
                ) : s.image && !urlOk ? (
                  <div
                    className="si"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      padding: '12px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--warn)',
                    }}
                    title={s.image}
                  >
                    URL logo tronquée en base — supprimez ce sponsor et téléversez à nouveau (colonne image en TEXT côté API).
                  </div>
                ) : (
                  <div className="si" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontSize: '11px', fontWeight: 700, color: 'var(--txt3)' }}>ID {s.id}</div>
                )}
                <div className="so">
                  <button type="button" className="btn btn-d btn-sm" onClick={() => setDeleteData({ id: s.id, label: `Sponsor #${s.id}` })}>Supprimer</button>
                </div>
                <div className="sl" title={s.image && urlOk ? s.image : undefined}>
                  Logo #{s.id}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className={`mo ${deleteData ? 'open' : ''}`}>
        <div className="md cmw">
          <div className="ci"><svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
          <div className="mt" style={{ marginBottom: '8px' }}>Confirmer</div>
          <div className="ct">L&apos;entrée &quot;{deleteData?.label}&quot; sera supprimée (base + fichier storage si applicable).</div>
          <div style={{ display: 'flex', gap: '9px', justifyContent: 'center' }}>
            <button type="button" className="btn" onClick={() => setDeleteData(null)}>Annuler</button>
            <button type="button" className="btn btn-d" onClick={handleDelete}>Supprimer</button>
          </div>
        </div>
      </div>
    </>
  );
}
