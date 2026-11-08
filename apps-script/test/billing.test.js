// Billing + dashboard API tests against a fake Sheet and Calendar.
// Run: npm run test:script
process.env.TZ='America/Los_Angeles';
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const dir=path.resolve(__dirname,'..');
const sheets={};
function mkSheet(name){const data=[];const s={name,data,getLastRow:()=>data.length,getLastColumn:()=>Math.max(0,...data.map(r=>r.length)),
 getDataRange:()=>({getValues:()=>{const w=s.getLastColumn();return data.map(r=>{const x=r.slice();while(x.length<w)x.push('');return x;})}}),
 getRange:(r,c,nr,nc)=>({setValues:v=>{for(let i=0;i<nr;i++){data[r-1+i]=data[r-1+i]||[];for(let j=0;j<nc;j++)data[r-1+i][c-1+j]=v[i][j];}return{setFontWeight(){}}},
   getValues:()=>{const out=[];for(let i=0;i<nr;i++){const row=[];for(let j=0;j<nc;j++)row.push((data[r-1+i]||[])[c-1+j]??'');out.push(row);}return out;},setFontWeight(){}}),
 appendRow:r=>data.push(r.slice()),setFrozenRows(){}};sheets[name]=s;return s;}
let activeUser='owner@x.com';
const events=[];
const D=(s)=>new Date(s); // local time (TZ env = America/Los_Angeles)
const ev=(title,start,mins,color='')=>events.push({getId:()=>title+start,getTitle:()=>title,getStartTime:()=>D(start),getEndTime:()=>new Date(D(start).getTime()+mins*6e4),getColor:()=>color,isAllDayEvent:()=>false});
const ctx={console,JSON,Date,Object,String,parseInt,parseFloat,isNaN,Math,Array,RegExp,
 SpreadsheetApp:{getActive:()=>({getSheetByName:n=>sheets[n]||null,insertSheet:n=>mkSheet(n),getSheets:()=>Object.values(sheets),getUrl:()=>'SHEET',deleteSheet(){},toast(){}})},
 LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){}})},
 PropertiesService:{getScriptProperties:()=>({getProperty:()=>null,setProperty(){}})},
 Session:{getActiveUser:()=>({getEmail:()=>activeUser}),getEffectiveUser:()=>({getEmail:()=>'owner@x.com'})},
 Utilities:{formatDate:(d,tz,f)=>{const p=n=>String(n).padStart(2,'0');if(f==='yyyy-MM-dd')return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate());return d.toDateString();}},
 CalendarApp:{getDefaultCalendar:()=>({getEvents:(a,b)=>events.filter(e=>e.getStartTime()>=a&&e.getStartTime()<b)}),getCalendarById:()=>null},
 HtmlService:{createHtmlOutput:h=>({h}),createTemplateFromFile:()=>({evaluate:()=>({setTitle(){return this},addMetaTag(){return this},setFaviconUrl(){return this},ok:1})})},
 MailApp:{sendEmail(){}},ContentService:{createTextOutput:t=>({setMimeType:()=>t}),MimeType:{}}};
vm.createContext(ctx);
for(const f of ['Code.gs','Billing.gs','DashboardApp.gs']) vm.runInContext(fs.readFileSync(dir+'/'+f,'utf8'),ctx,{filename:f});
ctx.setup();
const set=(k,v)=>{const s=sheets.Settings.data;const r=s.find(x=>x[0]===k);r[1]=v;};
set('Tracking Start Date','2026-11-01'); set('Walk Color','');
const add=(tab,obj)=>{const h=sheets[tab].data[0];sheets[tab].data.push(h.map(k=>obj[k]??''));};
add('Clients',{'Client ID':'C0001',Status:'Active',Name:'Jane Smith',Phone:'425-555-1',Address:'1 A St'});
add('Clients',{'Client ID':'C0002',Status:'Active',Name:'Bob Jones',Phone:'425-555-2'});
add('Clients',{'Client ID':'C0003',Status:'Active',Name:'Cat Lady','Visit Rate':30});
add('Pets',{'Pet ID':'P1','Client ID':'C0001','Pet Name':'Buddy','Calendar Name':'Buddy',Species:'Dog',Active:'Yes','Pet Sheet':'https://docs.google.com/open?id=X'});
add('Pets',{'Pet ID':'P2','Client ID':'C0001','Pet Name':'Max','Calendar Name':'Max',Species:'Dog',Active:'Yes'});
add('Pets',{'Pet ID':'P3','Client ID':'C0001','Pet Name':'Rex','Calendar Name':'Rex',Species:'Dog',Active:'Yes'});
add('Pets',{'Pet ID':'P4','Client ID':'C0002','Pet Name':'Buddy','Calendar Name':'Buddy Jones',Species:'Dog',Active:'Yes'});
add('Pets',{'Pet ID':'P5','Client ID':'C0003','Pet Name':'Kona','Calendar Name':'Kona',Species:'Cat',Active:'Yes'});
add('Pets',{'Pet ID':'P6','Client ID':'C0003','Pet Name':'Old','Calendar Name':'Oldie',Species:'Dog',Active:'No'});

ev('Buddy walk','2026-10-30T10:00',45);              // before tracking start -> ignored
ev('Buddy','2026-11-02T10:00',45);                    // C1: 1 dog 45
ev('Buddy & Max & Rex','2026-11-03T10:00',45);        // C1: 3 dogs 45+3=48
ev('Buddy Jones','2026-11-03T11:00',45);              // C2 only (not C1's Buddy) 45
ev('Max','2026-11-04T10:00',45,'10');                  // C1 late cancel 22.50
ev('Buddy Jones','2026-11-05T10:00',45,'4');         // C2 cancelled 0
ev('Kona visit','2026-11-05T12:00',30);               // C3 cat with Visit Rate 30
ev('Dentist','2026-11-06T09:00',60);                  // unmatched
ev('Oldie','2026-11-06T10:00',45);                    // inactive pet -> unmatched
ev('Buddy','2026-11-26T10:00',45);                    // Thanksgiving 2026 (Nov 26) -> 55
ev('buddy','2026-12-03T10:00',45);                    // December (outside Nov period), case-insensitive
ev('Rexford','2026-11-07T10:00',45);                  // must NOT match Rex (whole word)

// Holidays sanity
const h26=ctx.holidaysPure_(2026); assert.equal(h26['2026-11-26'],'Thanksgiving'); assert.equal(h26['2026-04-05'],'Easter Sunday'); assert.equal(h26['2026-05-25'],'Memorial Day'); assert.equal(h26['2026-09-07'],'Labor Day');
assert.equal(ctx.holidaysPure_(2027)['2027-03-28'],'Easter Sunday');

// Pretend "now" is Dec 10 by computing directly
const cfg=ctx.billingConfig_(); assert.equal(cfg.lateCancelColor,'10');
assert.equal(+cfg.trackingStart, +new Date(2026,10,1));
const data=ctx.loadBillingData_(new Date(2026,9,1), new Date(2027,0,1));
const now=new Date('2026-12-10T00:00');
const res=ctx.computeVisitsPure_(data, now, ctx.dayKey_);
const show=res.visits.map(v=>`${v.day} ${v.clientId} ${v.pets.join('+')} ${v.status} ${v.amount}${v.holiday?' '+v.holiday:''}`);
console.log(show.join('\n')); console.log('unmatched:',res.unmatched.map(u=>u.title));
const amt=(day,cid)=>res.visits.find(v=>v.day===day&&v.clientId===cid).amount;
assert.equal(res.visits.filter(v=>v.day==='2026-10-30').length,0);
assert.equal(amt('2026-11-02','C0001'),45);
assert.equal(amt('2026-11-03','C0001'),48);
assert.equal(res.visits.filter(v=>v.day==='2026-11-03'&&v.clientId==='C0002').length,1);
assert.equal(res.visits.filter(v=>v.day==='2026-11-03'&&v.clientId==='C0001')[0].pets.length,3);
assert.equal(amt('2026-11-04','C0001'),22.5);
assert.equal(amt('2026-11-05','C0002'),0);
assert.equal(amt('2026-11-05','C0003'),30);
assert.equal(amt('2026-11-26','C0001'),55);
assert.deepEqual(res.unmatched.map(u=>u.title).sort(),['Dentist','Oldie','Rexford']);
const sum=ctx.summarizePure_(data.clients,res.visits,[{ 'Client ID':'C0001',Amount:'100'}],new Date(2026,10,1),new Date(2026,11,1));
const c1=sum.find(r=>r.clientId==='C0001');
console.log('C1 period',c1.period.charges,'completed',c1.period.completed,'late',c1.period.lateCancels,'total',c1.totalCharged,'paid',c1.totalPaid,'bal',c1.balance);
assert.equal(c1.period.charges,45+48+22.5+55); assert.equal(c1.totalCharged,45+48+22.5+55+45); assert.equal(c1.balance,215.5-100);
const inv=ctx.invoiceTextPure_(c1,'Nov 2026',cfg);console.log('--- invoice ---\n'+inv);assert.ok(inv.includes('Credit: $100.00'));assert.ok(inv.includes('Amount due: $70.50'));

// API + auth
const o=ctx.api_overview(); console.log('overview ok; clients',o.clients.length,'upcoming',o.upcoming.length);
JSON.stringify(o); // must be serializable
const b=ctx.api_billing('2026-11-01','2026-11-30'); console.log('billing total',b.totalCharges,'rows',b.rows.map(r=>r.name+':'+r.charges),'unmatched',b.unmatched.length);
assert.equal(b.totalCharges, 115.5+45+30); // real now = Nov 7, later visits Scheduled
const p=ctx.api_recordPayment({clientId:'C0002',amount:'45',date:'2026-11-20',method:'Check'}); assert.equal(p.paymentId,'PAY0001');
const p2=ctx.api_recordPayment({clientId:'C0002',amount:'5',method:'Cash'}); assert.equal(p2.paymentId,'PAY0002');
assert.throws(()=>ctx.api_recordPayment({clientId:'C0002',amount:'-5'}));
activeUser=''; // anonymous on public deployment
assert.throws(()=>ctx.api_overview(),/Not authorized/); assert.throws(()=>ctx.api_billing('2026-11-01','2026-11-30'),/Not authorized/); assert.throws(()=>ctx.api_recordPayment({clientId:'C0002',amount:'1'}),/Not authorized/);
assert.ok(ctx.doGet().h.includes('Not authorized'));
activeUser='stranger@x.com'; assert.throws(()=>ctx.api_overview(),/Not authorized/);
activeUser='OWNER@x.com'; assert.ok(ctx.doGet().ok);
console.log('\nALL ASSERTIONS PASSED');
// --- Walk Color filter ---
activeUser='owner@x.com';
set('Walk Color','raspberry-label');
events.length=0;
ev('Buddy','2026-11-02T10:00',45,'raspberry-label');  // walk
ev('Buddy','2026-11-02T15:00',45,'');                 // default color personal -> ignored
ev('Max','2026-11-03T10:00',45,'10');                  // late cancel still counts
ev('Dentist','2026-11-03T12:00',60,'');               // ignored, not unmatched
ev('Typo walk','2026-11-04T10:00',45,'raspberry-label'); // walk color but no pet -> unmatched
const d2=ctx.loadBillingData_(new Date(2026,9,1), new Date(2027,0,1));
const r2=ctx.computeVisitsPure_(d2,new Date('2026-12-10T00:00'),ctx.dayKey_);
console.log(r2.visits.map(v=>v.day+' '+v.pets+' '+v.status+' '+v.amount), r2.unmatched.map(u=>u.title));
assert.equal(r2.visits.length,2); assert.deepEqual(r2.unmatched.map(u=>u.title),['Typo walk']);
set('Walk Color','');
console.log('WALK COLOR ASSERTIONS PASSED');
