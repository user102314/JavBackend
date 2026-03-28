import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';

export default function GeneralInfo() {
  const { showToast } = useContext(AppContext);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    // Artificial 0.6s delay to show skeleton
    setTimeout(() => {
      setInfo({
        moveProfetionelle: 'Déménagement pour professionnels et particuliers',
        storageSolution: 'Entrepôts sécurisés 24/7',
        yearsExperience: 15,
        phone1: '+33 1 23 45 67 89',
        phone2: '+33 6 12 34 56 78',
        email: 'contact@transglobal.com'
      });
    }, 600);
  }, []);

  const saveInfo = () => {
    showToast('Informations enregistrées !');
  };

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  if (!info) {
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

  return (
    <div className="card">
      <div className="card-hdr">
        <div>
          <div className="card-title">Informations Générales</div>
          <div className="card-sub">Paramètres et informations clés de l'entreprise</div>
        </div>
        <button className="btn btn-p" onClick={saveInfo}>
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.8"/><polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="1.8"/><polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="1.8"/></svg>
          Enregistrer
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
