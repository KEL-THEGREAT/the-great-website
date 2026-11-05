// the great: page logic. Settings are in config.js.
let pending = false, vals = null;
class DCLogic {
  constructor() { this.props = CONFIG; this.state = {}; }
  setState(p) { this.state = Object.assign({}, this.state, p); schedule(); }
}
class Component extends DCLogic {
renderVals() {
const s = this.state || {};
const price = Number(this.props.price ?? 25);
const money = n => '£' + (Number.isInteger(n) ? n : n.toFixed(2));
const P = [
{id:'dad', name:'Dad Cap', color:'Black', fill:'#14161A', seam:'#fff'},
{id:'snap', name:'Snapback', color:'Sand', fill:'#C9B28A', seam:'#000'},
{id:'truck', name:'Trucker', color:'Forest', fill:'#2F4A3A', seam:'#fff'},
{id:'panel', name:'5-Panel', color:'Navy', fill:'#1F2F5C', seam:'#fff'}];
const cat = s.cat || 'all';
const faqOpen = s.faq === undefined ? 0 : s.faq;
const go = () => { const e = document.getElementById('shop'); if (e) e.scrollIntoView({behavior: 'smooth'}); };
const cats = [{id:'all', label:'All'}].concat(P.map(p => ({id:p.id, label:p.name}))).map(c => ({
id: c.id, label: c.label, on: cat === c.id,
bg: cat === c.id ? '#14161A' : 'transparent', fg: cat === c.id ? '#F6F6F3' : '#14161A',
pick: () => this.setState({cat: c.id})}));
const shopMenu = [{id:'all', label:'All caps'}].concat(P.map(p => ({id:p.id, label:p.name + 's'}))).map(c => ({
label: c.label, go: () => { this.setState({cat: c.id, menu: null}); go(); }}));
const collMenu = ['New arrivals', 'Best sellers', 'Limited drops'].map(l => ({
label: l, go: () => { this.setState({cat: 'all', menu: null}); go(); }}));
const items = P.map(p => Object.assign({}, p, {
priceLabel: money(price),
cls: 'cap cap-' + {dad:'black', snap:'sand', truck:'forest', panel:'navy'}[p.id],
display: (cat === 'all' || cat === p.id) ? 'block' : 'none',
view: () => this.setState({open: p.id, added: false, swatch: null})}));
const faqs = [
{q:'Shipping and returns', a:'[Add your shipping and returns policy]'},
{q:'How do I find my size?', a:'[Add sizing guidance]'},
{q:'What are the caps made from?', a:'[Add materials and care]'}].map((f, i) => Object.assign({}, f, {
open: faqOpen === i, mark: faqOpen === i ? '\u2212' : '+',
toggle: () => this.setState({faq: faqOpen === i ? -1 : i})}));
const acc = this.props.accent ?? '#6B1D3A';
const SW = [{name:'Black', fill:'#14161A', seam:'#fff'}, {name:'Sand', fill:'#C9B28A', seam:'#000'}, {name:'Forest', fill:'#2F4A3A', seam:'#fff'}, {name:'Navy', fill:'#1F2F5C', seam:'#fff'}, {name:'Burgundy', fill:acc, seam:'#fff'}];
const sw = (s.swatch === null || s.swatch === undefined) ? null : SW[s.swatch];
const baseP = P.find(p => p.id === s.open) || P[0];
const KEYS = {dad:'black', snap:'sand', truck:'forest', panel:'navy'};
const cur = Object.assign({}, baseP, sw ? {fill: sw.fill, seam: sw.seam, color: sw.name} : {}, {priceLabel: money(price), cls: 'cap cap-' + (sw ? sw.name.toLowerCase() : KEYS[baseP.id])});
const swatches = SW.map((w, i) => Object.assign({}, w, {on: sw === w, ring: sw === w ? '#14161A' : 'transparent', pick: () => this.setState({swatch: i})}));
const rawLines = s.lines || [];
const lines = rawLines.map((l, i) => Object.assign({}, l, {priceLabel: money(price), remove: () => this.setState({lines: rawLines.filter((_, k) => k !== i)})}));
const R = [{quote:'[Customer review one]', who:'[Customer name]'}, {quote:'[Customer review two]', who:'[Customer name]'}, {quote:'[Customer review three]', who:'[Customer name]'}];
const ri = s.rev || 0;
return {
accent: this.props.accent ?? '#6B1D3A',
cart: rawLines.length,
subtotal: money(price * rawLines.length),
hasCart: rawLines.length > 0,
shopOpen: s.menu === 'shop', collOpen: s.menu === 'coll',
toggleShop: () => this.setState({menu: s.menu === 'shop' ? null : 'shop'}),
toggleColl: () => this.setState({menu: s.menu === 'coll' ? null : 'coll'}),
shopMenu: shopMenu, collMenu: collMenu, cats: cats, items: items,
viewAll: () => this.setState({cat: 'all'}),
modalOpen: !!s.open, cur: cur,
close: () => this.setState({open: null}),
add: () => this.setState({lines: rawLines.concat([{name: cur.name, color: cur.color}]), added: true}),
addLabel: s.added ? 'Added. Add another' : 'Add to cart',
faqs: faqs, swatches: swatches, lines: lines, cartEmpty: rawLines.length === 0, cartOpen: !!s.cartOpen,
openCart: () => this.setState({cartOpen: true}), closeCart: () => this.setState({cartOpen: false}),
viewSig: () => this.setState({open: 'snap', added: false, swatch: null}),
rv: R[ri], rvCount: (ri + 1) + ' / ' + R.length,
rvPrev: () => this.setState({rev: (ri + R.length - 1) % R.length}), rvNext: () => this.setState({rev: (ri + 1) % R.length}), joined: !!s.joined, badEmail: !!s.badEmail, failed: !!s.failed,
join: () => {
const el = document.getElementById('email');
const v = ((el && el.value) || '').trim().toLowerCase();
if (v.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || !/^[a-z0-9._+@~:-]+$/.test(v)) { this.setState({joined: false, failed: false, badEmail: true}); return; }
if (!CONFIG.signupEndpoint) { this.setState({joined: true, failed: false, badEmail: false}); return; }
this.setState({badEmail: false, failed: false});
fetch(CONFIG.signupEndpoint, {method: 'POST', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}, body: JSON.stringify({email: v})})
.then(r => { if (!r.ok) throw new Error('bad response'); this.setState({joined: true}); })
.catch(() => this.setState({joined: false, failed: true}));
}
};
}
}

const app = new Component();
const HOLE = /\{\{\s*([\w$.]+)\s*\}\}/g, ONE = /^\s*\{\{\s*([\w$.]+)\s*\}\}\s*$/;
const get = (scope, path) => { let v = scope; for (const k of path.split('.')) { if (v == null) return undefined; v = v[k]; } return v; };
const interp = (s, scope) => s.replace(HOLE, (m, p) => { const v = get(scope, p); return v == null ? '' : String(v); });
function build(node, scope, out) {
  if (node.nodeType === 3) { out.appendChild(document.createTextNode(interp(node.nodeValue, scope))); return; }
  if (node.nodeType !== 1) return;
  const tag = node.localName;
  if (tag === 'sc-if') { const m = ONE.exec(node.getAttribute('value') || ''); if (m && get(scope, m[1])) for (const c of node.childNodes) build(c, scope, out); return; }
  if (tag === 'sc-for') {
    const m = ONE.exec(node.getAttribute('list') || ''), list = (m && get(scope, m[1])) || [], as = node.getAttribute('as');
    for (const item of list) { const s = Object.create(scope); s[as] = item; for (const c of node.childNodes) build(c, s, out); }
    return;
  }
  const el = document.createElementNS(node.namespaceURI, node.localName);
  for (const at of node.attributes) {
    const name = at.name, value = at.value;
    if (name.indexOf('hint-placeholder') === 0) continue;
    const m = ONE.exec(value);
    if (name === 'data-click') { const f = m && get(scope, m[1]); if (typeof f === 'function') el.onclick = f; continue; }
    if (m) { const v = get(scope, m[1]); if (v != null) el.setAttribute(name, String(v)); continue; }
    el.setAttribute(name, interp(value, scope));
  }
  for (const c of node.childNodes) build(c, scope, el);
  out.appendChild(el);
}
function patch(oldEl, newEl) {
  const nl = Array.from(newEl.childNodes);
  nl.forEach((n, i) => {
    const o = oldEl.childNodes[i];
    if (!o) { oldEl.appendChild(n); return; }
    if (o.nodeType !== n.nodeType || (n.nodeType === 1 && (o.localName !== n.localName || o.namespaceURI !== n.namespaceURI))) { oldEl.replaceChild(n, o); return; }
    if (n.nodeType === 3) { if (o.nodeValue !== n.nodeValue) o.nodeValue = n.nodeValue; return; }
    for (const at of Array.from(o.attributes)) if (!n.hasAttribute(at.name)) o.removeAttribute(at.name);
    for (const at of Array.from(n.attributes)) if (o.getAttribute(at.name) !== at.value) o.setAttribute(at.name, at.value);
    o.onclick = n.onclick;
    patch(o, n);
  });
  while (oldEl.childNodes.length > nl.length) oldEl.removeChild(oldEl.lastChild);
}
const root = document.getElementById('root'), tpl = document.getElementById('tpl').content;
function render() {
  pending = false;
  vals = app.renderVals();
  const next = document.createElement('div');
  for (const c of tpl.childNodes) build(c, vals, next);
  patch(root, next);
}
function schedule() { if (!pending) { pending = true; queueMicrotask(render); } }
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target && e.target.id === 'email' && vals) vals.join();
  if (e.key === 'Escape') app.setState({open: null, cartOpen: false, menu: null});
});
render();
