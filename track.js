(() => {
 const form=document.getElementById('trackForm'), result=document.getElementById('result');
 const show=(html)=>{result.innerHTML=html;result.classList.remove('hidden')};
 form.addEventListener('submit',async e=>{
  e.preventDefault(); const code=document.getElementById('code').value.trim();
  if(!window.QDE_CONFIG || !QDE_CONFIG.SUPABASE_URL || QDE_CONFIG.SUPABASE_URL.includes('YOUR-PROJECT')) return show('<p class="error">Website setup is incomplete. Please contact Quick Delivery Express.</p>');
  show('<p class="muted">Looking up your shipment…</p>');
  try{
   const client=window.supabase.createClient(QDE_CONFIG.SUPABASE_URL,QDE_CONFIG.SUPABASE_PUBLISHABLE_KEY);
   const {data,error}=await client.rpc('public_track_shipment',{tracking_code:code});
   if(error) throw error;
   if(!data || !data.length) return show('<h2>No shipment found</h2><p>Please check the tracking number and try again. If the problem continues, contact our team.</p>');
   const s=data[0], date=s.estimated_delivery?new Date(s.estimated_delivery+'T00:00:00').toLocaleDateString(): 'Not yet provided';
   show(`<div class="status-top"><span class="eyebrow">SHIPMENT STATUS</span><span class="status-pill">${escapeHtml(s.status_label||'Update pending')}</span></div><h2>${escapeHtml(s.tracking_number)}</h2><div class="route"><div><small>ORIGIN</small><b>${escapeHtml(s.origin_country)}</b></div><span>→</span><div><small>DESTINATION</small><b>${escapeHtml(s.destination_country)}</b></div></div><div class="detail-grid"><div><small>LAST REPORTED LOCATION</small><b>${escapeHtml(s.latest_location||'Update pending')}</b></div><div><small>ESTIMATED DELIVERY</small><b>${escapeHtml(date)}</b></div><div><small>LAST UPDATED</small><b>${s.updated_at?new Date(s.updated_at).toLocaleString():'Not available'}</b></div></div>${s.public_note?`<p class="note">${escapeHtml(s.public_note)}</p>`:''}<p class="muted">Tracking information is manually updated by our operations team.</p>`);
  }catch(err){show('<p class="error">We could not retrieve this shipment. Please try again later or contact our team.</p>');console.error(err)}
 });
 function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
 const params=new URLSearchParams(location.search); if(params.get('code')){document.getElementById('code').value=params.get('code');form.requestSubmit()}
})();