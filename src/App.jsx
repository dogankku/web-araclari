import { useMemo, useState } from "react";
import { tools } from "./tools";
import "./style.css";

const categories = ["Tümü", ...Array.from(new Set(tools.map((tool) => tool.category))).sort()];

function normalize(text) {
  return text
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("İ", "i");
}

export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tümü");
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favoriteTools") || "[]");
    } catch {
      return [];
    }
  });

  const filteredTools = useMemo(() => {
    const q = normalize(query.trim());
    return tools.filter((tool) => {
      const matchesCategory = category === "Tümü" || tool.category === category;
      const haystack = normalize(`${tool.name} ${tool.description} ${tool.category} ${tool.url}`);
      const matchesQuery = !q || haystack.includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  function toggleFavorite(id) {
    const next = favorites.includes(id)
      ? favorites.filter((item) => item !== id)
      : [...favorites, id];

    setFavorites(next);
    localStorage.setItem("favoriteTools", JSON.stringify(next));
  }

  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">Açık web araçları kataloğu</p>
          <h1>“Yasadışı gibi hissettiren” ama yasal web siteleri</h1>
          <p className="lead">
            50 popüler web aracını tek ekranda ara, filtrele, favorilere ekle ve GitHub projesi olarak yayınla.
          </p>
        </div>

        <div className="stats">
          <div>
            <strong>{tools.length}</strong>
            <span>site</span>
          </div>
          <div>
            <strong>{categories.length - 1}</strong>
            <span>kategori</span>
          </div>
          <div>
            <strong>{favorites.length}</strong>
            <span>favori</span>
          </div>
        </div>
      </section>

      <section className="toolbar">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ara: PDF, AI, güvenlik, video..."
          aria-label="Ara"
        />

        <div className="categoryRow">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={category === item ? "active" : ""}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="grid">
        {filteredTools.map((tool) => (
          <article className="card" key={tool.id}>
            <div className="cardTop">
              <span className="index">#{tool.id}</span>
              <button
                className={`favorite ${favorites.includes(tool.id) ? "selected" : ""}`}
                onClick={() => toggleFavorite(tool.id)}
                title="Favoriye ekle"
              >
                ★
              </button>
            </div>

            <h2>{tool.name}</h2>
            <p>{tool.description}</p>

            <div className="meta">
              <span>{tool.category}</span>
              <span>{tool.badge}</span>
            </div>

            <a href={tool.url} target="_blank" rel="noreferrer">
              Siteye git →
            </a>
          </article>
        ))}
      </section>

      {filteredTools.length === 0 && (
        <section className="empty">
          <h2>Sonuç bulunamadı</h2>
          <p>Farklı bir anahtar kelime veya kategori dene.</p>
        </section>
      )}

      <footer>
        Bu proje yalnızca katalog amaçlıdır. Her sitenin kullanım şartları, telif kuralları ve yerel yasalar kullanıcı sorumluluğundadır.
      </footer>
    </main>
  );
}
