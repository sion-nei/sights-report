import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import stats from "../data/stats.json";

const displayName = {
  "Siu Wai": "筱瑋",
};

function label(name) {
  return displayName[name] || name;
}

const YEARS = Object.keys(stats.years)
  .map(Number)
  .sort((a, b) => a - b);

function formatReply(seconds) {
  if (seconds == null) return "—";
  if (seconds < 90) return `${seconds} 秒`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return rest ? `${minutes} 分 ${rest} 秒` : `${minutes} 分`;
}

function heatColor(count, max) {
  if (!count) return "#f3f1ec";
  const t = count / max;
  if (t < 0.15) return "#d7efe4";
  if (t < 0.35) return "#8fcdb0";
  if (t < 0.65) return "#3e9a6e";
  return "#1d6b45";
}

function YearGrid({ year, daily }) {
  const cells = useMemo(() => {
    const start = new Date(Date.UTC(year, 0, 1));
    const end = new Date(Date.UTC(year, 11, 31));
    const pad = (start.getUTCDay() + 6) % 7;
    const days = [];
    for (let i = 0; i < pad; i += 1) days.push(null);
    for (let cursor = new Date(start); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
      const iso = cursor.toISOString().slice(0, 10);
      days.push({ iso, count: daily[iso] || 0 });
    }
    return days;
  }, [year, daily]);

  const max = Math.max(1, ...cells.filter(Boolean).map((cell) => cell.count));
  const total = cells.reduce((sum, cell) => sum + (cell ? cell.count : 0), 0);

  return (
    <div>
      <p className="heat-total">
        {year} 年 {total.toLocaleString("en-US")} 則
        {total === 0 ? "。呢年喺檔案入面係空白。" : "。一格係一日，色愈深就傾得愈多。"}
      </p>
      <div className="heat-scroll">
        <div className="heat-board">
          <div className="weekdays" aria-hidden="true">
            {["一", "二", "三", "四", "五", "六", "日"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="heat" role="img" aria-label={`${year} 年每日訊息`}>
            {cells.map((cell, index) =>
              cell ? (
                <span
                  key={cell.iso}
                  title={`${cell.iso} · ${cell.count} 則`}
                  style={{ background: heatColor(cell.count, max) }}
                />
              ) : (
                <span key={`pad-${index}`} className="heat-pad" />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Stats() {
  const [year, setYear] = useState(YEARS[0] ?? 2013);
  useEffect(() => {
    document.title = "Sights 數據";
  }, []);
  const maxShare = stats.people[0].count;
  const maxHour = Math.max(...Object.values(stats.hours));
  const phrases = stats.top_phrases.filter((item) => !/^[\s?？.。!！]+$/.test(item.text)).slice(0, 8);

  return (
    <>
      <header className="bar">
        <Link className="back" to="/" aria-label="返去 Sights">
          ‹
        </Link>
        <p className="bar-title">數據</p>
        <span className="bar-side" />
      </header>
      <main className="column prose">
        <h1>你哋嘅每一年，逐日睇。</h1>
        <p className="lede">
          {stats.parsed_messages.toLocaleString("en-US")} 則，{stats.people_count} 個人。時鐘跟匯出檔，冇再換時區。
          空白只代表呢份檔案冇訊息，唔係證明嗰年個群冇傾過。
        </p>

        <div className="year-switch" role="tablist" aria-label="年份">
          {YEARS.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={item === year}
              className={item === year ? "is-on" : undefined}
              onClick={() => setYear(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <YearGrid year={year} daily={stats.daily} />

        <header className="section-head">
          <h2>發言比例</h2>
          <span className="section-rule" aria-hidden="true" />
        </header>
        <ol className="bars">
          {stats.people.map((person, index) => (
            <li key={person.name}>
              <span className="bar-label">
                <span>
                  {index + 1} {label(person.name)}
                </span>
                <span>
                  {person.share}% · {person.count.toLocaleString("en-US")}
                </span>
              </span>
              <span className="track">
                <span style={{ width: `${(person.count / maxShare) * 100}%` }} />
              </span>
            </li>
          ))}
        </ol>

        <header className="section-head">
          <h2>邊個開口先</h2>
          <span className="section-rule" aria-hidden="true" />
        </header>
        <p>靜咗超過三個鐘之後，下一個說話嘅人。</p>
        <ol className="bars">
          {stats.openers.slice(0, 8).map((person) => (
            <li key={person.name}>
              <span className="bar-label">
                <span>{label(person.name)}</span>
                <span>{person.share}%</span>
              </span>
              <span className="track">
                <span style={{ width: `${(person.share / stats.openers[0].share) * 100}%` }} />
              </span>
            </li>
          ))}
        </ol>

        <header className="section-head">
          <h2>你哋嘅節奏</h2>
          <span className="section-rule" aria-hidden="true" />
        </header>
        <p>對話仲開緊先計。五秒到六個鐘之內嘅下一句先算回覆，隔夜唔計。</p>
        <ol className="reply-list">
          {[...stats.people]
            .filter((person) => person.reply_median_sec != null)
            .sort((a, b) => a.reply_median_sec - b.reply_median_sec)
            .map((person, index) => (
              <li key={person.name}>
                <span>{index + 1}</span>
                <span>{label(person.name)}</span>
                <strong>{formatReply(person.reply_median_sec)}</strong>
              </li>
            ))}
        </ol>

        <dl className="facts">
          <div>
            <dt>最多訊息嘅一日</dt>
            <dd>
              {stats.busiest_day.count.toLocaleString("en-US")} 則
              <span>{stats.busiest_day.date}</span>
            </dd>
          </div>
          <div>
            <dt>連續有訊息</dt>
            <dd>
              {stats.streak.days} 日
              <span>
                {stats.streak.from} 至 {stats.streak.to}
              </span>
            </dd>
          </div>
          <div>
            <dt>最長空白</dt>
            <dd>
              {stats.longest_silences[0].days} 日
              <span>
                {stats.longest_silences[0].from} 至 {stats.longest_silences[0].to}
              </span>
            </dd>
          </div>
        </dl>
        <p className="foot-note">空白係呢份檔案冇訊息，唔係證明個群嗰陣冇傾過。</p>

        <header className="section-head">
          <h2>按鐘數</h2>
          <span className="section-rule" aria-hidden="true" />
        </header>
        <p>
          高峰喺{stats.peak_hour === 0 ? "凌晨 12 時" : `${stats.peak_hour} 時`}。夜晚 10 點到朝早 6 點佔 {stats.night_share}%。
        </p>
        <div className="hours" aria-hidden="true">
          {Array.from({ length: 24 }, (_, hour) => (
            <span key={hour} className={hour === stats.peak_hour ? "is-peak" : undefined}>
              <span
                style={{ height: `${Math.max(4, (stats.hours[String(hour)] / maxHour) * 100)}%` }}
              />
            </span>
          ))}
        </div>
        <div className="hour-axis" aria-hidden="true">
          <span>上午 12 時</span>
          <span>下午 12 時</span>
          <span>晚上 11 時</span>
        </div>

        <header className="section-head">
          <h2>重複出現嘅短句</h2>
          <span className="section-rule" aria-hidden="true" />
        </header>
        <ol className="phrases">
          {phrases.map((item, index) => (
            <li key={item.text}>
              <span>{index + 1}</span>
              <span>{item.text}</span>
              <span>{item.count}</span>
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
