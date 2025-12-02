const Footer = () => {
  const styles = {
    footer: {
      backgroundColor: 'var(--bg-primary)',
      borderTop: '1px solid var(--border-color)',
      marginTop: 'auto',
    },
    footerContainer: {
      padding: '2rem 0',
      textAlign: 'center',
      color: 'var(--text-secondary)',
    }
  };

  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.footerContainer}>
        <p>&copy; {new Date().getFullYear()} SkillSwap. All rights reserved.</p>
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
          Skill bartering platform for students and professionals
        </p>
      </div>
    </footer>
  );
};

export default Footer;