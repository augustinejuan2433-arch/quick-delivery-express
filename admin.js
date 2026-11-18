(() => {
 const $=id=>document.getElementById(id), statusOptions=['Shipment registered','Picked up','In transit','Out for delivery','Delivered'];
 const countries=['United States','United Kingdom','Canada','Australia','New Zealand','Germany','France','Netherlands','Belgium','Spain','Italy','Ireland','Switzerland','Sweden','Norway','Denmark','Finland','Poland','Portugal','Japan','Singapore','South Korea','China','India','United Arab Emirates','Saudi Arabia','Qatar','Turkey','Mexico','Brazil'];
 ['origin_country','destination_country'].forEach(id=>{ $(id).innerHTML='<option value="">Choose country</option>'+countries.map(c=>`<option>${c}</option>`).join('') });
 if(!window.QDE_CONFIG || QDE_CONFIG.SUPABASE_URL.includes('YOUR-PROJECT')) { $('loginMessage').textContent='Admin setup is incomplete. Configure config.js first.'; return; }
 const db=window.supabase.createClient(QDE_CONFIG.SUPABASE_URL,QDE_CONFIG.SUPABASE_PUBLISHABLE_KEY);
 const loginPanel=$('loginPanel'), dashboard=$('dashboard');
 async function check(){const {data:{session}}=await db.auth.getSession(); loginPanel.classList.toggle('hidden',!!session);dashboard.classList.toggle('hidden',!session);if(session)loadShipments()}
 $('loginForm').addEventListener('submit',async e=>{e.preventDefault();$('loginMessage').textContent='Signing in…';const {error}=await db.auth.signInWithPassword({email:$('email').value,password:$('password').value});$('loginMessage').textContent=error?'Sign-in failed. Check your email and password.':'';if(!error)check()});
 $('logout').onclick=async()=>{await db.auth.signOut();check()};
 $('refresh').onclick=loadShipments;
 $('shipmentForm').addEventListener('submit',async e=>{
  e.preventDefault();$('createMessage').textContent='Saving shipment…';
  const payload={sender_name:$('sender_name').value.trim(),sender_email:$('sender_email').value.trim()||null,recipient_name:$('recipient_name').value.trim(),recipient_email:$('recipient_email').value.trim()||null,recipient_phone:$('recipient_phone').value.trim()||null,origin_country:$('origin_country').value,destination_country:$('destination_country').value,estimated_delivery:$('estimated_delivery').value||null,latest_location:$('latest_location').value.trim()||null,public_note:$('public_note').value.trim()||null};
  const {data,error}=await db.from('shipments').insert(payload).select('tracking_number').single();
  if(error){$('createMessage').textContent='Could not create shipment. Check database setup and staff access.';console.error(error);return}
  $('createMessage').innerHTML='Shipment created. Tracking number: <b>'+esc(data.tracking_number)+'</b> <button type="button" class="copy-small" id="copyCode">Copy</button>';
  $('copyCode').onclick=()=>navigator.clipboard?.writeText(data.tracking_number);$('shipmentForm').reset();loadShipments();
 });
 async function loadShipments(){
  $('shipments').innerHTML='<p class="muted">Loading…</p>';
  const {data,error}=await db.from('shipments').select('tracking_number,recipient_name,destination_country,status_label,latest_location,updated_at').order('created_at',{ascending:false}).limit(50);
  if(error){$('shipments').innerHTML='<p class="error">Could not load shipments. Check staff permissions.</p>';console.error(error);return}
  if(!data.length){$('shipments').innerHTML='<p class="muted">No shipments registered yet.</p>';return}
  $('shipments').innerHTML=data.map(s=>`<article class="shipment-row"><div><b>${esc(s.tracking_number)}</b><span>${esc(s.recipient_name)} · ${esc(s.destination_country)}</span><small>${esc(s.latest_location||'Location pending')} · ${new Date(s.updated_at).toLocaleString()}</small></div><div class="update-controls"><select data-status="${esc(s.tracking_number)}">${statusOptions.map(o=>`<option ${o===s.status_label?'selected':''}>${o}</option>`).join('')}</select><input data-location="${esc(s.tracking_number)}" placeholder="New location" value="${esc(s.latest_location||'')}"><input data-note="${esc(s.tracking_number)}" placeholder="Public note" aria-label="Public note"><button class="button gold small" data-save="${esc(s.tracking_number)}">Save update</button></div></article>`).join('');
  $('shipments').querySelectorAll('[data-save]').forEach(btn=>btn.onclick=async()=>{
   const n=btn.dataset.save, status=$(`[data-status="${CSS.escape(n)}"]`).value, location=$(`[data-location="${CSS.escape(n)}"]`).value.trim()||null, note=$(`[data-note="${CSS.escape(n)}"]`).value.trim()||null;
   btn.disabled=true;const {error}=await db.from('shipments').update({status_label:status,latest_location:location,public_note:note,updated_at:new Date().toISOString()}).eq('tracking_number',n);
   btn.disabled=false;if(error){alert('Update failed. Please try again.');console.error(error)}else{alert('Shipment tracking updated.');loadShipments()}
  });
 }
 function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
 check();
})();