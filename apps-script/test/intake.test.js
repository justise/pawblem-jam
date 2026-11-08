// Intake (website forms) tests against a fake Sheet/Docs/Drive.
// Run: npm run test:script
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const sheets={};
function mkSheet(name){const data=[];const s={name,data,
 getLastRow:()=>data.length,getLastColumn:()=>Math.max(0,...data.map(r=>r.length)),
 getDataRange:()=>({getValues:()=>{const w=s.getLastColumn();return data.map(r=>{const x=r.slice();while(x.length<w)x.push('');return x;})}}),
 getRange:(r,c,nr,nc)=>({setValues:v=>{for(let i=0;i<nr;i++){data[r-1+i]=data[r-1+i]||[];for(let j=0;j<nc;j++)data[r-1+i][c-1+j]=v[i][j];}return{setFontWeight(){}}},
   getValues:()=>{const out=[];for(let i=0;i<nr;i++){const row=[];for(let j=0;j<nc;j++)row.push((data[r-1+i]||[])[c-1+j]??'');out.push(row);}return out;},setFontWeight(){}}),
 appendRow:r=>data.push(r.slice()),setFrozenRows(){}};sheets[name]=s;return s;}
const props={};const mails=[];let docN=0;
const txt={setItalic(){return txt},setBold(){return txt}};const para={setText(){return null},setHeading(){return para},editAsText(){return txt}};
const cell={setWidth(){return cell},setBackgroundColor(){return cell},editAsText(){return{setBold(){}}}};
const ctx={console,JSON,Date,Object,String,parseInt,Math,
 SpreadsheetApp:{getActive:()=>({getSheetByName:n=>sheets[n]||null,insertSheet:n=>mkSheet(n),getSheets:()=>Object.values(sheets),getUrl:()=>'SHEET_URL',deleteSheet(){},toast(){}})},
 LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){}})},
 PropertiesService:{getScriptProperties:()=>({getProperty:k=>props[k]||null,setProperty:(k,v)=>props[k]=v})},
 MailApp:{sendEmail:m=>mails.push(m)},Session:{getEffectiveUser:()=>({getEmail:()=>'me'})},
 ContentService:{createTextOutput:t=>({t,setMimeType(){return t}}),MimeType:{JSON:1}},
 Utilities:{formatDate:()=>'Nov 7, 2026'},
 DriveApp:{createFolder:()=>({getId:()=>'F1'}),getFolderById:()=>({isTrashed:()=>false}),getFileById:()=>({moveTo(){},isTrashed:()=>false})},
 DocumentApp:{ParagraphHeading:{},create:t=>{const id='DOC'+(++docN);return mkDoc(id)},openById:id=>mkDoc(id)}};
function mkDoc(id){let closed=false;return{getId:()=>id,setName(){},getUrl:()=>{if(closed)throw new Error('Document is closed');return 'https://docs.google.com/open?id='+id},saveAndClose(){closed=true},
 getBody:()=>({clear(){},setMarginTop(){return this},setMarginBottom(){return this},setMarginLeft(){return this},setMarginRight(){return this},getParagraphs:()=>[para],appendParagraph:()=>para,
 appendTable:c=>({setBorderColor(){},getNumRows:()=>c.length,getCell:()=>cell})})}}
vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.resolve(__dirname,'..','Code.gs'),'utf8'),ctx);
const call=(action,data)=>JSON.parse(ctx.doPost({postData:{contents:JSON.stringify({secret:"s",action,data})}}));
props.SHARED_SECRET='s';
ctx.setup();
const layout={household:[{title:'Your Information',columns:['Name','Phone']}],pet:{Dog:[{title:'About',columns:['Age']}],Cat:[]}};
const tbl=n=>{const [h,...r]=sheets[n].data;return r.map(x=>Object.fromEntries(h.map((k,i)=>[k,x[i]])))};
let r;
r=call('serviceRequest',{name:'Jane Smith',email:'Jane@x.com',phone:'111'}); console.log('request',r);
r=call('intakeForms',{client:{Name:'Jane Smith',Email:'jane@x.com',Phone:'+1 222','Vet Name':'=HYPERLINK("evil")'},pets:[{'Pet Name':'Buddy',Species:'Dog',Age:'3'},{'Pet Name':'Kona',Species:'Cat'}],layout}); console.log('intake1',r);
r=call('intakeForms',{client:{Name:'Jane Smith',Email:'jane@x.com',Phone:'333'},pets:[{'Pet Name':'buddy',Species:'Dog',Age:'4'}],layout}); console.log('intake2 (resubmit)',r);
r=call('intakeForms',{client:{Name:'Bob & Sue Jones',Email:'bob@x.com',Phone:'444'},pets:[{'Pet Name':'Buddy',Species:'Dog'}],layout}); console.log('intake3 (dup name)',r);
r=call('intakeForms',{client:{Name:'X',Email:'x@x.com'},pets:[]}); 
console.log('bad secret',JSON.parse(ctx.doPost({postData:{contents:"{\"secret\":\"no\"}"}})));
console.table(tbl('Clients').map(c=>({id:c['Client ID'],st:c.Status,name:c.Name,phone:c.Phone,vet:c['Vet Name'],forms:!!c['Forms Submitted']})));
console.table(tbl('Pets').map(p=>({id:p['Pet ID'],client:p['Client ID'],name:p['Pet Name'],cal:p['Calendar Name'],sp:p.Species,age:p.Age,sheet:p['Pet Sheet']})));
console.log('Pets headers:',sheets.Pets.data[0].join(' | '));
const pets=tbl('Pets');
assert.deepEqual(pets.map(p=>p['Calendar Name']),['Buddy','Kona','Buddy Jones']);
assert.equal(pets[0]['Pet Sheet'],pets[0]['Pet Sheet']&&pets[0]['Pet Sheet']); assert.ok(String(pets[0]['Pet Sheet']).includes('open?id=DOC1'));
assert.equal(docN,3,'resubmission must reuse the existing Doc');
assert.equal(tbl('Clients')[0]['Vet Name'],"'=HYPERLINK(\"evil\")");
assert.ok(mails[mails.length-2].body.includes('Buddy Jones'));
console.log('INTAKE ASSERTIONS PASSED');
