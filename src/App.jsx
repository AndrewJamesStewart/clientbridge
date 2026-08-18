import { useState, useRef } from "react";

const NAV = ["Dashboard","Clients","Onboarding","Submissions","Workflows","Offboarding"];

const SUBMISSION_TYPES = [
  { id:"cipc_ar", label:"CIPC Annual Return", category:"CIPC", freq:"Annual" },
  { id:"cipc_bo", label:"Beneficial Ownership Register", category:"CIPC", freq:"Annual" },
  { id:"itr14", label:"Income Tax Return (ITR14)", category:"SARS", freq:"Annual" },
  { id:"vat201", label:"VAT Return (VAT201)", category:"SARS", freq:"Monthly/Bi-monthly" },
  { id:"emp201", label:"PAYE Return (EMP201)", category:"SARS", freq:"Monthly" },
  { id:"irp6", label:"Provisional Tax (IRP6)", category:"SARS", freq:"Bi-annual" },
  { id:"emp501", label:"Annual Employer Reconciliation (EMP501)", category:"SARS", freq:"Annual" },
];

const PIPELINE_STAGES = ["Lead","Onboarding","Active","Review","Offboarding","Closed"];
const SHARE_CLASSES = ["Ordinary","Preference","Class A","Class B","Class C"];
const BO_CONTROL_TYPES = ["Direct ownership","Indirect ownership","Voting rights","Right to appoint directors","Other significant influence"];
const DIRECTOR_ROLES = ["Director","Non-executive Director","CEO","CFO","COO","Company Secretary","Public Officer"];
const ORG_TYPES = ["Sole Proprietor","Private Company (Pty) Ltd","Public Company Ltd","Non-Profit Organisation (NPO)","Non-Profit Company (NPC)","Government Agency","ESD (Enterprise & Supplier Development)"];

const DOC_CATEGORIES = {
  "CIPC & Registration": ["Certificate of Incorporation","COR14.3 – Memorandum of Incorporation","COR15.1A – Notice of Incorporation","CIPC Annual Return Confirmation","Beneficial Ownership Register Submission","Share Register","CM29 – Director Details"],
  "SARS & Tax": ["Income Tax Registration (IT150)","VAT Registration (VAT103)","PAYE Registration (EMP101)","UIF Registration","COID/SDL Registration","Latest ITR14 Assessment","Latest VAT201 Submission","Tax Clearance Certificate (TCC/PIN)"],
  "Identity & KYC": ["Director ID / Passport Copies","Shareholder ID / Passport Copies","Proof of Address (not older than 3 months)","FICA Questionnaire","Source of Funds Declaration","PEP Declaration"],
  "Financial": ["Latest Annual Financial Statements","Latest Management Accounts","Bank Statements (3 months)","Auditor / Accountant Engagement Letter"],
  "B-BBEE & Compliance": ["B-BBEE Certificate","B-BBEE Affidavit (EME/QSE)","FSP Licence","Legal Practice Council Certificate","Tax Practitioner Registration"],
  "Correspondence": ["Onboarding Letter","Engagement Letter","Fee Schedule","Offboarding Letter"],
};

const STATUS_COLORS = {
  Submitted:"#15803d","In Progress":"#1d4ed8",Pending:"#92400e",Overdue:"#991b1b",
  Active:"#15803d",Onboarding:"#1d4ed8",Lead:"#7c3aed",Review:"#92400e",Offboarding:"#c2410c",Closed:"#374151"
};
const STATUS_BG = {
  Submitted:"#dcfce7","In Progress":"#dbeafe",Pending:"#fef3c7",Overdue:"#fee2e2",
  Active:"#dcfce7",Onboarding:"#dbeafe",Lead:"#ede9fe",Review:"#fef3c7",Offboarding:"#ffedd5",Closed:"#f3f4f6"
};

const NAVY="#0f2744", GOLD="#c9a84c";

function Badge({s,label}){
  return <span style={{background:STATUS_BG[s]||"#f3f4f6",color:STATUS_COLORS[s]||"#374151",padding:"2px 10px",borderRadius:20,fontSize:12,fontWeight:500}}>{label||s}</span>;
}
function Logo(){
  return <div style={{display:"flex",alignItems:"center",gap:10}}>
    <div style={{width:36,height:36,borderRadius:8,background:GOLD,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <span style={{color:NAVY,fontWeight:700,fontSize:16}}>CB</span>
    </div>
    <div>
      <div style={{color:"#fff",fontWeight:600,fontSize:15,lineHeight:1}}>ClientBridge</div>
      <div style={{color:"#94a3b8",fontSize:11}}>Consulting Practice Management</div>
    </div>
  </div>;
}
function PageHeader({title,subtitle,action}){
  return <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
    <div>
      <h1 style={{margin:0,fontSize:22,fontWeight:600,color:NAVY}}>{title}</h1>
      {subtitle&&<p style={{margin:"4px 0 0",color:"#64748b",fontSize:13}}>{subtitle}</p>}
    </div>
    {action}
  </div>;
}
function Field({label,value,onChange,type="text",options,placeholder}){
  const s={width:"100%",padding:"8px 12px",border:"1px solid #e2e8f0",borderRadius:6,fontSize:13,boxSizing:"border-box"};
  return <div>
    <label style={{fontSize:12,fontWeight:500,color:"#64748b",display:"block",marginBottom:4}}>{label}</label>
    {options?<select value={value||""} onChange={e=>onChange(e.target.value)} style={s}>
      <option value="">Select…</option>
      {options.map(o=><option key={o}>{o}</option>)}
    </select>:<input type={type} value={value||""} onChange={e=>onChange(e.target.value)} style={s} placeholder={placeholder||""} />}
  </div>;
}

const emptyOnboard = {
  tradingName:"",regName:"",regNumber:"",orgType:"",incorporatedDate:"",stage:"Lead",
  yearEnd:"",financialYearEnd:"",industry:"",sicCode:"",pic:"",bbee:"",
  incomeTaxNo:"",vatNo:"",payeNo:"",uifNo:"",sdlNo:"",
  bank:"",accountNo:"",branchCode:"",swiftCode:"",licences:[],
  regAddress:"",tradingAddress:"",holdingCompany:"",ultimateParent:"",
  shareholders:[],beneficialOwners:[],directors:[],submissions:[],
};

export default function App(){
  const [nav,setNav]=useState("Dashboard");
  const [clients,setClients]=useState([
    {id:1,tradingName:"Novus Retail (Pty) Ltd",regName:"Novus Retail (Pty) Ltd",regNumber:"2019/123456/07",orgType:"Private Company (Pty) Ltd",incorporatedDate:"2019-03-01",stage:"Active",yearEnd:"28 Feb",industry:"Retail Trade",pic:"Medium (350-500)",bbee:"Level 2",bank:"FNB",accountNo:"62XXXXXXX",branchCode:"250655",incomeTaxNo:"9012345678",vatNo:"4012345678",payeNo:"7012345678",regAddress:"12 Main Road, Cape Town, 8001",tradingAddress:"Same as registered",shareholders:[{name:"John Mokoena",idNo:"8001015800080",nationality:"South African",pct:60,shareClass:"Ordinary",shares:600},{name:"Lisa van der Berg",idNo:"8503230056087",nationality:"South African",pct:40,shareClass:"Ordinary",shares:400}],beneficialOwners:[{name:"John Mokoena",idNo:"8001015800080",nationality:"South African",pct:60,controlType:"Direct ownership",pepStatus:"No",dateBecame:"2019-03-01"}],directors:[{name:"John Mokoena",idNo:"8001015800080",role:"Director",appointDate:"2019-03-01",resident:"Yes",email:"john@novus.co.za",phone:"0821234567",incomeTaxNo:"9098765432",pepStatus:"No"}],submissions:[{type:"cipc_ar",status:"Submitted",due:"2024-06-30",submitted:"2024-06-15",notes:""},{type:"cipc_bo",status:"Pending",due:"2024-09-30",submitted:"",notes:""},{type:"itr14",status:"In Progress",due:"2024-11-30",submitted:"",notes:"Draft prepared"}],vault:{}},
    {id:2,tradingName:"Apex Advisory CC",regName:"Apex Advisory CC",regNumber:"2015/234567/23",orgType:"Private Company (Pty) Ltd",incorporatedDate:"2015-06-15",stage:"Onboarding",yearEnd:"31 Mar",industry:"Financial Services",pic:"Low (<350)",bbee:"Level 4",bank:"Standard Bank",accountNo:"00XXXXXXX",branchCode:"051001",incomeTaxNo:"",vatNo:"",payeNo:"",regAddress:"45 Bree Street, Cape Town, 8000",tradingAddress:"45 Bree Street, Cape Town, 8000",shareholders:[],beneficialOwners:[],directors:[],submissions:[{type:"cipc_ar",status:"Overdue",due:"2024-03-31",submitted:"",notes:""}],vault:{}},
  ]);
  const [selected,setSelected]=useState(null);
  const [onboard,setOnboard]=useState({...emptyOnboard});
  const [step,setStep]=useState(0);
  const [clientTab,setClientTab]=useState("profile");
  const [showAddSub,setShowAddSub]=useState(false);
  const [newSub,setNewSub]=useState({type:"cipc_ar",due:"",notes:""});
  const [toast,setToast]=useState("");
  const [emailModal,setEmailModal]=useState(null);
  const [searchQ,setSearchQ]=useState("");

  function showToast(msg){setToast(msg);setTimeout(()=>setToast(""),3000);}
  const allSubs=clients.flatMap(c=>(c.submissions||[]).map(s=>({...s,clientName:c.tradingName,clientId:c.id})));
  const overdueCount=allSubs.filter(s=>s.status==="Overdue").length;
  const activeCount=clients.filter(c=>c.stage==="Active").length;
  const onboardingCount=clients.filter(c=>c.stage==="Onboarding").length;

  function saveOnboard(){
    if(!onboard.tradingName){showToast("Trading name is required");return;}
    setClients(prev=>[...prev,{...onboard,id:Date.now(),vault:{}}]);
    setOnboard({...emptyOnboard});setStep(0);setNav("Clients");
    showToast("Client onboarded successfully!");
  }
  function updateClient(id,updates){
    setClients(prev=>prev.map(c=>c.id===id?{...c,...updates}:c));
    if(selected?.id===id) setSelected(prev=>({...prev,...updates}));
  }
  function addSubmission(){
    if(!newSub.due){showToast("Please set a due date");return;}
    updateClient(selected.id,{submissions:[...(selected.submissions||[]),{...newSub,status:"Pending",submitted:""}]});
    setShowAddSub(false);setNewSub({type:"cipc_ar",due:"",notes:""});showToast("Submission added");
  }
  const filteredClients=clients.filter(c=>c.tradingName?.toLowerCase().includes(searchQ.toLowerCase())||c.regNumber?.toLowerCase().includes(searchQ.toLowerCase()));

  return (
    <div style={{display:"flex",height:"100vh",fontFamily:"system-ui,sans-serif",fontSize:14,background:"#f8fafc",overflow:"hidden"}}>
      {toast&&<div style={{position:"fixed",top:20,right:20,background:NAVY,color:"#fff",padding:"10px 20px",borderRadius:8,zIndex:9999,fontSize:13}}>{toast}</div>}
      {emailModal&&<EmailModal data={emailModal} onClose={()=>setEmailModal(null)} onSend={()=>{showToast("Reminder email sent!");setEmailModal(null);}} />}
      <div style={{width:220,background:NAVY,display:"flex",flexDirection:"column",flexShrink:0,overflowY:"auto"}}>
        <div style={{padding:"20px 16px 16px"}}><Logo /></div>
        <nav style={{flex:1,padding:"8px 0"}}>
          {NAV.map(n=>(
            <button key={n} onClick={()=>{setNav(n);setSelected(null);setStep(0);}}
              style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 20px",background:nav===n?"rgba(201,168,76,0.15)":"transparent",borderLeft:nav===n?`3px solid ${GOLD}`:"3px solid transparent",color:nav===n?GOLD:"#94a3b8",border:"none",cursor:"pointer",fontSize:13,textAlign:"left"}}>
              <NavIcon n={n}/> {n}
            </button>
          ))}
        </nav>
        <div style={{padding:"16px",borderTop:"1px solid #1e3a5f"}}><div style={{fontSize:11,color:"#64748b"}}>v2.0 · ClientBridge</div></div>
      </div>
      <div style={{flex:1,overflow:"auto"}}>
        {nav==="Dashboard"&&<Dashboard clients={clients} allSubs={allSubs} overdueCount={overdueCount} activeCount={activeCount} onboardingCount={onboardingCount} setNav={setNav} setEmailModal={setEmailModal}/>}
        {nav==="Clients"&&!selected&&<ClientList clients={filteredClients} searchQ={searchQ} setSearchQ={setSearchQ} setSelected={s=>{setSelected(s);setClientTab("profile");}} setNav={setNav}/>}
        {nav==="Clients"&&selected&&<ClientDetail client={selected} tab={clientTab} setTab={setClientTab} onUpdate={updateClient} onBack={()=>setSelected(null)} showAddSub={showAddSub} setShowAddSub={setShowAddSub} newSub={newSub} setNewSub={setNewSub} addSubmission={addSubmission} setEmailModal={setEmailModal} showToast={showToast}/>}
        {nav==="Onboarding"&&<OnboardingWizard onboard={onboard} setOnboard={setOnboard} step={step} setStep={setStep} saveOnboard={saveOnboard}/>}
        {nav==="Submissions"&&<SubmissionsView allSubs={allSubs} clients={clients} setEmailModal={setEmailModal} updateClient={updateClient} showToast={showToast}/>}
        {nav==="Workflows"&&<WorkflowsView clients={clients} updateClient={updateClient} showToast={showToast}/>}
        {nav==="Offboarding"&&<OffboardingView clients={clients} updateClient={updateClient} showToast={showToast}/>}
      </div>
    </div>
  );
}

function NavIcon({n}){
  const icons={Dashboard:"⊞",Clients:"👤",Onboarding:"✚",Submissions:"📅",Workflows:"⚙",Offboarding:"↩"};
  return <span style={{fontSize:14}}>{icons[n]||"·"}</span>;
}

function Dashboard({clients,allSubs,overdueCount,activeCount,onboardingCount,setNav,setEmailModal}){
  const urgent=allSubs.filter(s=>s.status==="Overdue"||s.status==="Pending").slice(0,8);
  return <div style={{padding:32}}>
    <PageHeader title="Dashboard" subtitle="Practice overview and upcoming deadlines"/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:32}}>
      {[["Total Clients",clients.length,"#dbeafe","#1e40af"],["Active",activeCount,"#dcfce7","#15803d"],["Onboarding",onboardingCount,"#ede9fe","#6d28d9"],["Overdue Items",overdueCount,"#fee2e2","#991b1b"]].map(([l,v,bg,col])=>(
        <div key={l} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"16px 20px"}}>
          <div style={{fontSize:12,color:"#64748b",marginBottom:4}}>{l}</div>
          <div style={{fontSize:28,fontWeight:600,color:col}}>{v}</div>
          <div style={{marginTop:4,height:3,background:bg,borderRadius:2}}/>
        </div>
      ))}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:20}}>
        <h3 style={{margin:"0 0 16px",fontSize:15,fontWeight:600,color:NAVY}}>Upcoming & Overdue Submissions</h3>
        {urgent.length===0&&<p style={{color:"#64748b",fontSize:13}}>No urgent items.</p>}
        {urgent.map((s,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #f1f5f9"}}>
            <div>
              <div style={{fontWeight:500,fontSize:13}}>{SUBMISSION_TYPES.find(t=>t.id===s.type)?.label||s.type}</div>
              <div style={{fontSize:12,color:"#64748b"}}>{s.clientName} · Due {s.due}</div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <Badge s={s.status}/>
              <button onClick={()=>setEmailModal({client:s.clientName,type:s.type,due:s.due})} style={{background:"none",border:"1px solid #e2e8f0",borderRadius:6,padding:"4px 10px",fontSize:11,cursor:"pointer",color:"#334155"}}>📧 Remind</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:20}}>
        <h3 style={{margin:"0 0 16px",fontSize:15,fontWeight:600,color:NAVY}}>Client Pipeline</h3>
        {PIPELINE_STAGES.map(stage=>{
          const count=clients.filter(c=>c.stage===stage).length;
          return <div key={stage} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #f1f5f9"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:STATUS_COLORS[stage]||"#94a3b8"}}/>
              <span style={{fontSize:13}}>{stage}</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:80,height:6,background:"#f1f5f9",borderRadius:3}}>
                <div style={{width:`${Math.min(100,(count/Math.max(clients.length,1))*100)}%`,height:"100%",background:STATUS_COLORS[stage]||"#94a3b8",borderRadius:3}}/>
              </div>
              <span style={{fontSize:13,fontWeight:500,minWidth:20}}>{count}</span>
            </div>
          </div>;
        })}
      </div>
    </div>
  </div>;
}

function ClientList({clients,searchQ,setSearchQ,setSelected,setNav}){
  return <div style={{padding:32}}>
    <PageHeader title="Clients" subtitle={`${clients.length} clients in your practice`}
      action={<button onClick={()=>setNav("Onboarding")} style={{background:NAVY,color:"#fff",border:"none",borderRadius:8,padding:"10px 20px",cursor:"pointer",fontWeight:500}}>+ New Client</button>}/>
    <input placeholder="Search by name or registration number…" value={searchQ} onChange={e=>setSearchQ(e.target.value)} style={{width:"100%",padding:"10px 14px",border:"1px solid #e2e8f0",borderRadius:8,marginBottom:20,fontSize:13,boxSizing:"border-box"}}/>
    <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr style={{background:"#f8fafc",borderBottom:"1px solid #e2e8f0"}}>
          {["Client","Reg Number","Type","Industry","Year-End","Stage",""].map(h=><th key={h} style={{padding:"10px 16px",textAlign:"left",fontSize:12,fontWeight:600,color:"#64748b"}}>{h}</th>)}
        </tr></thead>
        <tbody>
          {clients.map(c=>(
            <tr key={c.id} style={{borderBottom:"1px solid #f1f5f9",cursor:"pointer"}} onClick={()=>setSelected(c)} onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background=""}>
              <td style={{padding:"12px 16px"}}><div style={{fontWeight:500,color:NAVY}}>{c.tradingName}</div><div style={{fontSize:11,color:"#94a3b8"}}>{c.regName}</div></td>
              <td style={{padding:"12px 16px",fontSize:13,color:"#64748b"}}>{c.regNumber}</td>
              <td style={{padding:"12px 16px",fontSize:12,color:"#64748b"}}>{c.orgType}</td>
              <td style={{padding:"12px 16px",fontSize:13}}>{c.industry}</td>
              <td style={{padding:"12px 16px",fontSize:13}}>{c.yearEnd}</td>
              <td style={{padding:"12px 16px"}}><Badge s={c.stage}/></td>
              <td style={{padding:"12px 16px",fontSize:13,color:"#3b82f6"}}>View →</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>;
}

function ClientDetail({client,tab,setTab,onUpdate,onBack,showAddSub,setShowAddSub,newSub,setNewSub,addSubmission,setEmailModal,showToast}){
  const tabs=["profile","tax","ownership","beneficial","directors","submissions","vault"];
  const tabLabel={profile:"Organisation",tax:"Tax & SARS",ownership:"Shareholding",beneficial:"Beneficial Owners",directors:"Directors",submissions:"Submissions",vault:"Document Vault"};
  return <div style={{padding:32}}>
    <button onClick={onBack} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",marginBottom:16,fontSize:13}}>← Back to Clients</button>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
      <div>
        <h1 style={{margin:0,fontSize:20,fontWeight:600,color:NAVY}}>{client.tradingName}</h1>
        <div style={{display:"flex",gap:8,marginTop:6,flexWrap:"wrap"}}>
          <span style={{fontSize:12,color:"#64748b"}}>{client.regNumber}</span>
          {client.orgType&&<span style={{fontSize:12,background:"#f1f5f9",color:"#475569",padding:"2px 8px",borderRadius:10}}>{client.orgType}</span>}
          <Badge s={client.stage}/>
          {client.bbee&&<span style={{fontSize:12,background:"#fdf6e3",color:"#92400e",padding:"2px 8px",borderRadius:10}}>B-BBEE {client.bbee}</span>}
        </div>
      </div>
      <select value={client.stage} onChange={e=>onUpdate(client.id,{stage:e.target.value})} style={{padding:"6px 12px",border:"1px solid #e2e8f0",borderRadius:6,fontSize:13}}>
        {PIPELINE_STAGES.map(s=><option key={s}>{s}</option>)}
      </select>
    </div>
    <div style={{display:"flex",gap:0,borderBottom:"1px solid #e2e8f0",marginBottom:24,flexWrap:"wrap"}}>
      {tabs.map(t=>(
        <button key={t} onClick={()=>setTab(t)} style={{padding:"8px 16px",background:"none",border:"none",borderBottom:tab===t?`2px solid ${NAVY}`:"2px solid transparent",color:tab===t?NAVY:"#64748b",cursor:"pointer",fontSize:13,fontWeight:tab===t?500:400}}>
          {tabLabel[t]}
        </button>
      ))}
    </div>
    {tab==="profile"&&<ProfileTab client={client} onUpdate={onUpdate}/>}
    {tab==="tax"&&<TaxTab client={client} onUpdate={onUpdate}/>}
    {tab==="ownership"&&<OwnershipTab client={client} onUpdate={onUpdate}/>}
    {tab==="beneficial"&&<BeneficialTab client={client} onUpdate={onUpdate}/>}
    {tab==="directors"&&<DirectorsTab client={client} onUpdate={onUpdate}/>}
    {tab==="submissions"&&<SubmissionsTab client={client} onUpdate={onUpdate} showAddSub={showAddSub} setShowAddSub={setShowAddSub} newSub={newSub} setNewSub={setNewSub} addSubmission={addSubmission} setEmailModal={setEmailModal}/>}
    {tab==="vault"&&<VaultTab client={client} onUpdate={onUpdate} showToast={showToast}/>}
  </div>;
}

function ProfileTab({client,onUpdate}){
  const u=(k,v)=>onUpdate(client.id,{[k]:v});
  return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
    <Field label="Trading Name" value={client.tradingName} onChange={v=>u("tradingName",v)}/>
    <Field label="Registered Name" value={client.regName} onChange={v=>u("regName",v)}/>
    <Field label="Organisation Type" value={client.orgType} onChange={v=>u("orgType",v)} options={ORG_TYPES}/>
    <Field label="Registration Number" value={client.regNumber} onChange={v=>u("regNumber",v)}/>
    <Field label="Incorporated Date" value={client.incorporatedDate} onChange={v=>u("incorporatedDate",v)} type="date"/>
    <Field label="Year-End Date" value={client.yearEnd} onChange={v=>u("yearEnd",v)}/>
    <Field label="Financial Year-End" value={client.financialYearEnd} onChange={v=>u("financialYearEnd",v)}/>
    <Field label="Industry Description" value={client.industry} onChange={v=>u("industry",v)}/>
    <Field label="SIC Code" value={client.sicCode} onChange={v=>u("sicCode",v)}/>
    <Field label="Public Interest Score" value={client.pic} onChange={v=>u("pic",v)} options={["Low (<350)","Medium (350-500)","High (>500)"]}/>
    <Field label="B-BBEE Level" value={client.bbee} onChange={v=>u("bbee",v)} options={["Level 1","Level 2","Level 3","Level 4","Level 5","Level 6","Level 7","Level 8","Non-compliant","Exempt"]}/>
    <Field label="Holding Company" value={client.holdingCompany} onChange={v=>u("holdingCompany",v)}/>
    <Field label="Ultimate Parent Entity" value={client.ultimateParent} onChange={v=>u("ultimateParent",v)}/>
    <div style={{gridColumn:"1/-1"}}><Field label="Registered Address" value={client.regAddress} onChange={v=>u("regAddress",v)}/></div>
    <div style={{gridColumn:"1/-1"}}><Field label="Trading Address" value={client.tradingAddress} onChange={v=>u("tradingAddress",v)}/></div>
    <Field label="Bank" value={client.bank} onChange={v=>u("bank",v)} options={["ABSA","FNB","Nedbank","Standard Bank","Investec","Capitec","African Bank","Other"]}/>
    <Field label="Account Number" value={client.accountNo} onChange={v=>u("accountNo",v)}/>
    <Field label="Branch Code" value={client.branchCode} onChange={v=>u("branchCode",v)}/>
    <Field label="SWIFT Code" value={client.swiftCode} onChange={v=>u("swiftCode",v)}/>
    <div style={{gridColumn:"1/-1",marginTop:8}}>
      <button onClick={()=>onUpdate(client.id,{})} style={{background:NAVY,color:"#fff",border:"none",borderRadius:6,padding:"8px 20px",cursor:"pointer",fontWeight:500}}>Save Profile</button>
    </div>
  </div>;
}

function TaxTab({client,onUpdate}){
  const u=(k,v)=>onUpdate(client.id,{[k]:v});
  return <div>
    <h3 style={{margin:"0 0 20px",fontSize:15,fontWeight:600,color:NAVY}}>Tax & SARS Registration Numbers</h3>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      {[["Business Income Tax Number","incomeTaxNo","e.g. 9012345678"],["VAT Registration Number","vatNo","e.g. 4012345678"],["PAYE Registration Number","payeNo","e.g. 7012345678"],["UIF Reference Number","uifNo",""],["SDL Reference Number","sdlNo",""],["COID / WCA Number","coidNo",""]].map(([l,k,ph])=>(
        <div key={k} style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"14px 16px"}}>
          <Field label={l} value={client[k]} onChange={v=>u(k,v)} placeholder={ph}/>
        </div>
      ))}
    </div>
    <div style={{marginTop:16}}>
      <button onClick={()=>onUpdate(client.id,{})} style={{background:NAVY,color:"#fff",border:"none",borderRadius:6,padding:"8px 20px",cursor:"pointer",fontWeight:500}}>Save Tax Numbers</button>
    </div>
  </div>;
}

function OwnershipTab({client,onUpdate}){
  const [adding,setAdding]=useState(false);
  const [form,setForm]=useState({name:"",idNo:"",nationality:"South African",pct:"",shareClass:"Ordinary",shares:""});
  function add(){if(!form.name||!form.pct)return;onUpdate(client.id,{shareholders:[...(client.shareholders||[]),{...form}]});setAdding(false);setForm({name:"",idNo:"",nationality:"South African",pct:"",shareClass:"Ordinary",shares:""});}
  function del(i){onUpdate(client.id,{shareholders:(client.shareholders||[]).filter((_,j)=>j!==i)});}
  return <div>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
      <h3 style={{margin:0,fontSize:15,fontWeight:600,color:NAVY}}>Shareholders & Ownership</h3>
      <button onClick={()=>setAdding(true)} style={{background:NAVY,color:"#fff",border:"none",borderRadius:6,padding:"6px 14px",cursor:"pointer",fontSize:13}}>+ Add Shareholder</button>
    </div>
    {adding&&<div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:16,marginBottom:16}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
        <Field label="Full Name" value={form.name} onChange={v=>setForm(p=>({...p,name:v}))}/>
        <Field label="ID / Passport" value={form.idNo} onChange={v=>setForm(p=>({...p,idNo:v}))}/>
        <Field label="Nationality" value={form.nationality} onChange={v=>setForm(p=>({...p,nationality:v}))}/>
        <Field label="% Held" value={form.pct} onChange={v=>setForm(p=>({...p,pct:v}))}/>
        <Field label="Share Class" value={form.shareClass} onChange={v=>setForm(p=>({...p,shareClass:v}))} options={SHARE_CLASSES}/>
        <Field label="Issued Shares" value={form.shares} onChange={v=>setForm(p=>({...p,shares:v}))}/>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={add} style={{background:NAVY,color:"#fff",border:"none",borderRadius:6,padding:"7px 16px",cursor:"pointer",fontSize:13}}>Add</button>
        <button onClick={()=>setAdding(false)} style={{background:"none",border:"1px solid #e2e8f0",borderRadius:6,padding:"7px 16px",cursor:"pointer",fontSize:13}}>Cancel</button>
      </div>
    </div>}
    {(client.shareholders||[]).length===0&&!adding&&<p style={{color:"#94a3b8",fontSize:13}}>No shareholders added yet.</p>}
    {(client.shareholders||[]).map((s,i)=>(
      <div key={i} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:8,padding:"12px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontWeight:500}}>{s.name} <span style={{color:"#64748b",fontWeight:400}}>({s.nationality})</span></div>
          <div style={{fontSize:12,color:"#64748b",marginTop:2}}>ID: {s.idNo} · {s.shareClass} · {s.shares} shares · <strong>{s.pct}%</strong></div>
        </div>
        <button onClick={()=>del(i)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:18}}>×</button>
      </div>
    ))}
  </div>;
}

function BeneficialTab({client,onUpdate}){
  const [adding,setAdding]=useState(false);
  const [form,setForm]=useState({name:"",idNo:"",nationality:"South African",pct:"",controlType:"Direct ownership",pepStatus:"No",dateBecame:""});
  function add(){if(!form.name)return;onUpdate(client.id,{beneficialOwners:[...(client.beneficialOwners||[]),{...form}]});setAdding(false);}
  function del(i){onUpdate(client.id,{beneficialOwners:(client.beneficialOwners||[]).filter((_,j)=>j!==i)});}
  return <div>
    <div style={{background:"#fef3c7",border:"1px solid #fde68a",borderRadius:8,padding:"10px 14px",marginBottom:16,fontSize:13,color:"#92400e"}}>
      ⚠️ CIPC Beneficial Ownership Register — all natural persons holding ≥5% effective interest must be declared
    </div>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
      <h3 style={{margin:0,fontSize:15,fontWeight:600,color:NAVY}}>Beneficial Owners</h3>
      <button onClick={()=>setAdding(true)} style={{background:NAVY,color:"#fff",border:"none",borderRadius:6,padding:"6px 14px",cursor:"pointer",fontSize:13}}>+ Add BO</button>
    </div>
    {adding&&<div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:16,marginBottom:16}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
        <Field label="Full Name" value={form.name} onChange={v=>setForm(p=>({...p,name:v}))}/>
        <Field label="ID / Passport Number" value={form.idNo} onChange={v=>setForm(p=>({...p,idNo:v}))}/>
        <Field label="Nationality" value={form.nationality} onChange={v=>setForm(p=>({...p,nationality:v}))}/>
        <Field label="% Effective Interest" value={form.pct} onChange={v=>setForm(p=>({...p,pct:v}))}/>
        <Field label="Type of Control" value={form.controlType} onChange={v=>setForm(p=>({...p,controlType:v}))} options={BO_CONTROL_TYPES}/>
        <Field label="PEP Status" value={form.pepStatus} onChange={v=>setForm(p=>({...p,pepStatus:v}))} options={["No","Yes — Domestic PEP","Yes — Foreign PEP","Yes — International Organisation PEP"]}/>
        <Field label="Date Became BO" value={form.dateBecame} onChange={v=>setForm(p=>({...p,dateBecame:v}))} type="date"/>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={add} style={{background:NAVY,color:"#fff",border:"none",borderRadius:6,padding:"7px 16px",cursor:"pointer",fontSize:13}}>Add</button>
        <button onClick={()=>setAdding(false)} style={{background:"none",border:"1px solid #e2e8f0",borderRadius:6,padding:"7px 16px",cursor:"pointer",fontSize:13}}>Cancel</button>
      </div>
    </div>}
    {(client.beneficialOwners||[]).length===0&&!adding&&<p style={{color:"#94a3b8",fontSize:13}}>No beneficial owners recorded.</p>}
    {(client.beneficialOwners||[]).map((b,i)=>(
      <div key={i} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:8,padding:"12px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontWeight:500}}>{b.name} {b.pepStatus!=="No"&&<span style={{background:"#fee2e2",color:"#991b1b",fontSize:11,padding:"2px 6px",borderRadius:4,marginLeft:6}}>PEP</span>}</div>
          <div style={{fontSize:12,color:"#64748b",marginTop:2}}>ID: {b.idNo} · {b.nationality} · {b.pct}% · {b.controlType} · Since {b.dateBecame}</div>
        </div>
        <button onClick={()=>del(i)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:18}}>×</button>
      </div>
    ))}
  </div>;
}

function DirectorsTab({client,onUpdate}){
  const [adding,setAdding]=useState(false);
  const [form,setForm]=useState({name:"",idNo:"",role:"Director",appointDate:"",resident:"Yes",email:"",phone:"",incomeTaxNo:"",pepStatus:"No"});
  function add(){if(!form.name)return;onUpdate(client.id,{directors:[...(client.directors||[]),{...form}]});setAdding(false);setForm({name:"",idNo:"",role:"Director",appointDate:"",resident:"Yes",email:"",phone:"",incomeTaxNo:"",pepStatus:"No"});}
  function del(i){onUpdate(client.id,{directors:(client.directors||[]).filter((_,j)=>j!==i)});}
  return <div>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
      <h3 style={{margin:0,fontSize:15,fontWeight:600,color:NAVY}}>Directors & Officers</h3>
      <button onClick={()=>setAdding(true)} style={{background:NAVY,color:"#fff",border:"none",borderRadius:6,padding:"6px 14px",cursor:"pointer",fontSize:13}}>+ Add Director</button>
    </div>
    {adding&&<div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:16,marginBottom:16}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
        <Field label="Full Name" value={form.name} onChange={v=>setForm(p=>({...p,name:v}))}/>
        <Field label="ID / Passport Number" value={form.idNo} onChange={v=>setForm(p=>({...p,idNo:v}))}/>
        <Field label="Role" value={form.role} onChange={v=>setForm(p=>({...p,role:v}))} options={DIRECTOR_ROLES}/>
        <Field label="Appointment Date" value={form.appointDate} onChange={v=>setForm(p=>({...p,appointDate:v}))} type="date"/>
        <Field label="SA Resident" value={form.resident} onChange={v=>setForm(p=>({...p,resident:v}))} options={["Yes","No"]}/>
        <Field label="Personal Income Tax Number" value={form.incomeTaxNo} onChange={v=>setForm(p=>({...p,incomeTaxNo:v}))} placeholder="e.g. 9012345678"/>
        <Field label="PEP Status" value={form.pepStatus} onChange={v=>setForm(p=>({...p,pepStatus:v}))} options={["No","Yes — Domestic PEP","Yes — Foreign PEP"]}/>
        <Field label="Email" value={form.email} onChange={v=>setForm(p=>({...p,email:v}))}/>
        <Field label="Phone" value={form.phone} onChange={v=>setForm(p=>({...p,phone:v}))}/>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={add} style={{background:NAVY,color:"#fff",border:"none",borderRadius:6,padding:"7px 16px",cursor:"pointer",fontSize:13}}>Add</button>
        <button onClick={()=>setAdding(false)} style={{background:"none",border:"1px solid #e2e8f0",borderRadius:6,padding:"7px 16px",cursor:"pointer",fontSize:13}}>Cancel</button>
      </div>
    </div>}
    {(client.directors||[]).length===0&&!adding&&<p style={{color:"#94a3b8",fontSize:13}}>No directors added yet.</p>}
    {(client.directors||[]).map((d,i)=>(
      <div key={i} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:8,padding:"12px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontWeight:500,display:"flex",alignItems:"center",gap:8}}>
            {d.name}
            <span style={{background:"#dbeafe",color:"#1e40af",fontSize:11,padding:"2px 8px",borderRadius:10}}>{d.role}</span>
            {d.pepStatus!=="No"&&<span style={{background:"#fee2e2",color:"#991b1b",fontSize:11,padding:"2px 6px",borderRadius:4}}>PEP</span>}
          </div>
          <div style={{fontSize:12,color:"#64748b",marginTop:2}}>ID: {d.idNo} · Tax: {d.incomeTaxNo||"—"} · Appointed {d.appointDate} · {d.resident==="Yes"?"SA Resident":"Non-Resident"}</div>
          <div style={{fontSize:12,color:"#64748b"}}>{d.email} · {d.phone}</div>
        </div>
        <button onClick={()=>del(i)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:18}}>×</button>
      </div>
    ))}
  </div>;
}

function SubmissionsTab({client,onUpdate,showAddSub,setShowAddSub,newSub,setNewSub,addSubmission,setEmailModal}){
  function updateStatus(i,status){
    const subs=[...(client.submissions||[])];
    subs[i]={...subs[i],status,submitted:status==="Submitted"?new Date().toISOString().slice(0,10):subs[i].submitted};
    onUpdate(client.id,{submissions:subs});
  }
  return <div>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
      <h3 style={{margin:0,fontSize:15,fontWeight:600,color:NAVY}}>Regulatory Submissions</h3>
      <button onClick={()=>setShowAddSub(true)} style={{background:NAVY,color:"#fff",border:"none",borderRadius:6,padding:"6px 14px",cursor:"pointer",fontSize:13}}>+ Add Submission</button>
    </div>
    {showAddSub&&<div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:16,marginBottom:16}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
        <Field label="Submission Type" value={newSub.type} onChange={v=>setNewSub(p=>({...p,type:v}))} options={SUBMISSION_TYPES.map(t=>t.id)}/>
        <Field label="Due Date" value={newSub.due} onChange={v=>setNewSub(p=>({...p,due:v}))} type="date"/>
        <div style={{gridColumn:"1/-1"}}><Field label="Notes" value={newSub.notes} onChange={v=>setNewSub(p=>({...p,notes:v}))}/></div>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={addSubmission} style={{background:NAVY,color:"#fff",border:"none",borderRadius:6,padding:"7px 16px",cursor:"pointer",fontSize:13}}>Add</button>
        <button onClick={()=>setShowAddSub(false)} style={{background:"none",border:"1px solid #e2e8f0",borderRadius:6,padding:"7px 16px",cursor:"pointer",fontSize:13}}>Cancel</button>
      </div>
    </div>}
    {(client.submissions||[]).length===0&&<p style={{color:"#94a3b8",fontSize:13}}>No submissions tracked yet.</p>}
    {(client.submissions||[]).map((s,i)=>{
      const ti=SUBMISSION_TYPES.find(t=>t.id===s.type)||{label:s.type,category:"",freq:""};
      return <div key={i} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:8,padding:"14px 16px",marginBottom:8}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontWeight:500}}>{ti.label}</div>
            <div style={{fontSize:12,color:"#64748b",marginTop:3}}>{ti.category} · {ti.freq} · Due: <strong>{s.due}</strong>{s.submitted&&<span> · Submitted: {s.submitted}</span>}</div>
            {s.notes&&<div style={{fontSize:12,color:"#64748b",marginTop:2}}>Note: {s.notes}</div>}
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <Badge s={s.status}/>
            <select value={s.status} onChange={e=>updateStatus(i,e.target.value)} style={{padding:"4px 8px",border:"1px solid #e2e8f0",borderRadius:6,fontSize:12}}>
              {["Pending","In Progress","Submitted","Overdue"].map(st=><option key={st}>{st}</option>)}
            </select>
            <button onClick={()=>setEmailModal({client:client.tradingName,type:s.type,due:s.due})} style={{background:"none",border:"1px solid #e2e8f0",borderRadius:6,padding:"4px 10px",fontSize:11,cursor:"pointer"}}>📧 Remind</button>
          </div>
        </div>
      </div>;
    })}
  </div>;
}

function VaultTab({client,onUpdate,showToast}){
  const [selCat,setSelCat]=useState(Object.keys(DOC_CATEGORIES)[0]);
  const [uploading,setUploading]=useState(false);
  const fileRef=useRef();
  const vault=client.vault||{};

  function handleFile(e){
    const files=Array.from(e.target.files);
    if(!files.length)return;
    const updated={...vault};
    files.forEach(f=>{
      const key=`${selCat}|||${f.name}`;
      updated[key]={name:f.name,category:selCat,size:f.size,type:f.type,uploadedAt:new Date().toLocaleDateString("en-ZA"),uploadedBy:"Practice User"};
    });
    onUpdate(client.id,{vault:updated});
    showToast(`${files.length} file(s) uploaded to ${selCat}`);
    e.target.value="";
  }

  function delFile(key){onUpdate(client.id,{vault:Object.fromEntries(Object.entries(vault).filter(([k])=>k!==key))});showToast("Document removed");}

  const allDocs=Object.entries(vault);
  const catDocs=allDocs.filter(([k])=>k.startsWith(selCat+"|||"));
  const totalDocs=allDocs.length;

  return <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
      <div>
        <h3 style={{margin:0,fontSize:15,fontWeight:600,color:NAVY}}>Document Vault</h3>
        <p style={{margin:"4px 0 0",fontSize:13,color:"#64748b"}}>{totalDocs} document{totalDocs!==1?"s":""} stored · Secure per-client file repository</p>
      </div>
      <button onClick={()=>fileRef.current.click()} style={{background:NAVY,color:"#fff",border:"none",borderRadius:6,padding:"8px 16px",cursor:"pointer",fontSize:13,fontWeight:500}}>
        📎 Upload Documents
      </button>
    </div>
    <input ref={fileRef} type="file" multiple style={{display:"none"}} onChange={handleFile}/>

    <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:20}}>
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,overflow:"hidden",height:"fit-content"}}>
        {Object.keys(DOC_CATEGORIES).map(cat=>{
          const count=allDocs.filter(([k])=>k.startsWith(cat+"|||")).length;
          return <button key={cat} onClick={()=>setSelCat(cat)}
            style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",padding:"10px 14px",background:selCat===cat?"#f0f4ff":"transparent",borderLeft:selCat===cat?`3px solid ${NAVY}`:"3px solid transparent",border:"none",borderBottom:"1px solid #f1f5f9",cursor:"pointer",fontSize:12,textAlign:"left",color:selCat===cat?NAVY:"#475569",fontWeight:selCat===cat?500:400}}>
            <span>{cat}</span>
            {count>0&&<span style={{background:NAVY,color:"#fff",borderRadius:10,padding:"1px 7px",fontSize:11}}>{count}</span>}
          </button>;
        })}
      </div>

      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <h4 style={{margin:0,fontSize:14,fontWeight:600,color:NAVY}}>{selCat}</h4>
          <button onClick={()=>fileRef.current.click()} style={{background:"none",border:"1px dashed #cbd5e1",borderRadius:6,padding:"5px 12px",cursor:"pointer",fontSize:12,color:"#64748b"}}>+ Upload to this folder</button>
        </div>

        <div style={{background:"#f8fafc",border:"1px dashed #cbd5e1",borderRadius:8,padding:"12px 16px",marginBottom:16}}>
          <p style={{margin:0,fontSize:12,color:"#94a3b8",fontWeight:500}}>Required documents for this category:</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8}}>
            {DOC_CATEGORIES[selCat].map(doc=>{
              const uploaded=catDocs.some(([k])=>k.toLowerCase().includes(doc.toLowerCase().slice(0,10)));
              return <span key={doc} style={{fontSize:11,padding:"3px 9px",borderRadius:10,background:uploaded?"#dcfce7":"#f1f5f9",color:uploaded?"#15803d":"#64748b",border:`1px solid ${uploaded?"#bbf7d0":"#e2e8f0"}`}}>
                {uploaded?"✓ ":""}{doc}
              </span>;
            })}
          </div>
        </div>

        {catDocs.length===0&&<div style={{textAlign:"center",padding:"32px 0",color:"#94a3b8",fontSize:13}}>
          <div style={{fontSize:32,marginBottom:8}}>📂</div>
          No documents uploaded in this category yet.
        </div>}

        {catDocs.map(([key,doc])=>(
          <div key={key} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:8,padding:"12px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:36,height:36,borderRadius:6,background:"#eff6ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>
                {doc.type?.includes("pdf")?"📄":doc.type?.includes("image")?"🖼️":"📎"}
              </div>
              <div>
                <div style={{fontWeight:500,fontSize:13}}>{doc.name}</div>
                <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>
                  {(doc.size/1024).toFixed(1)} KB · Uploaded {doc.uploadedAt} by {doc.uploadedBy}
                </div>
              </div>
            </div>
            <button onClick={()=>delFile(key)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:16,padding:"4px 8px"}}>×</button>
          </div>
        ))}
      </div>
    </div>
  </div>;
}

const ONBOARD_STEPS=["Organisation","Tax & SARS","Shareholding","Beneficial Owners","Directors","Review"];

function OnboardingWizard({onboard,setOnboard,step,setStep,saveOnboard}){
  const u=(k,v)=>setOnboard(p=>({...p,[k]:v}));
  return <div style={{padding:32,maxWidth:900}}>
    <PageHeader title="Client Onboarding" subtitle="New client registration wizard"/>
    <div style={{display:"flex",gap:0,marginBottom:32,flexWrap:"wrap"}}>
      {ONBOARD_STEPS.map((s,i)=>(
        <div key={s} style={{display:"flex",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer"}} onClick={()=>i<step&&setStep(i)}>
            <div style={{width:26,height:26,borderRadius:"50%",background:i<=step?NAVY:"#e2e8f0",color:i<=step?"#fff":"#94a3b8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600}}>
              {i<step?"✓":i+1}
            </div>
            <span style={{fontSize:12,fontWeight:i===step?600:400,color:i===step?NAVY:"#64748b"}}>{s}</span>
          </div>
          {i<ONBOARD_STEPS.length-1&&<div style={{width:24,height:1,background:i<step?NAVY:"#e2e8f0",margin:"0 6px"}}/>}
        </div>
      ))}
    </div>
    <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:24}}>
      {step===0&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Field label="Trading Name *" value={onboard.tradingName} onChange={v=>u("tradingName",v)}/>
        <Field label="Registered Name" value={onboard.regName} onChange={v=>u("regName",v)}/>
        <Field label="Organisation Type" value={onboard.orgType} onChange={v=>u("orgType",v)} options={ORG_TYPES}/>
        <Field label="Registration Number" value={onboard.regNumber} onChange={v=>u("regNumber",v)}/>
        <Field label="Incorporated Date" value={onboard.incorporatedDate} onChange={v=>u("incorporatedDate",v)} type="date"/>
        <Field label="Year-End Date" value={onboard.yearEnd} onChange={v=>u("yearEnd",v)}/>
        <Field label="Financial Year-End" value={onboard.financialYearEnd} onChange={v=>u("financialYearEnd",v)}/>
        <Field label="Industry Description" value={onboard.industry} onChange={v=>u("industry",v)}/>
        <Field label="SIC Code" value={onboard.sicCode} onChange={v=>u("sicCode",v)}/>
        <Field label="Public Interest Score" value={onboard.pic} onChange={v=>u("pic",v)} options={["Low (<350)","Medium (350-500)","High (>500)"]}/>
        <Field label="B-BBEE Level" value={onboard.bbee} onChange={v=>u("bbee",v)} options={["Level 1","Level 2","Level 3","Level 4","Level 5","Level 6","Level 7","Level 8","Non-compliant","Exempt"]}/>
        <Field label="Holding Company" value={onboard.holdingCompany} onChange={v=>u("holdingCompany",v)}/>
        <Field label="Ultimate Parent Entity" value={onboard.ultimateParent} onChange={v=>u("ultimateParent",v)}/>
        <div style={{gridColumn:"1/-1"}}><Field label="Registered Address" value={onboard.regAddress} onChange={v=>u("regAddress",v)}/></div>
        <div style={{gridColumn:"1/-1"}}><Field label="Trading Address (if different)" value={onboard.tradingAddress} onChange={v=>u("tradingAddress",v)}/></div>
        <Field label="Bank" value={onboard.bank} onChange={v=>u("bank",v)} options={["ABSA","FNB","Nedbank","Standard Bank","Investec","Capitec","African Bank","Other"]}/>
        <Field label="Account Number" value={onboard.accountNo} onChange={v=>u("accountNo",v)}/>
        <Field label="Branch Code" value={onboard.branchCode} onChange={v=>u("branchCode",v)}/>
        <Field label="SWIFT Code" value={onboard.swiftCode} onChange={v=>u("swiftCode",v)}/>
      </div>}

      {step===1&&<div>
        <h3 style={{margin:"0 0 20px",fontSize:15,fontWeight:600,color:NAVY}}>Tax & SARS Registration Numbers</h3>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          {[["Business Income Tax Number","incomeTaxNo","e.g. 9012345678"],["VAT Registration Number","vatNo","e.g. 4012345678"],["PAYE Registration Number","payeNo","e.g. 7012345678"],["UIF Reference Number","uifNo",""],["SDL Reference Number","sdlNo",""],["COID / WCA Number","coidNo",""]].map(([l,k,ph])=>(
            <div key={k} style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"14px 16px"}}>
              <Field label={l} value={onboard[k]} onChange={v=>u(k,v)} placeholder={ph}/>
            </div>
          ))}
        </div>
      </div>}

      {step===2&&<ShareholdingStep onboard={onboard} setOnboard={setOnboard}/>}
      {step===3&&<BOStep onboard={onboard} setOnboard={setOnboard}/>}
      {step===4&&<DirectorStepW onboard={onboard} setOnboard={setOnboard}/>}
      {step===5&&<ReviewStep onboard={onboard}/>}
    </div>
    <div style={{display:"flex",justifyContent:"space-between",marginTop:20}}>
      <button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0} style={{background:"none",border:"1px solid #e2e8f0",borderRadius:6,padding:"10px 20px",cursor:step===0?"not-allowed":"pointer",color:"#64748b",fontSize:13}}>← Previous</button>
      {step<ONBOARD_STEPS.length-1
        ?<button onClick={()=>setStep(s=>s+1)} style={{background:NAVY,color:"#fff",border:"none",borderRadius:6,padding:"10px 24px",cursor:"pointer",fontWeight:500}}>Next →</button>
        :<button onClick={saveOnboard} style={{background:GOLD,color:NAVY,border:"none",borderRadius:6,padding:"10px 24px",cursor:"pointer",fontWeight:600}}>✓ Complete Onboarding</button>}
    </div>
  </div>;
}

function ShareholdingStep({onboard,setOnboard}){
  const [form,setForm]=useState({name:"",idNo:"",nationality:"South African",pct:"",shareClass:"Ordinary",shares:""});
  function add(){if(!form.name)return;setOnboard(p=>({...p,shareholders:[...(p.shareholders||[]),{...form}]}));setForm({name:"",idNo:"",nationality:"South African",pct:"",shareClass:"Ordinary",shares:""});}
  return <div>
    <h3 style={{margin:"0 0 16px",fontSize:15,fontWeight:600,color:NAVY}}>Shareholders & Ownership Structure</h3>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
      <Field label="Full Name" value={form.name} onChange={v=>setForm(p=>({...p,name:v}))}/>
      <Field label="ID / Passport" value={form.idNo} onChange={v=>setForm(p=>({...p,idNo:v}))}/>
      <Field label="Nationality" value={form.nationality} onChange={v=>setForm(p=>({...p,nationality:v}))}/>
      <Field label="% Held" value={form.pct} onChange={v=>setForm(p=>({...p,pct:v}))}/>
      <Field label="Share Class" value={form.shareClass} onChange={v=>setForm(p=>({...p,shareClass:v}))} options={SHARE_CLASSES}/>
      <Field label="Issued Shares" value={form.shares} onChange={v=>setForm(p=>({...p,shares:v}))}/>
    </div>
    <button onClick={add} style={{background:NAVY,color:"#fff",border:"none",borderRadius:6,padding:"7px 16px",cursor:"pointer",fontSize:13,marginBottom:16}}>+ Add Shareholder</button>
    {(onboard.shareholders||[]).map((s,i)=>(
      <div key={i} style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:6,padding:"10px 14px",marginBottom:6,fontSize:13}}>
        <strong>{s.name}</strong> · {s.pct}% · {s.shareClass} · {s.shares} shares · {s.nationality}
      </div>
    ))}
  </div>;
}

function BOStep({onboard,setOnboard}){
  const [form,setForm]=useState({name:"",idNo:"",nationality:"South African",pct:"",controlType:"Direct ownership",pepStatus:"No",dateBecame:""});
  function add(){if(!form.name)return;setOnboard(p=>({...p,beneficialOwners:[...(p.beneficialOwners||[]),{...form}]}));}
  return <div>
    <div style={{background:"#fef3c7",border:"1px solid #fde68a",borderRadius:8,padding:"10px 14px",marginBottom:16,fontSize:13,color:"#92400e"}}>
      ⚠️ CIPC Beneficial Ownership Register — declare all natural persons holding ≥5% effective interest
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
      <Field label="Full Name" value={form.name} onChange={v=>setForm(p=>({...p,name:v}))}/>
      <Field label="ID / Passport" value={form.idNo} onChange={v=>setForm(p=>({...p,idNo:v}))}/>
      <Field label="Nationality" value={form.nationality} onChange={v=>setForm(p=>({...p,nationality:v}))}/>
      <Field label="% Effective Interest" value={form.pct} onChange={v=>setForm(p=>({...p,pct:v}))}/>
      <Field label="Type of Control" value={form.controlType} onChange={v=>setForm(p=>({...p,controlType:v}))} options={BO_CONTROL_TYPES}/>
      <Field label="PEP Status" value={form.pepStatus} onChange={v=>setForm(p=>({...p,pepStatus:v}))} options={["No","Yes — Domestic PEP","Yes — Foreign PEP","Yes — International Organisation PEP"]}/>
      <Field label="Date Became BO" value={form.dateBecame} onChange={v=>setForm(p=>({...p,dateBecame:v}))} type="date"/>
    </div>
    <button onClick={add} style={{background:NAVY,color:"#fff",border:"none",borderRadius:6,padding:"7px 16px",cursor:"pointer",fontSize:13,marginBottom:16}}>+ Add Beneficial Owner</button>
    {(onboard.beneficialOwners||[]).map((b,i)=>(
      <div key={i} style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:6,padding:"10px 14px",marginBottom:6,fontSize:13}}>
        <strong>{b.name}</strong> · {b.pct}% · {b.controlType} · PEP: {b.pepStatus}
      </div>
    ))}
  </div>;
}

function DirectorStepW({onboard,setOnboard}){
  const [form,setForm]=useState({name:"",idNo:"",role:"Director",appointDate:"",resident:"Yes",email:"",phone:"",incomeTaxNo:"",pepStatus:"No"});
  function add(){if(!form.name)return;setOnboard(p=>({...p,directors:[...(p.directors||[]),{...form}]}));setForm({name:"",idNo:"",role:"Director",appointDate:"",resident:"Yes",email:"",phone:"",incomeTaxNo:"",pepStatus:"No"});}
  return <div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
      <Field label="Full Name" value={form.name} onChange={v=>setForm(p=>({...p,name:v}))}/>
      <Field label="ID / Passport Number" value={form.idNo} onChange={v=>setForm(p=>({...p,idNo:v}))}/>
      <Field label="Role" value={form.role} onChange={v=>setForm(p=>({...p,role:v}))} options={DIRECTOR_ROLES}/>
      <Field label="Appointment Date" value={form.appointDate} onChange={v=>setForm(p=>({...p,appointDate:v}))} type="date"/>
      <Field label="SA Resident" value={form.resident} onChange={v=>setForm(p=>({...p,resident:v}))} options={["Yes","No"]}/>
      <Field label="Personal Income Tax Number" value={form.incomeTaxNo} onChange={v=>setForm(p=>({...p,incomeTaxNo:v}))} placeholder="e.g. 9012345678"/>
      <Field label="PEP Status" value={form.pepStatus} onChange={v=>setForm(p=>({...p,pepStatus:v}))} options={["No","Yes — Domestic PEP","Yes — Foreign PEP"]}/>
      <Field label="Email" value={form.email} onChange={v=>setForm(p=>({...p,email:v}))}/>
      <Field label="Phone" value={form.phone} onChange={v=>setForm(p=>({...p,phone:v}))}/>
    </div>
    <button onClick={add} style={{background:NAVY,color:"#fff",border:"none",borderRadius:6,padding:"7px 16px",cursor:"pointer",fontSize:13,marginBottom:16}}>+ Add Director</button>
    {(onboard.directors||[]).map((d,i)=>(
      <div key={i} style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:6,padding:"10px 14px",marginBottom:6,fontSize:13}}>
        <strong>{d.name}</strong> · {d.role} · Tax: {d.incomeTaxNo||"—"} · {d.email}
      </div>
    ))}
  </div>;
}

function ReviewStep({onboard}){
  const rows=[["Trading Name",onboard.tradingName],["Organisation Type",onboard.orgType],["Registration Number",onboard.regNumber],["Incorporated Date",onboard.incorporatedDate],["Industry",onboard.industry],["Year-End",onboard.yearEnd],["B-BBEE",onboard.bbee],["Public Interest Score",onboard.pic],["Income Tax No",onboard.incomeTaxNo],["VAT No",onboard.vatNo],["PAYE No",onboard.payeNo],["Bank",onboard.bank],["Registered Address",onboard.regAddress]].filter(([,v])=>v);
  return <div>
    <h3 style={{margin:"0 0 16px",fontSize:15,fontWeight:600,color:NAVY}}>Review & Confirm</h3>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
      {rows.map(([l,v])=>(
        <div key={l} style={{background:"#f8fafc",borderRadius:6,padding:"10px 14px"}}>
          <div style={{fontSize:11,color:"#64748b"}}>{l}</div>
          <div style={{fontSize:13,fontWeight:500,marginTop:2}}>{v}</div>
        </div>
      ))}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
      {[["Shareholders",(onboard.shareholders||[]).length],["Beneficial Owners",(onboard.beneficialOwners||[]).length],["Directors",(onboard.directors||[]).length]].map(([l,v])=>(
        <div key={l} style={{background:"#dbeafe",borderRadius:8,padding:"12px 16px",textAlign:"center"}}>
          <div style={{fontSize:22,fontWeight:600,color:"#1e40af"}}>{v}</div>
          <div style={{fontSize:12,color:"#1e40af"}}>{l}</div>
        </div>
      ))}
    </div>
  </div>;
}

function SubmissionsView({allSubs,clients,setEmailModal,updateClient,showToast}){
  const [filter,setFilter]=useState("All");
  const filtered=filter==="All"?allSubs:allSubs.filter(s=>s.status===filter);
  return <div style={{padding:32}}>
    <PageHeader title="Regulatory Submissions" subtitle="Track all submissions across all clients"/>
    <div style={{display:"flex",gap:8,marginBottom:20}}>
      {["All","Pending","In Progress","Submitted","Overdue"].map(s=>(
        <button key={s} onClick={()=>setFilter(s)} style={{padding:"6px 14px",borderRadius:20,border:"1px solid #e2e8f0",background:filter===s?NAVY:"#fff",color:filter===s?"#fff":"#64748b",cursor:"pointer",fontSize:12,fontWeight:filter===s?500:400}}>{s}</button>
      ))}
    </div>
    <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr style={{background:"#f8fafc",borderBottom:"1px solid #e2e8f0"}}>
          {["Client","Submission","Category","Due Date","Status",""].map(h=><th key={h} style={{padding:"10px 16px",textAlign:"left",fontSize:12,fontWeight:600,color:"#64748b"}}>{h}</th>)}
        </tr></thead>
        <tbody>
          {filtered.map((s,i)=>{
            const ti=SUBMISSION_TYPES.find(t=>t.id===s.type)||{label:s.type,category:""};
            return <tr key={i} style={{borderBottom:"1px solid #f1f5f9"}}>
              <td style={{padding:"12px 16px",fontWeight:500,fontSize:13}}>{s.clientName}</td>
              <td style={{padding:"12px 16px",fontSize:13}}>{ti.label}</td>
              <td style={{padding:"12px 16px",fontSize:13,color:"#64748b"}}>{ti.category}</td>
              <td style={{padding:"12px 16px",fontSize:13}}>{s.due}</td>
              <td style={{padding:"12px 16px"}}><Badge s={s.status}/></td>
              <td style={{padding:"12px 16px"}}>
                <button onClick={()=>setEmailModal({client:s.clientName,type:s.type,due:s.due})} style={{background:"none",border:"1px solid #e2e8f0",borderRadius:6,padding:"4px 10px",fontSize:11,cursor:"pointer"}}>📧 Remind</button>
              </td>
            </tr>;
          })}
        </tbody>
      </table>
      {filtered.length===0&&<p style={{textAlign:"center",color:"#94a3b8",padding:32,fontSize:13}}>No submissions found.</p>}
    </div>
  </div>;
}

const WF_TEMPLATES={
  "CIPC Annual Return":["Confirm year-end financials","Update registered address if changed","Prepare CM documents","Submit on CIPC e-services portal","Download confirmation certificate","File in client vault"],
  "Beneficial Ownership":["Identify all beneficial owners ≥5%","Collect ID/passport copies","Verify PEP status","Submit on CIPC BO platform","Retain submission receipt","Update Document Vault"],
  "Income Tax (ITR14)":["Obtain signed AFS","Reconcile income tax computation","Prepare ITR14 draft","Client review and sign-off","Submit on SARS eFiling","Print IT34 assessment"],
  "VAT Return":["Extract VAT input/output from accounting","Reconcile to VAT control account","Prepare VAT201","Submit on eFiling","Download payment confirmation"],
  "PAYE (EMP201)":["Finalise payroll for month","Prepare EMP201","Submit and pay PAYE/UIF/SDL","File payment confirmation"],
};

function WorkflowsView({clients,updateClient,showToast}){
  const [selClient,setSelClient]=useState("");
  const [selTemplate,setSelTemplate]=useState("");
  const [workflows,setWorkflows]=useState({});
  const key=`${selClient}|${selTemplate}`;
  const steps=workflows[key]||(WF_TEMPLATES[selTemplate]||[]).map((t,i)=>({id:i,task:t,done:false}));
  function toggle(id){setWorkflows(p=>({...p,[key]:steps.map(s=>s.id===id?{...s,done:!s.done}:s)}));}
  const pct=steps.length?Math.round(steps.filter(s=>s.done).length/steps.length*100):0;
  return <div style={{padding:32}}>
    <PageHeader title="Workflows" subtitle="Submission checklists and task management"/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24,maxWidth:600}}>
      <Field label="Select Client" value={selClient} onChange={setSelClient} options={clients.map(c=>c.tradingName)}/>
      <Field label="Workflow Template" value={selTemplate} onChange={setSelTemplate} options={Object.keys(WF_TEMPLATES)}/>
    </div>
    {selClient&&selTemplate&&<div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:24,maxWidth:700}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div><div style={{fontWeight:600,fontSize:15,color:NAVY}}>{selTemplate}</div><div style={{fontSize:12,color:"#64748b"}}>{selClient}</div></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:20,fontWeight:600,color:pct===100?"#15803d":NAVY}}>{pct}%</div><div style={{fontSize:11,color:"#64748b"}}>complete</div></div>
      </div>
      <div style={{height:6,background:"#f1f5f9",borderRadius:3,marginBottom:20}}>
        <div style={{width:`${pct}%`,height:"100%",background:pct===100?"#15803d":NAVY,borderRadius:3,transition:"width 0.3s"}}/>
      </div>
      {steps.map(s=>(
        <div key={s.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid #f1f5f9",cursor:"pointer"}} onClick={()=>toggle(s.id)}>
          <div style={{width:20,height:20,borderRadius:4,border:`2px solid ${s.done?"#15803d":"#e2e8f0"}`,background:s.done?"#15803d":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            {s.done&&<span style={{color:"#fff",fontSize:12}}>✓</span>}
          </div>
          <span style={{fontSize:13,textDecoration:s.done?"line-through":"none",color:s.done?"#94a3b8":"#334155"}}>{s.task}</span>
        </div>
      ))}
      {pct===100&&<div style={{background:"#dcfce7",borderRadius:8,padding:"10px 14px",marginTop:16,fontSize:13,color:"#15803d",fontWeight:500}}>✓ All tasks complete! This workflow is done.</div>}
    </div>}
    {(!selClient||!selTemplate)&&<p style={{color:"#94a3b8",fontSize:13}}>Select a client and template to begin a workflow.</p>}
  </div>;
}

const OFFBOARD_CHECKLIST=["Final tax return submitted","VAT deregistration (if applicable)","PAYE deregistration","CIPC deregistration / final annual return","Close banking accounts (confirm with client)","Transfer / archive client files","Issue final invoice","Send closure letter to client","Update CRM status to Closed","Conduct exit interview / satisfaction survey"];

function OffboardingView({clients,updateClient,showToast}){
  const [selId,setSelId]=useState("");
  const [checks,setChecks]=useState({});
  const [reason,setReason]=useState("");
  const selClient=clients.find(c=>String(c.id)===selId);
  const key=`offboard_${selId}`;
  const done=checks[key]||{};
  const pct=Math.round(OFFBOARD_CHECKLIST.filter((_,i)=>done[i]).length/OFFBOARD_CHECKLIST.length*100);
  function toggle(i){setChecks(p=>({...p,[key]:{...done,[i]:!done[i]}}));}
  function complete(){if(pct<100){showToast("Please complete all checklist items first");return;}updateClient(Number(selId),{stage:"Closed"});showToast(`${selClient?.tradingName} successfully offboarded`);}
  return <div style={{padding:32}}>
    <PageHeader title="Offboarding" subtitle="Structured client closure process"/>
    <div style={{maxWidth:500,marginBottom:24}}>
      <Field label="Select Client to Offboard" value={selId} onChange={setSelId} options={clients.filter(c=>c.stage!=="Closed").map(c=>String(c.id))}/>
      {selClient&&<div style={{marginTop:8,fontSize:13,color:"#64748b"}}>{selClient.tradingName} · Currently: <Badge s={selClient.stage}/></div>}
    </div>
    {selClient&&<div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:24,maxWidth:700}}>
      <div style={{marginBottom:16}}>
        <label style={{fontSize:12,fontWeight:500,color:"#64748b",display:"block",marginBottom:4}}>Offboarding reason / notes</label>
        <textarea value={reason} onChange={e=>setReason(e.target.value)} rows={3} style={{width:"100%",padding:"8px 12px",border:"1px solid #e2e8f0",borderRadius:6,fontSize:13,resize:"vertical",boxSizing:"border-box"}}/>
      </div>
      <div style={{height:6,background:"#f1f5f9",borderRadius:3,marginBottom:16}}>
        <div style={{width:`${pct}%`,height:"100%",background:pct===100?"#15803d":NAVY,borderRadius:3}}/>
      </div>
      <div style={{fontSize:12,color:"#64748b",marginBottom:12}}>{pct}% complete</div>
      {OFFBOARD_CHECKLIST.map((item,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid #f1f5f9",cursor:"pointer"}} onClick={()=>toggle(i)}>
          <div style={{width:20,height:20,borderRadius:4,border:`2px solid ${done[i]?"#15803d":"#e2e8f0"}`,background:done[i]?"#15803d":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            {done[i]&&<span style={{color:"#fff",fontSize:12}}>✓</span>}
          </div>
          <span style={{fontSize:13,textDecoration:done[i]?"line-through":"none",color:done[i]?"#94a3b8":"#334155"}}>{item}</span>
        </div>
      ))}
      <button onClick={complete} style={{marginTop:20,background:pct===100?"#15803d":NAVY,color:"#fff",border:"none",borderRadius:6,padding:"10px 24px",cursor:"pointer",fontWeight:500,opacity:pct<100?0.6:1}}>
        {pct===100?"✓ Complete Offboarding":"Complete All Items First"}
      </button>
    </div>}
  </div>;
}

function EmailModal({data,onClose,onSend}){
  const typeInfo=SUBMISSION_TYPES.find(t=>t.id===data.type)||{label:data.type};
  const [msg,setMsg]=useState(`Dear Client,\n\nThis is a reminder that your ${typeInfo.label} submission is due on ${data.due}.\n\nPlease ensure all required documents are submitted to us at your earliest convenience to avoid penalties or late fees.\n\nKind regards,\nClientBridge Advisory Team`);
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9000}}>
    <div style={{background:"#fff",borderRadius:12,padding:28,width:520,maxHeight:"80vh",overflow:"auto"}}>
      <h3 style={{margin:"0 0 16px",fontSize:15,fontWeight:600,color:NAVY}}>📧 Send Reminder Email</h3>
      <div style={{marginBottom:12}}>
        <div style={{fontSize:12,color:"#64748b",marginBottom:4}}>To</div>
        <input value={`${data.client} (accounts team)`} readOnly style={{width:"100%",padding:"8px 12px",border:"1px solid #e2e8f0",borderRadius:6,fontSize:13,boxSizing:"border-box",background:"#f8fafc"}}/>
      </div>
      <div style={{marginBottom:12}}>
        <div style={{fontSize:12,color:"#64748b",marginBottom:4}}>Subject</div>
        <input value={`Reminder: ${typeInfo.label} due ${data.due}`} readOnly style={{width:"100%",padding:"8px 12px",border:"1px solid #e2e8f0",borderRadius:6,fontSize:13,boxSizing:"border-box",background:"#f8fafc"}}/>
      </div>
      <div style={{marginBottom:16}}>
        <div style={{fontSize:12,color:"#64748b",marginBottom:4}}>Message</div>
        <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={8} style={{width:"100%",padding:"8px 12px",border:"1px solid #e2e8f0",borderRadius:6,fontSize:13,resize:"vertical",boxSizing:"border-box"}}/>
      </div>
      <div style={{display:"flex",gap:10}}>
        <button onClick={onSend} style={{background:NAVY,color:"#fff",border:"none",borderRadius:6,padding:"10px 20px",cursor:"pointer",fontWeight:500}}>Send Reminder</button>
        <button onClick={onClose} style={{background:"none",border:"1px solid #e2e8f0",borderRadius:6,padding:"10px 20px",cursor:"pointer",fontSize:13}}>Cancel</button>
      </div>
    </div>
  </div>;
}
