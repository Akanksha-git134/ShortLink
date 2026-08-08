import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import UrlForm from "../components/UrlForm.jsx";
import ResultCard from "../components/ResultCard.jsx";
import StatsPanel from "../components/StatsPanel.jsx";
import LinkHistory from "../components/LinkHistory.jsx";
import ToastStack from "../components/Toast.jsx";
import Footer from "../components/Footer.jsx";
import { shortenUrl, fetchLinks, deleteLink } from "../services/api.js";
import { useToasts } from "../hooks/useToasts.js";
import { buildShortUrl } from "../utils/validators.js";

/**
 * WHY Home owns the links array and talks to services/api.js directly:
 * this is the one page in the app, so there's no benefit to a global
 * state library (Redux/Context) for data that only one component tree
 * actually needs. That would be exactly the over-engineering the brief
 * warned against.
 */
function Home() {
  const [links, setLinks] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [lastCreated, setLastCreated] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const { toasts, push, dismiss } = useToasts();

  useEffect(() => {
    let isMounted = true;

    async function loadLinks() {
      try {
        const data = await fetchLinks();
        if (isMounted) setLinks(data);
      } catch (err) {
        if (isMounted) push(err.message, "error");
      } finally {
        if (isMounted) setLoadingHistory(false);
      }
    }

    loadLinks();
    return () => {
      isMounted = false;
    };
  }, [push]);

  const handleShorten = async (url) => {
    const created = await shortenUrl(url);
    const newLink = {
      shortCode: created.shortCode,
      originalUrl: url,
      clickCount: 0,
      createdAt: new Date().toISOString(),
    };
    setLinks((prev) => [newLink, ...prev]);
    setLastCreated(newLink);
    push("Short link created.");
  };

  const handleDelete = async (shortCode) => {
    try {
      await deleteLink(shortCode);
      setLinks((prev) => prev.filter((l) => l.shortCode !== shortCode));
      setLastCreated((prev) => (prev?.shortCode === shortCode ? null : prev));
      push("Link deleted.");
    } catch (err) {
      push(err.message, "error");
    }
  };

  const handleCopy = async (shortCode) => {
    try {
      await navigator.clipboard.writeText(buildShortUrl(shortCode));
      setCopiedCode(shortCode);
      push("Link copied to clipboard.");
      setTimeout(() => setCopiedCode((c) => (c === shortCode ? null : c)), 1800);
    } catch {
      push("Couldn't copy — select and copy manually.", "error");
    }
  };

  return (
    <div className="app">
      <Navbar />

      <main id="top">
        <section className="hero">
          <div className="container">
            <Hero />
            <div className="shorten-card">
              <UrlForm onShorten={handleShorten} />
              <ResultCard link={lastCreated} onCopy={handleCopy} copiedCode={copiedCode} />
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section__head">
              <h2 className="section__title">Statistics</h2>
              <p className="section__desc">A live snapshot of everything shortened so far.</p>
            </div>
            <StatsPanel links={links} />
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section__head">
              <h2 className="section__title">History</h2>
              <p className="section__desc">Every link generated, newest first.</p>
            </div>
            <LinkHistory
              links={links}
              loading={loadingHistory}
              onCopy={handleCopy}
              copiedCode={copiedCode}
              onDelete={handleDelete}
            />
          </div>
        </section>
      </main>

      <Footer />
      <ToastStack toasts={toasts} dismiss={dismiss} />
    </div>
  );
}

export default Home;