const AmritaLogo = ({ size = 'md', light = false }) => {
  const sizes = {
    sm: { text: '15px', sub: '6px' },
    md: { text: '22px', sub: '7.5px' },
    lg: { text: '30px', sub: '10px' },
  };

  return (
    <div className="flex flex-col items-start leading-none">
      <span
        style={{
          fontFamily: "'Cinzel', serif",
          fontWeight: 900,
          fontSize: sizes[size].text,
          letterSpacing: '0.15em',
          color: light ? '#ffffff' : '#9B1B4B',
          lineHeight: 1,
        }}
      >
        AMRITA
      </span>
      <span
        style={{
          fontFamily: "'Cinzel', serif",
          fontWeight: 400,
          fontSize: sizes[size].sub,
          letterSpacing: '0.20em',
          color: light ? 'rgba(255,255,255,0.80)' : '#9B1B4B',
          lineHeight: 1,
          marginTop: '4px',
        }}
      >
        VISHWA VIDYAPEETHAM
      </span>
    </div>
  );
};

export default AmritaLogo;