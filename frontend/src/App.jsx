import {useEffect,useState} from 'react';
import {BrowserRouter,Routes,Route,Link,useNavigate,Navigate} from 'react-router-dom';
import './App.css';

const API=(import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api').replace(/\/$/,'');
const API_BASE=API.replace(/\/api\/?$/,'');
const resolveImageUrl=(url)=>{
  if(!url) return '';
  if(/^https?:\/\//i.test(url)){
    return url.replace('http://127.0.0.1:5000', API_BASE).replace('http://localhost:5000', API_BASE);
  }
  return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
};


const companyInfo = {
  phonePrimary: '8233252551',
  phoneSecondary: '7302415956',
  emailPrimary: 'rc7087726@gmail.com',
  emailSecondary: 'varunc723@gmail.com',
  whatsapp: '918233252551'
};
const galleryFallback=[
 ['Precast Box Culvert Work','Precast Box Culvert','/company-gallery/project-1.jpeg'],['Precast Box Culvert Work','Precast Box Culvert','/company-gallery/project-2.jpeg'],['Friction Slab with Crash Barrier Precasting','Precast / Crash Barrier','/company-gallery/project-6.jpeg'],['PSC Girder Work in Progress','PSC Girder','/company-gallery/project-8.jpeg'],['Kerb Laying Work in Progress','Kerb Laying','/company-gallery/project-10.jpeg'],['MJB and RCC Girder Work in Progress','Bridge & Girder','/company-gallery/project-13.jpeg'],['RCC Drain Site','RCC Drain','/company-gallery/project-16.jpeg'],['PQC Laying (300 mm Thk)','PQC','/company-gallery/project-19.jpeg'],['PQC Joint Cutting','PQC Joint Cutting','/company-gallery/project-20.jpeg'],['After Joint Cutting Site Photo','PQC','/company-gallery/project-21.jpeg']
].map((x,i)=>({title:x[0],category:x[1],image:x[2],_id:`fallback-${i}`}));
const servicesFallback=[
 ['🧱','Friction Slab & Crash Barrier Precasting','Precast and cast-in-situ friction slab and crash barrier works.'],['⬛','Precast Box Culvert','Precast box culvert casting including 1500×1500 mm and 1200×1200 mm sizes.'],['🏗️','PSC & RCC Girder Casting','PSC and RCC girder casting and associated structural works.'],['🌉','Major & Minor Bridges / LVUP','Major bridge, minor bridge and LVUP construction works.'],['🛣️','Kerb Laying','Professional kerb laying work for road infrastructure.'],['💧','RCC Drain','RCC drain construction and site execution.'],['🚧','PQC Laying','PQC laying with paver and manual methods, including 300 mm thick work.']
].map((x,i)=>({icon:x[0],title:x[1],description:x[2],_id:`s-${i}`}));
const projectFallback=[
 {title:'Precast Box Culvert Work',category:'Precast Box Culvert',description:'Precast box culvert casting and site execution.',image:'/company-gallery/project-1.jpeg'},
 {title:'Friction Slab with Crash Barrier Precasting',category:'Crash Barrier',description:'Friction slab and crash barrier precasting work.',image:'/company-gallery/project-6.jpeg'},
 {title:'PSC Girder Work',category:'PSC Girder',description:'PSC girder reinforcement and construction work in progress.',image:'/company-gallery/project-8.jpeg'},
 {title:'Kerb Laying Work',category:'Kerb Laying',description:'Kerb laying work in progress.',image:'/company-gallery/project-10.jpeg'},
 {title:'MJB and RCC Girder Work',category:'Bridge / RCC Girder',description:'MJB and RCC girder construction work.',image:'/company-gallery/project-13.jpeg'},
 {title:'RCC Drain Site',category:'RCC Drain',description:'RCC drain site work.',image:'/company-gallery/project-16.jpeg'},
 {title:'PQC Laying – 300 mm Thk',category:'PQC',description:'PQC laying work with heavy paving equipment.',image:'/company-gallery/project-19.jpeg'}
].map((x,i)=>({...x,_id:`p-${i}`}));

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="brand">
        <div className="brand-mark">BSC</div>

        <div>
          <strong>BSC CIVIL CONTRACTOR</strong>
          <span>Construction • Roads • Bridges</span>
        </div>
      </div>

      <button
        className="mobile-menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <nav className={menuOpen ? "nav-open" : ""}>
        <a href="#home" onClick={closeMenu}>Home</a>
        <a href="#about" onClick={closeMenu}>About</a>
        <a href="#services" onClick={closeMenu}>Services</a>
        <a href="#projects" onClick={closeMenu}>Projects</a>
        <a href="#gallery" onClick={closeMenu}>Gallery</a>
        <a href="#testimonials" onClick={closeMenu}>Testimonials</a>
        <a href="#contact" onClick={closeMenu}>Contact</a>

        <Link
          className="admin-pill"
          to="/admin/login"
          onClick={closeMenu}
        >
          Admin
        </Link>
      </nav>
    </header>
  );
}function Home(){const [form,setForm]=useState({name:'',phone:'',email:'',workType:'',message:''});const [status,setStatus]=useState('');const [services,setServices]=useState(servicesFallback);const [projects,setProjects]=useState(projectFallback);const [gallery,setGallery]=useState(galleryFallback);const [testimonials,setTestimonials]=useState([]);const [selectedImage,setSelectedImage]=useState(null);const [selectedProject,setSelectedProject]=useState(null);const [selectedService,setSelectedService]=useState(null);const [enquiryForm,setEnquiryForm]=useState({name:'',phone:'',email:'',workType:'',message:''});
const [enquiryStatus,setEnquiryStatus]=useState({type:'',message:''});
const [enquiryLoading,setEnquiryLoading]=useState(false);const [showBackToTop,setShowBackToTop]=useState(false);
const submitEnquiry=async e=>{
  e.preventDefault();
  setEnquiryStatus({type:'',message:''});

  if(!enquiryForm.name.trim()||!enquiryForm.phone.trim()||!enquiryForm.workType){
    setEnquiryStatus({type:'error',message:'Please fill name, phone and work type.'});
    return;
  }

  if(!/^[0-9+\-\s()]{10,16}$/.test(enquiryForm.phone.trim())){
    setEnquiryStatus({type:'error',message:'Please enter a valid phone number.'});
    return;
  }

  try{
    setEnquiryLoading(true);

    const response=await fetch(`${API}/enquiries`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(enquiryForm)
    });

    const data=await response.json();

    if(!response.ok){
      throw new Error(data.message||'Failed to submit enquiry');
    }

    setEnquiryStatus({type:'success',message:'Thank you! Your enquiry has been submitted successfully.'});
    setEnquiryForm({name:'',phone:'',email:'',workType:'',message:''});
  }catch(error){
    setEnquiryStatus({type:'error',message:error.message||'Unable to submit enquiry. Please try again.'});
  }finally{
    setEnquiryLoading(false);
  }
};

useEffect(()=>{
  const handleScroll=()=>setShowBackToTop(window.scrollY>500);
  window.addEventListener('scroll',handleScroll);
  handleScroll();
  return()=>window.removeEventListener('scroll',handleScroll);
},[]);

useEffect(()=>{Promise.all(['services','projects','gallery','testimonials'].map(k=>fetch(`${API}/${k}`).then(r=>r.json()).catch(()=>null))).then(([s,p,g,t])=>{if(s?.success&&s.items?.length)setServices(s.items);if(p?.success&&p.items?.length)setProjects(p.items);if(g?.success&&g.items?.length)setGallery(g.items);if(t?.success&&t.items?.length)setTestimonials(t.items);});},[]);useEffect(()=>{const handleKeyDown=e=>{if(e.key==='Escape'){setSelectedImage(null);setSelectedProject(null);setSelectedService(null)}};window.addEventListener('keydown',handleKeyDown);return()=>window.removeEventListener('keydown',handleKeyDown)},[]);const submit=async e=>{e.preventDefault();setStatus('Submitting...');try{const r=await fetch(`${API}/enquiries`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});const d=await r.json();if(r.ok){setStatus('Enquiry submitted successfully. We will contact you soon.');setForm({name:'',phone:'',email:'',workType:'',message:''});}else setStatus(d.message||'Submission failed.');}catch{setStatus('Unable to connect to server.');}};return <><Header/><main>
<section id="home" className="hero"><div className="hero-overlay"><div className="hero-copy"><span className="eyebrow">BSC CIVIL CONTRACTOR • ESTABLISHED MAY 2013</span><h1>Building Roads.<br/><em>Building Infrastructure.</em></h1><p>Experienced civil construction and subcontracting team delivering quality work within timelines and safety requirements.</p><div className="hero-actions"><a href="#contact" className="btn btn-primary">Request a Quote</a><a href={`tel:${companyInfo.phonePrimary}`} className="btn btn-light">Call +91 {companyInfo.phonePrimary}</a></div></div></div></section>
<section id="about" className="section about-premium">
  <div className="about-premium-grid">
    <div className="about-visual">
      <div className="about-photo-card">
        <img src={gallery[0]?.image || projects[0]?.image || "/placeholder.jpg"} alt="BSC Civil Contractor work"/>
        <div className="about-experience-badge">
          <strong>10+</strong>
          <span>Years of<br/>Experience</span>
        </div>
      </div>
      <div className="about-mini-card">
        <span className="about-mini-icon">🏗️</span>
        <div><strong>Infrastructure</strong><small>Civil Construction Works</small></div>
      </div>
    </div>

    <div className="about-content">
      <span className="section-kicker">ABOUT BSC CIVIL CONTRACTOR</span>
      <h2>Building strong infrastructure with quality, safety &amp; precision.</h2>
      <p className="about-lead">BSC Civil Contractor is a Khurja-based civil construction contractor focused on road and infrastructure-related works, with experience in precast, RCC, PSC and site execution activities.</p>
      <p>Our work portfolio includes friction slab and crash barrier works, precast box culverts, PSC &amp; RCC girder casting, bridges and LVUP works, kerb laying, RCC drains and PQC laying.</p>

      <div className="about-points">
        <div><span>✓</span><div><strong>Quality Focus</strong><small>Work planned and executed with attention to finish and specifications.</small></div></div>
        <div><span>✓</span><div><strong>Safety Mindset</strong><small>Site activities carried out with safety and coordination as priorities.</small></div></div>
        <div><span>✓</span><div><strong>Infrastructure Expertise</strong><small>Specialized experience across road and civil infrastructure activities.</small></div></div>
        <div><span>✓</span><div><strong>Project Coordination</strong><small>Focused on timely execution and clear communication with clients.</small></div></div>
      </div>

      <div className="about-actions">
        <a className="btn btn-primary" href="#contact">Request a Quote →</a>
        <a className="about-phone" href={"tel:"+companyInfo.phonePrimary}>☎ {companyInfo.phonePrimary}</a>
      </div>
    </div>
  </div>

  <div className="about-stats">
    <div><strong>10+</strong><span>Years Experience</span></div>
    <div><strong>7+</strong><span>Core Civil Services</span></div>
    <div><strong>Road</strong><span>&amp; Infrastructure Work</span></div>
    <div><strong>QHSE</strong><span>Quality &amp; Safety Focus</span></div>
  </div>
</section>
<section className="section dark-section"><div className="three-cols"><article><span>MISSION</span><h3>Active, value-added services</h3><p>Provide active, value-added services to customers without compromising on quality.</p></article><article><span>VISION</span><h3>A benchmark civil contractor</h3><p>The stated vision is to become a benchmark civil contractor in building and roads.</p></article><article><span>VALUES</span><h3>How we work</h3><p>Punctuality • Commitment • Honesty • Trust • Courage • Respect</p></article></div></section>
<section id="services" className="section services-premium">
  <div className="section-head services-head">
    <span>OUR SERVICES</span>
    <h2>Specialized civil construction capabilities.</h2>
    <p>From precast and RCC works to road infrastructure execution, our services are focused on practical site requirements and quality delivery.</p>
  </div>

  <div className="services-grid-premium">
    {services.map((s,index)=>{
      const icons=['🧱','⬛','🏗️','🌉','🛣️','💧','🚧'];
      return (
        <article className="service-card-premium" key={s._id}>
          <div className="service-icon-premium">{s.icon || icons[index % icons.length]}</div>
          <div className="service-number">0{index+1}</div>
          <h3>{s.title}</h3>
          <p>{s.description}</p>
          <button type="button" className="service-view-btn" onClick={()=>setSelectedService(s)}>
            View Details <span>→</span>
          </button>
        </article>
      );
    })}
  </div>

  <div className="services-bottom-cta">
    <div>
      <span>HAVE A CIVIL WORK REQUIREMENT?</span>
      <h3>Let’s discuss your project requirements.</h3>
    </div>
    <a className="btn btn-primary" href="#contact">Get a Quote →</a>
  </div>

  {selectedService&&
    <div className="service-modal" onClick={()=>setSelectedService(null)}>
      <div className="service-modal-card" onClick={e=>e.stopPropagation()}>
        <button type="button" className="service-modal-close" onClick={()=>setSelectedService(null)} aria-label="Close service details">✕</button>
        <div className="service-modal-icon">{selectedService.icon || '🏗️'}</div>
        <span className="project-category">BSC CIVIL CONTRACTOR</span>
        <h2>{selectedService.title}</h2>
        <p>{selectedService.description}</p>
        <div className="service-modal-points">
          <div><span>✓</span>Site-focused execution</div>
          <div><span>✓</span>Quality and coordination</div>
          <div><span>✓</span>Infrastructure work experience</div>
        </div>
        <a className="btn btn-primary" href="#contact" onClick={()=>setSelectedService(null)}>Discuss This Service →</a>
      </div>
    </div>
  }
</section>
<section id="projects" className="section tinted"><div className="section-head"><span>WORK PORTFOLIO</span><h2>Selected work and site activities.</h2></div><div className="project-grid">{projects.map(p=><article className="project-card project-card-enhanced" key={p._id}><div className="project-image-wrap"><img src={resolveImageUrl(p.image)} alt={p.title}/><div className="project-image-overlay"><button type="button" onClick={()=>setSelectedProject(p)}>View Details</button></div></div><div className="project-card-body"><span className="project-category">{p.category}</span><h3>{p.title}</h3><p>{p.description}</p><button type="button" className="project-details-btn" onClick={()=>setSelectedProject(p)}>View Project →</button></div></article>)}</div>{selectedProject&&<div className="project-modal" onClick={()=>setSelectedProject(null)}><div className="project-modal-card" onClick={e=>e.stopPropagation()}><button className="project-modal-close" type="button" onClick={()=>setSelectedProject(null)} aria-label="Close project details">✕</button><img src={selectedProject.image} alt={selectedProject.title}/><div className="project-modal-body"><span className="project-category">{selectedProject.category}</span><h2>{selectedProject.title}</h2><p>{selectedProject.description||'Civil construction work executed by BSC Civil Contractor.'}</p>{selectedProject.location&&<p className="project-location">📍 {selectedProject.location}</p>}<a className="btn btn-primary" href="#contact" onClick={()=>setSelectedProject(null)}>Discuss Similar Work</a></div></div></div>}</section>
<section id="gallery" className="section"><div className="section-head"><span>SITE GALLERY</span><h2>Actual work photographs from the company profile.</h2></div><div className="gallery-grid">{gallery.map((g,index)=><figure key={g._id} onClick={()=>setSelectedImage(index)} style={{cursor:'pointer'}}><img src={resolveImageUrl(g.image)} alt={g.title}/><figcaption><b>{g.title}</b><small>{g.category}</small></figcaption></figure>)}</div>{selectedImage!==null&&gallery[selectedImage]&&<div className="gallery-lightbox" onClick={()=>setSelectedImage(null)}><button className="lightbox-close" onClick={()=>setSelectedImage(null)} aria-label="Close gallery">✕</button><button className="lightbox-prev" onClick={e=>{e.stopPropagation();setSelectedImage(selectedImage===0?gallery.length-1:selectedImage-1)}} aria-label="Previous image">‹</button><div className="lightbox-content" onClick={e=>e.stopPropagation()}><img src={gallery[selectedImage].image} alt={gallery[selectedImage].title}/><div className="lightbox-caption"><strong>{gallery[selectedImage].title}</strong><span>{gallery[selectedImage].category}</span></div></div><button className="lightbox-next" onClick={e=>{e.stopPropagation();setSelectedImage(selectedImage===gallery.length-1?0:selectedImage+1)}} aria-label="Next image">›</button></div>}</section>
<section id="testimonials" className="section tinted"><div className="section-head"><span>CLIENT TESTIMONIALS</span><h2>What our clients say about our work.</h2></div>{testimonials.length>0?<div className="testimonial-grid">{testimonials.map(t=>{const rating=Math.max(1,Math.min(5,Number(t.rating)||5));return <article className="testimonial-card" key={t._id}><div className="testimonial-rating" aria-label={`${rating} out of 5 stars`}>{'★'.repeat(rating)}</div><p>“{t.message}”</p><div className="testimonial-person"><strong>{t.name}</strong>{t.role&&<small>{t.role}</small>}</div></article>})}</div>:<div className="admin-note"><h3>No testimonials yet</h3><p>Client testimonials will appear here.</p></div>}</section>
<section className="section qhse"><div className="section-head"><span>QHSE POLICY</span><h2>Quality, Health, Safety & Environment are integral to the business.</h2></div><div className="qhse-grid"><div><h3>Quality & compliance</h3><p>Comply with applicable legal and other requirements connected with quality, occupational health, safety and environmental matters.</p></div><div><h3>Safe working</h3><p>Use relevant technology, resource optimization, training and communication to maintain safe working and occupational health standards.</p></div><div><h3>Continuous improvement</h3><p>Continually improve QHSE performance and prevent pollution, injuries and ill health through planned objectives and targets.</p></div></div></section>
<section id="contact" className="section contact-premium">
  <div className="section-head">
    <span>CONTACT US</span>
    <h2>Tell us about your civil construction requirement.</h2>
    <p>Share your project details and our team can connect with you regarding the required work.</p>
  </div>

  <div className="contact-premium-grid">
    <div className="contact-info-card">
      <div className="contact-info-top">
        <span className="section-kicker">BSC CIVIL CONTRACTOR</span>
        <h3>Let’s build the next project together.</h3>
        <p>For road, precast, RCC, PSC and infrastructure-related civil work requirements, get in touch with our team.</p>
      </div>

      <div className="contact-detail-list">
        <a href={"tel:"+companyInfo.phonePrimary}><span>☎</span><div><small>Primary Phone</small><strong>{companyInfo.phonePrimary}</strong></div></a>
        <a href={"tel:"+companyInfo.phoneSecondary}><span>☎</span><div><small>Secondary Phone</small><strong>{companyInfo.phoneSecondary}</strong></div></a>
        <a href={"mailto:"+companyInfo.emailPrimary}><span>✉</span><div><small>Email</small><strong>{companyInfo.emailPrimary}</strong></div></a>
        <div><span>📍</span><div><small>Location</small><strong>Khurja, Bulandshahr, Uttar Pradesh</strong></div></div>
      </div>

      <div className="contact-direct-actions">
        <a className="contact-direct-btn whatsapp" href={"https://wa.me/"+companyInfo.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
        <a className="contact-direct-btn call" href={"tel:"+companyInfo.phonePrimary}>Call Now</a>
      </div>
    </div>

    <form className="enquiry-form-premium" onSubmit={submitEnquiry}>
      <div className="form-heading">
        <span>PROJECT ENQUIRY</span>
        <h3>Request a quote</h3>
      </div>

      <div className="form-row">
        <label>Name *<input value={enquiryForm.name} onChange={e=>setEnquiryForm({...enquiryForm,name:e.target.value})} placeholder="Your full name" /></label>
        <label>Phone *<input value={enquiryForm.phone} onChange={e=>setEnquiryForm({...enquiryForm,phone:e.target.value})} placeholder="10-digit phone number" inputMode="tel" /></label>
      </div>

      <div className="form-row">
        <label>Email<input type="email" value={enquiryForm.email} onChange={e=>setEnquiryForm({...enquiryForm,email:e.target.value})} placeholder="you@example.com" /></label>
        <label>Work Type *
          <select value={enquiryForm.workType} onChange={e=>setEnquiryForm({...enquiryForm,workType:e.target.value})}>
            <option value="">Select work type</option>
            <option value="Precast Box Culvert">Precast Box Culvert</option>
            <option value="Friction Slab & Crash Barrier">Friction Slab &amp; Crash Barrier</option>
            <option value="PSC & RCC Girder Casting">PSC &amp; RCC Girder Casting</option>
            <option value="Major & Minor Bridges / LVUP">Major &amp; Minor Bridges / LVUP</option>
            <option value="Kerb Laying">Kerb Laying</option>
            <option value="RCC Drain">RCC Drain</option>
            <option value="PQC Laying">PQC Laying</option>
            <option value="Other Civil Work">Other Civil Work</option>
          </select>
        </label>
      </div>

      <label>Project Requirement<textarea rows="6" value={enquiryForm.message} onChange={e=>setEnquiryForm({...enquiryForm,message:e.target.value})} placeholder="Tell us about location, quantity, project type or any other requirement..."></textarea></label>

      {enquiryStatus.message&&<div className={"enquiry-status "+enquiryStatus.type}>{enquiryStatus.message}</div>}

      <button className="btn btn-primary enquiry-submit-btn" type="submit" disabled={enquiryLoading}>
        {enquiryLoading?'Submitting...':'Submit Enquiry →'}
      </button>
      <small className="form-note">Your enquiry will be securely submitted to our project enquiry system.</small>
    </form>
  </div>
</section>
</main>
<div className="floating-actions" aria-label="Quick contact actions">
  <a
    className="floating-action floating-whatsapp"
    href={`https://wa.me/${companyInfo.whatsapp}`}
    target="_blank"
    rel="noreferrer"
    aria-label="Chat on WhatsApp"
    title="WhatsApp"
  >
    ☎
  </a>
  <a
    className="floating-action floating-call"
    href={`tel:${companyInfo.phonePrimary}`}
    aria-label="Call BSC Civil Contractor"
    title="Call"
  >
    📞
  </a>
</div>
<footer className="site-footer-premium">
  <div className="footer-main">
    <div className="footer-brand">
      <div className="footer-logo-mark">BSC</div>
      <div>
        <h3>Bhadur Singh Civil Construction</h3>
        <p>We Build the Way Forward</p>
      </div>
      <p className="footer-description">Road and infrastructure-focused civil construction works with practical site execution, quality and coordination.</p>
      <div className="footer-social-actions">
        <a href={"https://wa.me/"+companyInfo.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
        <a href={"tel:"+companyInfo.phonePrimary}>Call</a>
      </div>
    </div>

    <div className="footer-col">
      <h4>Quick Links</h4>
      <a href="#home">Home</a>
      <a href="#about">About Us</a>
      <a href="#services">Services</a>
      <a href="#projects">Projects</a>
      <a href="#gallery">Gallery</a>
      <a href="#contact">Contact</a>
    </div>

    <div className="footer-col">
      <h4>Our Services</h4>
      <a href="#services">Precast Box Culvert</a>
      <a href="#services">Friction Slab &amp; Crash Barrier</a>
      <a href="#services">PSC &amp; RCC Girder</a>
      <a href="#services">Bridges / LVUP</a>
      <a href="#services">Kerb &amp; RCC Drain</a>
      <a href="#services">PQC Laying</a>
    </div>

    <div className="footer-col footer-contact">
      <h4>Contact</h4>
      <a href={"tel:"+companyInfo.phonePrimary}>☎ {companyInfo.phonePrimary}</a>
      <a href={"tel:"+companyInfo.phoneSecondary}>☎ {companyInfo.phoneSecondary}</a>
      <a href={"mailto:"+companyInfo.emailPrimary}>✉ {companyInfo.emailPrimary}</a>
      <span>📍 Khurja, Bulandshahr, Uttar Pradesh</span>
    </div>
  </div>

  <div className="footer-bottom">
    <span>© {new Date().getFullYear()} Bhadur Singh Civil Construction. All rights reserved.</span>
    <span>Built for civil infrastructure &amp; construction.</span>
  </div>
</footer>

{showBackToTop&&
  <button className="back-to-top" type="button" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} aria-label="Back to top">↑</button>
}</>}

function Login(){const nav=useNavigate();const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [err,setErr]=useState('');const submit=async e=>{e.preventDefault();setErr('');try{const r=await fetch(`${API}/auth/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});const d=await r.json();if(!r.ok)return setErr(d.message||'Login failed');localStorage.setItem('adminToken',d.token);localStorage.setItem('admin',JSON.stringify(d.admin));nav('/admin/dashboard');}catch{setErr('Unable to connect to server.')}};return <div className="login-page"><form className="login-card" onSubmit={submit}><div className="brand-mark big">BSC</div><h1>Admin Login</h1><p>Manage enquiries, projects, gallery and website content.</p><input required type="email" placeholder="Admin email" value={email} onChange={e=>setEmail(e.target.value)}/><input required type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>{err&&<div className="error">{err}</div>}<button className="btn btn-primary">Login</button><Link to="/">← Back to website</Link></form></div>}
function Protected({children}){return localStorage.getItem('adminToken')?children:<Navigate to="/admin/login" replace/>}
function Sidebar(){const nav=useNavigate();return <aside className="admin-side"><div className="brand"><div className="brand-mark">BSC</div><div><strong>BSC CIVIL</strong><span>Admin Panel</span></div></div><nav><Link to="/admin/dashboard">📊 Dashboard</Link><Link to="/admin/enquiries">📩 Enquiries</Link><Link to="/admin/projects">🏗️ Projects</Link><Link to="/admin/gallery">🖼️ Gallery</Link><Link to="/admin/services">🛠️ Services</Link><Link to="/admin/testimonials">⭐ Testimonials</Link></nav><button className="logout" onClick={()=>{localStorage.clear();nav('/admin/login')}}>Logout</button></aside>}
function AdminLayout({children,title}){return <div className="admin-layout"><Sidebar/><main className="admin-main"><div className="admin-top"><div><small>ADMIN PANEL</small><h1>{title}</h1></div><Link to="/" target="_blank">View Website ↗</Link></div>{children}</main></div>}
function Dashboard(){
  const [data,setData]=useState({
    enquiries:[],
    projects:[],
    gallery:[],
    services:[],
    testimonials:[]
  });
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");

  const token=localStorage.getItem("adminToken");

  const loadDashboard=async()=>{
    try{
      setLoading(true);
      setError("");

      const results=await Promise.all(
        ["enquiries","projects","gallery","services","testimonials"].map(
          key=>fetch(`${API}/${key}`,{
            headers:{Authorization:`Bearer ${token}`}
          }).then(r=>r.json())
        )
      );

      setData({
        enquiries:results[0]?.enquiries||[],
        projects:results[1]?.items||[],
        gallery:results[2]?.items||[],
        services:results[3]?.items||[],
        testimonials:results[4]?.items||[]
      });
    }catch(err){
      console.error("Dashboard error:",err);
      setError("Unable to load dashboard data.");
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{loadDashboard()},[]);

  const counts={
    enquiries:data.enquiries.length,
    projects:data.projects.length,
    gallery:data.gallery.length,
    services:data.services.length,
    testimonials:data.testimonials.length
  };

  const recentEnquiries=data.enquiries.slice(0,5);

  return <AdminLayout title="Dashboard">
    <div className="dashboard-welcome">
      <div>
        <span>CONTROL CENTER</span>
        <h2>Welcome to BSC Admin Panel</h2>
        <p>Manage your construction website content, customer enquiries and project portfolio from one place.</p>
      </div>
      <button className="dashboard-refresh" type="button" onClick={loadDashboard}>↻ Refresh</button>
    </div>

    {error&&<div className="dashboard-error">{error}</div>}

    <div className="stat-grid stat-grid-premium">
      {[
        ["📩","Enquiries",counts.enquiries,"/admin/enquiries","Customer leads"],
        ["🏗️","Projects",counts.projects,"/admin/projects","Work portfolio"],
        ["🖼️","Gallery",counts.gallery,"/admin/gallery","Work photos"],
        ["🛠️","Services",counts.services,"/admin/services","Civil services"],
        ["⭐","Testimonials",counts.testimonials,"/admin/testimonials","Client feedback"]
      ].map(item=>
        <Link className="stat stat-premium" to={item[3]} key={item[1]}>
          <div className="stat-top"><span>{item[0]}</span><small>View →</small></div>
          <b>{loading?"—":item[2]}</b>
          <strong>{item[1]}</strong>
          <em>{item[4]}</em>
        </Link>
      )}
    </div>

    <div className="dashboard-grid">
      <section className="dashboard-panel recent-panel">
        <div className="panel-heading">
          <div><span>LEAD ACTIVITY</span><h3>Recent Enquiries</h3></div>
          <Link to="/admin/enquiries">View All →</Link>
        </div>

        {loading?<p className="panel-empty">Loading enquiries...</p>:
          recentEnquiries.length===0?
          <div className="panel-empty"><div>📩</div><h4>No enquiries yet</h4><p>New customer enquiries will appear here.</p></div>:
          <div className="recent-enquiry-list">
            {recentEnquiries.map(item=>
              <div className="recent-enquiry" key={item._id}>
                <div className="enquiry-avatar">{(item.name||"C").charAt(0).toUpperCase()}</div>
                <div className="recent-enquiry-main">
                  <strong>{item.name}</strong>
                  <span>{item.workType}</span>
                </div>
                <div className="recent-enquiry-meta">
                  <a href={`tel:${item.phone}`}>{item.phone}</a>
                  <small>{item.createdAt?new Date(item.createdAt).toLocaleDateString():"-"}</small>
                </div>
              </div>
            )}
          </div>
        }
      </section>

      <section className="dashboard-panel quick-panel">
        <div className="panel-heading"><div><span>QUICK ACTIONS</span><h3>Manage Website</h3></div></div>
        <div className="quick-actions">
          <Link to="/admin/projects"><span>🏗️</span><div><strong>Add Project</strong><small>Update work portfolio</small></div><b>→</b></Link>
          <Link to="/admin/gallery"><span>🖼️</span><div><strong>Upload Photo</strong><small>Add site/work image</small></div><b>→</b></Link>
          <Link to="/admin/services"><span>🛠️</span><div><strong>Add Service</strong><small>Manage civil services</small></div><b>→</b></Link>
          <Link to="/admin/testimonials"><span>⭐</span><div><strong>Add Testimonial</strong><small>Add client feedback</small></div><b>→</b></Link>
        </div>
      </section>
    </div>

    <section className="dashboard-panel website-status-panel">
      <div className="panel-heading">
        <div><span>WEBSITE STATUS</span><h3>Content Overview</h3></div>
        <Link to="/" target="_blank">Open Website ↗</Link>
      </div>
      <div className="content-status-grid">
        <div><span>✓</span><div><strong>Public Website</strong><small>Live homepage and sections</small></div><b>Ready</b></div>
        <div><span>✓</span><div><strong>MongoDB Content</strong><small>Dynamic website data</small></div><b>Connected</b></div>
        <div><span>✓</span><div><strong>Admin Protection</strong><small>JWT protected management</small></div><b>Active</b></div>
        <div><span>✓</span><div><strong>Customer Enquiries</strong><small>Lead submission system</small></div><b>Active</b></div>
      </div>
    </section>
  </AdminLayout>
}
function Enquiries(){
  const [items,setItems]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("All");
  const [selected,setSelected]=useState(null);
  const [deleting,setDeleting]=useState("");

  const token=localStorage.getItem("adminToken");

  const loadEnquiries=async()=>{
    try{
      setLoading(true);
      setError("");
      const response=await fetch(`${API}/enquiries`,{
        headers:{Authorization:`Bearer ${token}`}
      });
      const data=await response.json();
      if(!response.ok) throw new Error(data.message||"Failed to fetch enquiries");
      setItems(data.enquiries||[]);
    }catch(err){
      console.error(err);
      setError(err.message||"Failed to load enquiries");
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{loadEnquiries()},[]);

  const workTypes=[...new Set(items.map(item=>item.workType).filter(Boolean))];

  const filtered=items.filter(item=>{
    const query=search.trim().toLowerCase();
    const matchesSearch=!query||
      [item.name,item.phone,item.email,item.workType,item.message]
      .filter(Boolean)
      .some(value=>String(value).toLowerCase().includes(query));
    const matchesFilter=filter==="All"||item.workType===filter;
    return matchesSearch&&matchesFilter;
  });

  const deleteEnquiry=async id=>{
    if(!window.confirm("Delete this enquiry? This action cannot be undone.")) return;
    try{
      setDeleting(id);
      const response=await fetch(`${API}/enquiries/${id}`,{
        method:"DELETE",
        headers:{Authorization:`Bearer ${token}`}
      });
      const data=await response.json();
      if(!response.ok) throw new Error(data.message||"Failed to delete enquiry");
      setItems(prev=>prev.filter(item=>item._id!==id));
      if(selected?._id===id) setSelected(null);
    }catch(err){
      alert(err.message||"Failed to delete enquiry");
    }finally{
      setDeleting("");
    }
  };

  const whatsappNumber=phone=>{
    const digits=String(phone||"").replace(/\D/g,"");
    return digits.length===10?"91"+digits:digits;
  };

  return <AdminLayout title="Enquiries">
    <div className="enquiries-management-head">
      <div>
        <span>CUSTOMER LEADS</span>
        <h2>Enquiries</h2>
        <p>Review incoming project enquiries and contact potential clients directly.</p>
      </div>
      <button className="dashboard-refresh" type="button" onClick={loadEnquiries}>↻ Refresh</button>
    </div>

    <div className="enquiry-summary-grid">
      <div><span>📩</span><div><b>{items.length}</b><small>Total Enquiries</small></div></div>
      <div><span>🔎</span><div><b>{filtered.length}</b><small>Showing Now</small></div></div>
      <div><span>🏗️</span><div><b>{workTypes.length}</b><small>Work Types</small></div></div>
    </div>

    <div className="enquiry-toolbar">
      <div className="enquiry-search">
        <span>⌕</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, phone, email or work type..." />
      </div>
      <select value={filter} onChange={e=>setFilter(e.target.value)}>
        <option value="All">All Work Types</option>
        {workTypes.map(type=><option key={type} value={type}>{type}</option>)}
      </select>
    </div>

    {error&&<div className="dashboard-error">{error}</div>}

    <div className="enquiries-table-panel">
      <div className="enquiries-table-head">
        <strong>{loading?"Loading...":`${filtered.length} enquiry${filtered.length===1?"":"ies"}`}</strong>
        {(search||filter!=="All")&&<button type="button" onClick={()=>{setSearch("");setFilter("All")}}>Clear Filters</button>}
      </div>

      {loading?<div className="enquiry-empty">Loading enquiries...</div>:
       filtered.length===0?
       <div className="enquiry-empty"><div>📭</div><h3>No enquiries found</h3><p>Try changing the search or filter, or wait for a new customer enquiry.</p></div>:
       <div className="enquiry-table-wrap">
         <table className="enquiry-table">
           <thead><tr><th>Customer</th><th>Work Type</th><th>Message</th><th>Date</th><th>Actions</th></tr></thead>
           <tbody>
             {filtered.map(item=>
               <tr key={item._id}>
                 <td><div className="customer-cell"><div className="customer-avatar">{(item.name||"C").charAt(0).toUpperCase()}</div><div><strong>{item.name}</strong><small>{item.phone}</small>{item.email&&<small>{item.email}</small>}</div></div></td>
                 <td><span className="work-type-pill">{item.workType}</span></td>
                 <td><div className="message-preview">{item.message||"No message provided"}</div></td>
                 <td><span className="date-cell">{item.createdAt?new Date(item.createdAt).toLocaleDateString():"-"}</span></td>
                 <td><div className="enquiry-actions">
                   <button type="button" onClick={()=>setSelected(item)} title="View details">👁</button>
                   <a href={`tel:${item.phone}`} title="Call">☎</a>
                   <a href={`https://wa.me/${whatsappNumber(item.phone)}`} target="_blank" rel="noreferrer" title="WhatsApp">💬</a>
                   <button className="delete-action" type="button" disabled={deleting===item._id} onClick={()=>deleteEnquiry(item._id)} title="Delete">{deleting===item._id?"…":"🗑"}</button>
                 </div></td>
               </tr>
             )}
           </tbody>
         </table>
       </div>
      }
    </div>

    {selected&&<div className="enquiry-detail-modal" onClick={()=>setSelected(null)}>
      <div className="enquiry-detail-card" onClick={e=>e.stopPropagation()}>
        <button className="enquiry-detail-close" type="button" onClick={()=>setSelected(null)}>✕</button>
        <div className="enquiry-detail-header">
          <div className="customer-avatar large">{(selected.name||"C").charAt(0).toUpperCase()}</div>
          <div><span>CUSTOMER ENQUIRY</span><h2>{selected.name}</h2><small>{selected.createdAt?new Date(selected.createdAt).toLocaleString():"Date unavailable"}</small></div>
        </div>
        <div className="enquiry-detail-grid">
          <div><small>Phone</small><strong>{selected.phone}</strong></div>
          <div><small>Email</small><strong>{selected.email||"Not provided"}</strong></div>
          <div><small>Work Type</small><strong>{selected.workType}</strong></div>
        </div>
        <div className="enquiry-message-box"><small>PROJECT REQUIREMENT</small><p>{selected.message||"No message provided."}</p></div>
        <div className="enquiry-detail-actions">
          <a href={`tel:${selected.phone}`} className="detail-call">☎ Call Customer</a>
          <a href={`https://wa.me/${whatsappNumber(selected.phone)}`} target="_blank" rel="noreferrer" className="detail-whatsapp">💬 WhatsApp</a>
          <button type="button" onClick={()=>deleteEnquiry(selected._id)} className="detail-delete">🗑 Delete</button>
        </div>
      </div>
    </div>}
  </AdminLayout>
}


function Manager({ type, title, fields, defaults }) {
  const [items,setItems]=useState([]);
  const [form,setForm]=useState(defaults);
  const [imageFile,setImageFile]=useState(null);
  const [preview,setPreview]=useState("");
  const [loading,setLoading]=useState(false);
  const [message,setMessage]=useState("");
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("All");
  const [selected,setSelected]=useState(null);

  const token=localStorage.getItem("adminToken");
  const isImageManager=type==="projects"||type==="gallery";

  const load=async()=>{
    try{
      const response=await fetch(`${API}/${type}`);
      const data=await response.json();
      if(data.success)setItems(data.items||[]);
    }catch(error){console.error("Load error:",error)}
  };

  useEffect(()=>{load()},[type]);

  const handleImageChange=e=>{
    const file=e.target.files[0];
    if(!file)return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadImage=async()=>{
    if(!imageFile)throw new Error("Please select an image");
    const imageData=new FormData();
    imageData.append("image",imageFile);
    const response=await fetch(`${API}/upload`,{method:"POST",body:imageData});
    const responseText=await response.text();
    let data;
    try{data=JSON.parse(responseText)}catch{throw new Error("Server returned an invalid response")}
    if(!response.ok||!data.success)throw new Error(data.message||"Image upload failed");
    return data.imageUrl;
  };

  const submit=async e=>{
    e.preventDefault();
    try{
      setLoading(true);setMessage("");
      let finalForm={...form};
      if(isImageManager){
        if(!imageFile){setMessage("Please select an image.");setLoading(false);return}
        finalForm.image=await uploadImage();
      }
      const response=await fetch(`${API}/${type}`,{
        method:"POST",
        headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},
        body:JSON.stringify(finalForm)
      });
      const data=await response.json();
      if(!response.ok||!data.success)throw new Error(data.message||"Failed to add item");
      setMessage("Added successfully!");
      setForm(defaults);setImageFile(null);setPreview("");
      const fileInput=document.getElementById(`${type}-image-input`);
      if(fileInput)fileInput.value="";
      load();
    }catch(error){
      console.error("Submit error:",error);
      setMessage(error.message||"Something went wrong");
    }finally{setLoading(false)}
  };

  const del=async id=>{
    if(!window.confirm("Delete this item?"))return;
    try{
      const response=await fetch(`${API}/${type}/${id}`,{
        method:"DELETE",
        headers:{Authorization:`Bearer ${token}`}
      });
      const data=await response.json();
      if(!response.ok||!data.success)throw new Error(data.message||"Delete failed");
      setItems(prev=>prev.filter(item=>item._id!==id));
      if(selected?._id===id)setSelected(null);
    }catch(error){
      console.error("Delete error:",error);
      alert(error.message||"Delete failed");
    }
  };

  if(type==="services"){
    const filtered=items.filter(item=>{
      const q=search.trim().toLowerCase();
      return !q||[item.title,item.description,item.icon].filter(Boolean).some(v=>String(v).toLowerCase().includes(q));
    });

    return <AdminLayout title="Services">
      <div className="content-management-head">
        <div><span>SERVICE MANAGEMENT</span><h2>Services</h2><p>Manage the civil construction services displayed on the website.</p></div>
        <button className="dashboard-refresh" type="button" onClick={load}>↻ Refresh</button>
      </div>

      <div className="content-summary-grid">
        <div><span>🛠️</span><div><b>{items.length}</b><small>Total Services</small></div></div>
        <div><span>🔎</span><div><b>{filtered.length}</b><small>Showing Now</small></div></div>
        <div><span>🏗️</span><div><b>7+</b><small>Core Work Areas</small></div></div>
      </div>

      <div className="content-toolbar">
        <div className="content-search"><span>⌕</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search services..."/></div>
      </div>

      <div className="content-admin-layout">
        <form className="content-add-card" onSubmit={submit}>
          <span>ADD SERVICE</span><h3>New Civil Service</h3>
          <label>Service Title *<input required value={form.title||""} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Precast Box Culvert"/></label>
          <label>Description *<textarea required rows="5" value={form.description||""} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Describe the service..."/></label>
          <label>Icon / Emoji<input value={form.icon||""} onChange={e=>setForm({...form,icon:e.target.value})} placeholder="🏗️"/></label>
          {message&&<p className="form-status">{message}</p>}
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading?"Saving...":"Add Service →"}</button>
        </form>

        <div className="service-admin-grid">
          {filtered.length===0?<div className="admin-note"><h3>No services found</h3><p>Add a service or change your search.</p></div>:
          filtered.map((item,index)=><article className="service-admin-card" key={item._id}>
            <div className="service-admin-top"><div className="service-admin-icon">{item.icon||"🏗️"}</div><span>0{index+1}</span></div>
            <h3>{item.title}</h3><p>{item.description}</p>
            <div className="service-admin-actions"><button type="button" onClick={()=>setSelected(item)}>👁 View</button><button type="button" className="service-delete" onClick={()=>del(item._id)}>🗑 Delete</button></div>
          </article>)}
        </div>
      </div>

      {selected&&<div className="content-detail-modal" onClick={()=>setSelected(null)}><div className="content-detail-card" onClick={e=>e.stopPropagation()}><button type="button" className="content-modal-close" onClick={()=>setSelected(null)}>✕</button><div className="service-admin-icon large">{selected.icon||"🏗️"}</div><span>SERVICE</span><h2>{selected.title}</h2><p>{selected.description}</p><button type="button" className="service-delete large-delete" onClick={()=>del(selected._id)}>🗑 Delete Service</button></div></div>}
    </AdminLayout>
  }

  if(type==="testimonials"){
    const ratings=[...new Set(items.map(item=>Number(item.rating||5)))].sort((a,b)=>b-a);
    const filtered=items.filter(item=>{
      const q=search.trim().toLowerCase();
      const matches=!q||[item.name,item.role,item.message].filter(Boolean).some(v=>String(v).toLowerCase().includes(q));
      return matches&&(filter==="All"||String(item.rating||5)===filter);
    });
    const stars=n=>"★".repeat(Math.max(0,Math.min(5,Number(n)||0)));

    return <AdminLayout title="Testimonials">
      <div className="content-management-head">
        <div><span>CLIENT FEEDBACK</span><h2>Testimonials</h2><p>Manage client feedback displayed on the public website.</p></div>
        <button className="dashboard-refresh" type="button" onClick={load}>↻ Refresh</button>
      </div>

      <div className="content-summary-grid">
        <div><span>⭐</span><div><b>{items.length}</b><small>Total Testimonials</small></div></div>
        <div><span>★</span><div><b>{items.length?((items.reduce((sum,x)=>sum+Number(x.rating||5),0)/items.length).toFixed(1)):"0.0"}</b><small>Average Rating</small></div></div>
        <div><span>🔎</span><div><b>{filtered.length}</b><small>Showing Now</small></div></div>
      </div>

      <div className="content-toolbar">
        <div className="content-search"><span>⌕</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search client, role or feedback..."/></div>
        <select value={filter} onChange={e=>setFilter(e.target.value)}><option value="All">All Ratings</option>{ratings.map(r=><option key={r} value={r}>{r} Stars</option>)}</select>
      </div>

      <div className="content-admin-layout">
        <form className="content-add-card" onSubmit={submit}>
          <span>ADD TESTIMONIAL</span><h3>New Client Feedback</h3>
          <label>Client Name *<input required value={form.name||""} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Client / Company name"/></label>
          <label>Role / Project<input value={form.role||""} onChange={e=>setForm({...form,role:e.target.value})} placeholder="e.g. Infrastructure Project"/></label>
          <label>Message *<textarea required rows="5" value={form.message||""} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Client feedback..."/></label>
          <label>Rating
            <select value={form.rating||5} onChange={e=>setForm({...form,rating:Number(e.target.value)})}><option value="5">★★★★★ 5</option><option value="4">★★★★☆ 4</option><option value="3">★★★☆☆ 3</option><option value="2">★★☆☆☆ 2</option><option value="1">★☆☆☆☆ 1</option></select>
          </label>
          {message&&<p className="form-status">{message}</p>}
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading?"Saving...":"Add Testimonial →"}</button>
        </form>

        <div className="testimonial-admin-grid">
          {filtered.length===0?<div className="admin-note"><h3>No testimonials found</h3><p>Add client feedback or change your search/filter.</p></div>:
          filtered.map(item=><article className="testimonial-admin-card" key={item._id}>
            <div className="testimonial-stars">{stars(item.rating||5)}</div>
            <p>“{item.message}”</p>
            <div className="testimonial-admin-person"><div>{(item.name||"C").charAt(0).toUpperCase()}</div><span><strong>{item.name}</strong><small>{item.role||"Client"}</small></span></div>
            <div className="testimonial-admin-actions"><button type="button" onClick={()=>setSelected(item)}>👁 View</button><button type="button" className="service-delete" onClick={()=>del(item._id)}>🗑 Delete</button></div>
          </article>)}
        </div>
      </div>

      {selected&&<div className="content-detail-modal" onClick={()=>setSelected(null)}><div className="content-detail-card testimonial-detail-card" onClick={e=>e.stopPropagation()}><button type="button" className="content-modal-close" onClick={()=>setSelected(null)}>✕</button><div className="testimonial-stars">{stars(selected.rating||5)}</div><span>CLIENT TESTIMONIAL</span><h2>{selected.name}</h2><small>{selected.role||"Client"}</small><p>“{selected.message}”</p><button type="button" className="service-delete large-delete" onClick={()=>del(selected._id)}>🗑 Delete Testimonial</button></div></div>}
    </AdminLayout>
  }

  return <AdminLayout title={title}>
    <div className="manager-grid">
      <form className="manager-form" onSubmit={submit}>
        <h2>Add New</h2>
        {fields.map(field=>{
          if(field==="image"&&isImageManager){
            return <div className="image-upload-box" key={field}><label>Select Image</label><input id={`${type}-image-input`} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleImageChange}/>{preview&&<div className="image-preview"><img src={preview} alt="Preview"/></div>}<small>JPG, PNG or WEBP • Maximum 5MB</small></div>
          }
          return <input key={field} required={field!=="description"&&field!=="location"&&field!=="category"&&field!=="role"} placeholder={field.replace(/[A-Z]/g,m=>" "+m).replace(/^./,m=>m.toUpperCase())} value={form[field]||""} onChange={e=>setForm({...form,[field]:e.target.value})}/>
        })}
        {message&&<p className="form-status">{message}</p>}
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading?(isImageManager?"Uploading...":"Saving..."):(isImageManager?"Upload & Add":"Add")}</button>
      </form>
      <div className="manager-list">{items.length===0&&<div className="admin-note"><h3>No items yet</h3><p>Add your first {type} from the form.</p></div>}{items.map(item=><article key={item._id}><div className="manager-item-content">{item.image&&<img src={resolveImageUrl(item.image)} alt={item.title||"Construction"}/>}<div><h3>{item.title||item.name}</h3><p>{item.description||item.message||item.category||item.role||""}</p>{item.location&&<small>📍 {item.location}</small>}</div></div><button className="danger" onClick={()=>del(item._id)}>Delete</button></article>)}</div>
    </div>
  </AdminLayout>
}
function App(){return <BrowserRouter><Routes><Route path="/" element={<Home/>}/><Route path="/admin/login" element={<Login/>}/><Route path="/admin/dashboard" element={<Protected><Dashboard/></Protected>}/><Route path="/admin/enquiries" element={<Protected><Enquiries/></Protected>}/><Route path="/admin/projects" element={<Protected><Manager type="projects" title="Projects" fields={['title','category','location','description','image']} defaults={{title:'',category:'',location:'',description:'',image:''}}/></Protected>}/><Route path="/admin/gallery" element={<Protected><Manager type="gallery" title="Gallery" fields={['title','category','image']} defaults={{title:'',category:'',image:''}}/></Protected>}/><Route path="/admin/services" element={<Protected><Manager type="services" title="Services" fields={['title','description','icon']} defaults={{title:'',description:'',icon:'🏗️'}}/></Protected>}/><Route path="/admin/testimonials" element={<Protected><Manager type="testimonials" title="Testimonials" fields={['name','role','message','rating']} defaults={{name:'',role:'',message:'',rating:5}}/></Protected>}/></Routes></BrowserRouter>}
export default App;

