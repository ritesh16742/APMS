'use client';
export default function Modal({title,children,onClose}){return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className="modal"><div className="modal-head"><div><div className="eyebrow">APMS RECORD</div><h3>{title}</h3></div><button className="icon-btn" onClick={onClose}>×</button></div>{children}</div></div>}
