import { useEffect } from "react";
import { Link } from "react-router-dom";
import { people, report } from "../content.js";
import stats from "../data/stats.json";

function formatCount(n) {
  return n.toLocaleString("en-US");
}

export default function Home() {
  useEffect(() => {
    document.title = "Sights";
  }, []);
  return (
    <>
      <header className="bar">
        <span className="bar-side" />
        <p className="bar-title">Sights</p>
        <span className="bar-side" />
      </header>
      <main className="column">
        <section className="mint">
          <h1>Sights</h1>
          <p>
            {stats.people_count} 個人 · 1 份報告
          </p>
          <p className="mint-meta">
            {formatCount(stats.parsed_messages)} 則 · {stats.text_starts.slice(0, 4)}–{stats.last.slice(0, 4)}
          </p>
          <Link className="mint-row" to="/stats">
            <span>睇晒所有數據</span>
            <span aria-hidden="true">›</span>
          </Link>
        </section>

        <h2 className="label">群組報告</h2>
        <Link className="card report-card" to="/report">
          <span className="index-badge" aria-hidden="true">
            1
          </span>
          <span className="report-card-title">{report.title.replace("\n", "")}</span>
          <span className="chevron" aria-hidden="true">
            ›
          </span>
        </Link>

        <h2 className="label">成員</h2>
        <ul className="member-list">
          {people.map((person) => (
            <li key={person.id}>
              <Link to={`/people/${person.id}`}>
                <span className="avatar" style={{ background: person.tint }}>
                  {person.emoji}
                </span>
                <span className="member-copy">
                  <span className="member-name">
                    {person.name}
                    {person.aka !== person.name ? (
                      <span className="member-aka"> {person.aka}</span>
                    ) : null}
                  </span>
                  <span className="member-title">{person.title}</span>
                </span>
                <span className="chevron" aria-hidden="true">
                  ›
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="foot-note">
          數字由呢份匯出計。原始對話冇放上網頁。2022 年呢份檔案只留低八則。
        </p>
      </main>
    </>
  );
}
