import React from 'react';
import { Users, Building2, Info, Image, LayoutTemplate } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const stats = [
  { title: 'Total Contacts', value: '1,245', icon: <Users size={24} />, route: '/contacts', color: '#8a2be2' },
  { title: 'Active Offices', value: '8', icon: <Building2 size={24} />, route: '/offices', color: '#00d2ff' },
  { title: 'Sponsors', value: '12', icon: <Image size={24} />, route: '/sponsors', color: '#10b981' },
  { title: 'Content Blocks', value: '5', icon: <LayoutTemplate size={24} />, route: '/content-blocks', color: '#ef4444' }
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="page-header">
        <h1 className="title">Overview</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome back, Admin</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className="glass-panel" 
            style={{ 
              cursor: 'pointer', 
              transition: 'transform 0.2s, box-shadow 0.2s', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px' 
            }}
            onClick={() => navigate(stat.route)}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 8px 24px ${stat.color}33`; // 20% opacity
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{stat.title}</span>
              <div style={{ color: stat.color, background: `${stat.color}1A`, padding: '8px', borderRadius: '8px' }}>
                {stat.icon}
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
