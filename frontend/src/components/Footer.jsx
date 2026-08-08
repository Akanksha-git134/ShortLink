function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span>© {new Date().getFullYear()} ShortLink — built as an internship project.</span>
      </div>
    </footer>
  );
}

export default Footer;
