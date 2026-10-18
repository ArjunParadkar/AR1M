import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import ArendaLogoMark from '../components/ArendaLogoMark';
import Island, { SCENES } from './Island';

// One country for the whole immersive site; every route is a different place in
// it (see Island.jsx). The intro (/) sits on the capital as a dark curtain and
// lifts when it hands over to /hub, so the lake is already there when it does.
const SCENE_OF = {
  '/hub': 'capital',
  '/explore/companies': 'ocean',
  '/explore/research': 'cyber',
  '/explore/projects': 'snow',
  '/founder': 'bay',
  '/contact': 'capital-night',
};
const sceneFor = (p) => SCENE_OF[p] || (p.startsWith('/explore') ? 'ocean' : 'capital');
// which legibility scrim a route gets: hub text on the sky, explore's object in the middle, long copy on founder/contact
const toneFor = (p) => (p.startsWith('/explore') ? 'afterglow' : p === '/founder' || p === '/contact' ? 'golden' : 'dusk');

const ImmersiveLayout = () => {
  const { pathname } = useLocation();
  const intro = pathname === '/';
  const scene = sceneFor(pathname);
  const tone = toneFor(pathname);

  return (
    <div className="world" data-phase={tone} data-scene={scene} data-intro={intro || undefined}>
      <Island scene={scene} tone={tone} />
      <div className="grain" aria-hidden="true" />

      <Outlet />

      {!intro && (
        <>
          <header className="chrome">
            <Link to="/hub" className="wm" aria-label="Arenda Innovations, home">
              <ArendaLogoMark filled fill="#f5ecdf" outline="transparent" />
              <span>Arenda Innovations</span>
            </Link>
            <nav className="chrome-nav" aria-label="Site">
              <NavLink to="/explore/companies" className={() => (pathname.startsWith('/explore') ? 'active' : '')}>Work</NavLink>
              <NavLink to="/founder">Founders</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </nav>
          </header>
          <aside className="edge" aria-hidden="true"><span key={scene}>Arenda · {SCENES[scene]}</span></aside>
        </>
      )}
    </div>
  );
};

export default ImmersiveLayout;
