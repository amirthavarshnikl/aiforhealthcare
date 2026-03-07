import React from 'react';

const Breadcrumb = ({ items }) => {
  return (
    <nav style={{ marginBottom: '24px' }}>
      <ol
        style={{
          display: 'flex',
          alignItems: 'center',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {items.map((item, index) => (
          <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
            {index > 0 && (
              <span
                style={{
                  margin: '0 12px',
                  color: '#BDCBB7',
                  fontSize: '16px',
                }}
              >
                /
              </span>
            )}
            {item.active ? (
              <span
                style={{
                  color: '#3D5152',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                {item.label}
              </span>
            ) : (
              <a
                href={item.link || '#'}
                style={{
                  color: '#89BE4D',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.target.style.color = '#2c3c3d')}
                onMouseLeave={(e) => (e.target.style.color = '#89BE4D')}
              >
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
