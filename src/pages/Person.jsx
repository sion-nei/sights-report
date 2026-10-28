import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { people } from "../content.js";
import stats from "../data/stats.json";

function formatReply(seconds) {
  if (seconds == null) return "—";
  if (seconds < 90) return `${seconds} 秒`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return rest ? `${minutes} 分 ${rest} 秒` : `${minutes} 分`;
}

export default function Person() {
  const { id } = useParams();
  const person = people.find((item) => item.id === id);
  const statKey = person?.statName || person?.name;
  const stat = stats.people.find((item) => item.name === statKey);
  const opener = stats.openers.find((item) => item.name === statKey);

  useEffect(() => {
    document.title = person ? `${person.name} · Sights` : "Sights";
  }, [person]);

  if (!person || !stat) {
    return (
      <main className="column">
        <p>搵唔到呢個人。</p>
        <Link to="/">返去 Sights</Link>
      </main>
    );
  }

  return (
    <>
      <header className="bar">
        <Link className="back" to="/" aria-label="返去 Sights">
          ‹
        </Link>
        <p className="bar-title">{person.name}</p>
        <span className="bar-side" />
      </header>
      <main className="column prose person-page">
        <p className="person-emoji" aria-hidden="true">
          <span style={{ background: person.tint }}>{person.emoji}</span>
        </p>
        <h1>{person.name}</h1>
        {person.aka !== person.name ? <p className="person-aka-line">{person.aka}</p> : null}
        <p className="person-role">{person.title}</p>
        <dl className="stat-row">
          <div>
            <dt>則數</dt>
            <dd>{stat.count.toLocaleString("en-US")}</dd>
          </div>
          <div>
            <dt>佔比</dt>
            <dd>{stat.share}%</dd>
          </div>
          <div>
            <dt>回覆</dt>
            <dd>{formatReply(stat.reply_median_sec)}</dd>
          </div>
          <div>
            <dt>開口</dt>
            <dd>{opener ? `${opener.share}%` : "—"}</dd>
          </div>
        </dl>
        <p className="range">
          {stat.first} 至 {stat.last}
        </p>
        <p>{person.body}</p>
        <p className="rank-note">越上面越大件事，或者越柒。同樣大，就睇個群動咗幾多人。</p>
        <ol className="events">
          {person.events.map((event) => (
            <li key={event.title}>
              <h2>{event.title}</h2>
              <p>{event.text}</p>
              {event.quote ? (
                <blockquote className="bubble">
                  <p>{event.quote}</p>
                </blockquote>
              ) : null}
            </li>
          ))}
        </ol>
        <p className="foot-note">對話仲開緊先計。五秒到六個鐘之內嘅下一句先算回覆，隔夜唔計。</p>
      </main>
    </>
  );
}
