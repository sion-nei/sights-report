import { useEffect } from "react";
import { Link } from "react-router-dom";
import { people, report } from "../content.js";

function Blocks({ blocks }) {
  return blocks.map((block, index) => {
    if (block.type === "p") return <p key={index}>{block.text}</p>;
    if (block.type === "h3") return <h3 key={index}>{block.text}</h3>;
    if (block.type === "quote") {
      return (
        <blockquote key={index} className="bubble">
          <p>{block.text}</p>
        </blockquote>
      );
    }
    if (block.type === "people") {
      return (
        <ol key={index} className="verdicts">
          {people.map((person) => (
            <li key={person.id}>
              <Link to={`/people/${person.id}`}>
                <span className="verdict-kicker">
                  {person.emoji} {person.name}
                  {person.aka !== person.name ? `（${person.aka}）` : ""}【{person.title}】
                </span>
                <span className="verdict-body">{person.body}</span>
              </Link>
            </li>
          ))}
        </ol>
      );
    }
    return null;
  });
}

export default function Report() {
  useEffect(() => {
    document.title = report.title.replaceAll("\n", "");
  }, []);
  return (
    <>
      <header className="bar">
        <Link className="back" to="/" aria-label="返去 Sights">
          ‹
        </Link>
        <p className="bar-title">報告</p>
        <span className="bar-side" />
      </header>
      <article className="column prose">
        <h1>
          {report.title.split("\n").map((line, index, lines) => (
            <span key={line}>
              {line}
              {index < lines.length - 1 ? <br /> : null}
            </span>
          ))}
        </h1>
        <div className="author">
          <span className="avatar author-mark" aria-hidden="true">
            筆
          </span>
          <span>
            <strong>{report.author.name}</strong>
            <span>{report.author.bio}</span>
          </span>
        </div>
        {report.sections.map((section, index) => (
          <section key={section.title || index}>
            {section.title ? (
              <header className="section-head">
                {section.emoji ? (
                  <span className="section-emoji" aria-hidden="true">
                    {section.emoji}
                  </span>
                ) : null}
                <h2>{section.title}</h2>
                <span className="section-rule" aria-hidden="true" />
              </header>
            ) : null}
            <Blocks blocks={section.blocks} />
          </section>
        ))}
        <p className="foot-note">
          引文係原句，縮到一句。完整對話同表格連結冇放上嚟。
        </p>
      </article>
    </>
  );
}
