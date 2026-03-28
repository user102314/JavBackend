import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AppContext } from '../App';

const INFORMATION_ID = 1;

export default function GeneralInfo() {
  const { showToast, baseUrl } = useContext(AppContext);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadInfo = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const url = `${baseUrl.replace(/\/$/, '')}/informations/${INFORMATION_ID}`;
    try {
      const res = await fetch(url);
      if (res.status === 404) {
        setLoadError(`Aucune information avec l'id ${INFORMATION_ID}.`);
        setInfo(null);
        showToast(`Information #${INFORMATION_ID} introuvable.`, false);
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setInfo({
        id: data.id,
        moveProfetionelle: data.moveProfetionelle ?? '',
        storageSolution: data.storageSolution ?? '',
        yearsExperience: data.yearsExperience ?? '',
        phone1: data.phone1 ?? '',
        phone2: data.phone2 ?? '',
        email: data.email ?? '',
      });
    } catch (e) {
      setLoadError(e.message || 'Erreur réseau');
      setInfo(null);
      showToast(`Chargement impossible : ${e.message || 'erreur'}`, false);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- showToast non stable
  }, [baseUrl]);

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  const saveInfo = async () => {
    if (!info) return;
    setSaving(true);
    try {
      const url = `${baseUrl.replace(/\/$/, '')}/informations/${INFORMATION_ID}`;
      const years =
        info.yearsExperience === '' || info.yearsExperience === null || info.yearsExperience === undefined
          ? null
          : Number(info.yearsExperience);
      const body = {
        id: info.id,
        moveProfetionelle: info.moveProfetionelle,
        storageSolution: info.storageSolution,
        yearsExperience: Number.isFinite(years) ? years : null,
        phone1: info.phone1,
        phone2: info.phone2,
        email: info.email,
      };
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated = await res.json();
      setInfo({
        id: updated.id,
        moveProfetionelle: updated.moveProfetionelle ?? '',
        storageSolution: updated.storageSolution ?? '',
        yearsExperience: updated.yearsExperience ?? '',
        phone1: updated.phone1 ?? '',
        phone2: updated.phone2 ?? '',
        email: updated.email ?? '',
      });
      showToast('Informations enregistrées !');
    } catch (e) {
      showToast(`Enregistrement impossible : ${e.message || 'erreur'}`, false);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({
      ...prev,
      [name]: name === 'yearsExperience' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  if (loading || (!info && !loadError)) {
    return (
      <div className="card">
        <div className="card-hdr">
          <div className="skeleton" style={{width: '200px', height: '24px'}}></div>
          <div className="skeleton" style={{width: '90px', height: '34px'}}></div>
        </div>
        <div className="fg2">
          <div className="skeleton" style={{width: '100%', height: '60px'}}></div>
          <div className="skeleton" style={{width: '100%', height: '60px'}}></div>
          <div className="skeleton" style={{width: '100%', height: '60px'}}></div>
        </div>
      </div>
    );
  }

  if (loadError && !info) {
    return (
      <div className="card">
        <div className="card-hdr">
          <div>
            <div className="card-title">Informations Générales</div>
            <div className="card-sub">Fiche #{INFORMATION_ID}</div>
          </div>
          <button type="button" className="btn btn-sm" onClick={() => loadInfo()}>Réessayer</button>
        </div>
        <div className="empty" style={{ padding: '24px' }}>
          <p>{loadError}</p>
          <p style={{ fontSize: '13px', color: 'var(--txt3)', marginTop: '8px' }}>GET {baseUrl}/informations/{INFORMATION_ID}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-hdr">
        <div>
          <div className="card-title">Informations Générales</div>
          <div className="card-sub">Paramètres et informations clés de l'entreprise (fiche #{info.id})</div>
        </div>
        <button type="button" className="btn btn-p" onClick={saveInfo} disabled={saving}>
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.8"/><polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="1.8"/><polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="1.8"/></svg>
          {saving ? '…' : 'Enregistrer'}
        </button>
      </div>

      <div className="fg2">
        <div className="fg">
          <label>Déménagement Professionnel</label>
          <input type="text" name="moveProfetionelle" value={info.moveProfetionelle} onChange={handleChange} placeholder="Ex: Déménagement d'entreprise clé en main" />
        </div>
        <div className="fg">
          <label>Solution de Stockage</label>
          <input type="text" name="storageSolution" value={info.storageSolution} onChange={handleChange} placeholder="Ex: Entrepôts sécurisés 24h/24" />
        </div>
        <div className="fg">
          <label>Années d'Expérience</label>
          <input type="number" name="yearsExperience" value={info.yearsExperience} onChange={handleChange} placeholder="25" min="0" />
        </div>
      </div>

      <div className="isec">
        <div className="isec-t">Coordonnées</div>
        <div className="fg2">
          <div className="fg">
            <label>Téléphone 1</label>
            <input type="text" name="phone1" value={info.phone1} onChange={handleChange} placeholder="+216 71 000 000" />
          </div>
          <div className="fg">
            <label>Téléphone 2</label>
            <input type="text" name="phone2" value={info.phone2} onChange={handleChange} placeholder="+216 74 000 000" />
          </div>
          <div className="fg fc">
            <label>Email</label>
            <input type="email" name="email" value={info.email} onChange={handleChange} placeholder="contact@company.com" />
          </div>
        </div>
      </div>


    </div>
  );
}
