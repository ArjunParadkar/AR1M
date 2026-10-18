import { Link } from 'react-router-dom';
import { founders } from '../constants';

const initials = name => name.split(' ').map(w => w[0]).join('').slice(0, 2);

const Row = ({ f, i }) => (
  <article className="fd-row" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
    <div className="fd-photo">
      {f.imageUrl ? <img src={f.imageUrl} alt={f.name} /> : <span aria-hidden="true">{initials(f.name)}</span>}
    </div>
    <div>
      <span className="fd-role">{f.title}</span>
      <h2 className="fd-name">{f.name}</h2>
      {f.description && <p className="fd-bio">{f.description}</p>}
    </div>
  </article>
);

// The people, as an editorial list over the golden-hour sky.
const Founders = () => (
  <div className="fd-scroll">
    <div className="fd-wrap">
      <header className="fd-head">
        <h1>Founders</h1>
        <p>Students who decided not to wait. Arenda is run from Bentonville and Fayetteville, Arkansas, by the people below.</p>
      </header>
      <div className="fd-list">
        {founders.map((f, i) => <Row key={f.id} f={f} i={i} />)}
      </div>
      <div className="fd-cta">
        <p>Working on something that fits?</p>
        <Link to="/contact" className="ch-link" style={{ marginTop: 0 }}>Get in touch <span aria-hidden="true">↗</span></Link>
      </div>
    </div>
  </div>
);

export default Founders;
