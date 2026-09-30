import json, os, re
domains = {
 "foundations": ("Foundations", False, 24, ["Scene and bite safety","Muzzling and when not to","The handler as team member","Weight estimation","Canine normal vitals","Anatomy for access and monitoring","Human-drug landmines","MDR1 (ABCB1) sensitivity"]),
 "pathophysiology": ("Pathophysiology: dog vs human", False, 24, ["Thermoregulation and heat dissipation","Hemorrhagic shock and the canine spleen","Blood groups and transfusion","Cardiac rhythm and sinus arrhythmia","Drug metabolism and toxic mechanisms","Respiratory mechanics and oxygen transport"]),
 "arrest": ("Arrest", True, 12, ["CPR (RECOVER)","K9 reversible causes","Post-arrest care"]),
 "trauma": ("Trauma resuscitation", True, 12, ["K9 MARCH-PAWS primary survey","Hemorrhage control","Airway","Tension pneumothorax","Hemorrhagic shock and fluids","Tranexamic acid","Head injury","Hypothermia","Gunshot and stab wounds","Blast injury","Burns","Ocular injury","Fractures and splinting"]),
 "procedures": ("Procedures", True, 24, ["Peripheral IV access","Jugular access","Intraosseous access","Orotracheal intubation","Surgical tracheotomy","Needle thoracostomy","Tube thoracostomy","GDV decompression","Pericardiocentesis","Wound packing","Splinting","Restraint"]),
 "medical": ("Medical emergencies", True, 12, ["Gastric dilatation-volvulus","Heat stroke","Exertional hypoglycemia","Exertional rhabdomyolysis","Anaphylaxis","Status epilepticus","Hemoabdomen","Pericardial effusion","Drowning","Smoke inhalation","Snake envenomation","Hypoadrenocorticism crisis","Diabetic ketoacidosis","Arrhythmias"]),
 "tox-duty": ("Toxicology: duty exposures", True, 12, ["Opioids including fentanyl","Methamphetamine and amphetamines","Cocaine","Cannabis and THC"]),
 "tox-common": ("Toxicology: common toxins", True, 12, ["Decontamination principles","Xylitol","Chocolate","Grapes and raisins","Anticoagulant rodenticides","Bromethalin","Cholecalciferol","Ethylene glycol","Human NSAIDs","Acetaminophen","Organophosphates and carbamates","Toxic toads","Blue-green algae","Sago palm","Smoke, CO, and cyanide","Antidote table"]),
 "handoff": ("Handoff and transport", False, 24, ["Structured vet handoff","Loading and restraint for transport","HEMS transport policy","Finding the nearest 24/7 vet ED"]),
 "legal": ("Scope and legal", False, 12, ["Jurisdiction card"]),
}
import sys, glob
# Guard: this script OVERWRITES every module file. Refuse if any module has moved past 'stub'
# (or the index has domains it does not know about) unless --force is passed.
if "--force" not in sys.argv:
    advanced = []
    for f in glob.glob("content/modules/**/*.json", recursive=True):
        try:
            st = json.load(open(f)).get("status")
        except Exception:
            st = "unreadable"
        if st not in ("stub",):
            advanced.append(f)
    # the one worked example is 'draft' by design; anything else is real work
    advanced = [f for f in advanced if not f.endswith("gastric-dilatation-volvulus.json")]
    if advanced:
        print("refusing to overwrite: %d module(s) are past 'stub' (e.g. %s). Use --force only on a clean tree." % (len(advanced), advanced[0]))
        sys.exit(1)
envs = json.load(open("content/environments.json"))
tiers = [t["id"] for t in envs["tiers"]]
def slug(s): return re.sub(r"[^a-z0-9]+","-",s.lower()).strip("-")
def empty_lens():
    return {t: {"do_here": [], "leave_for_next": [], "transfer_trigger": "TODO"} for t in tiers}
index, count = [], 0
for did,(label,rev,interval,mods) in domains.items():
    os.makedirs(f"content/modules/{did}", exist_ok=True)
    for i,title in enumerate(mods):
        mid = slug(title)
        m = {"id": mid, "title": title, "domain": did, "reversible": rev and did!="procedures",
             "status": "stub", "last_verified": None, "review_interval_months": interval,
             "signoff": {"vet": None, "physician": None},
             "why_this_matters": "TODO", "what_changes_from_human": [],
             "content": {"recognition": [], "management": [], "procedure_refs": []},
             "lens": empty_lens(), "takeaway": "TODO", "sources": [], "drug_refs": []}
        if did == "pathophysiology":
            # dog-vs-human reference: compare table instead of an environment lens
            m["kind"] = "pathophysiology"
            m["compare"] = []
            del m["lens"]
        if mid == "gastric-dilatation-volvulus":
            m["status"] = "draft"
            m["why_this_matters"] = "Large, deep-chested working breeds are at risk, and GDV kills within hours without decompression and surgery."
            m["what_changes_from_human"] = [
              {"point": "There is no human equivalent; suspicion alone is a transport trigger.", "objective_id": "medical-gdv-01"},
              {"point": "Decompression (orogastric tube or percutaneous trocar) is a bridge, not a fix; the dog still needs surgery.", "objective_id": "medical-gdv-02"}]
            m["content"]["procedure_refs"] = ["gdv-decompression"]
            L = m["lens"]
            L["handler"] = {"do_here": ["Recognize", "Keep calm and still", "Call ahead to vet ED"], "leave_for_next": ["Everything else"], "transfer_trigger": "Suspicion alone: go now"}
            L["prehospital_als"] = {"do_here": ["Recognize", "Oxygen", "IV access and fluids"], "leave_for_next": ["Decompression"], "transfer_trigger": "Suspicion alone: go now"}
            L["flight_cct"] = {"do_here": ["All ALS actions", "Trocar decompression if long transport and deteriorating"], "leave_for_next": ["Surgery"], "transfer_trigger": "Suspicion alone", "requires": []}
            L["human_ed"] = {"do_here": ["Orogastric or trocar decompression", "Resuscitation", "Call vet"], "leave_for_next": ["Surgery", "Definitive anesthesia"], "transfer_trigger": "Once decompressed and perfusing"}
            L["vet_gp"] = {"do_here": ["Stabilize", "Gastropexy if capable"], "leave_for_next": ["Surgery if not capable", "Post-op ICU"], "transfer_trigger": "Per vet", "requires": ["species_surgery"]}
            L["vet_ed"] = {"do_here": ["Definitive gastropexy", "ICU care"], "leave_for_next": [], "transfer_trigger": "N/A"}
            m["takeaway"] = "Suspect it, decompress if you can, and get the dog to a surgeon."
        json.dump(m, open(f"content/modules/{did}/{mid}.json","w"), indent=2)
        index.append({"id": mid, "title": title, "domain": did, "order": i})
        count += 1
json.dump({"domains": [{"id": d, "label": v[0], "reversible_default": v[1], "review_interval_months": v[2]} for d,v in domains.items()], "modules": index},
          open("content/index.json","w"), indent=2)
print(count, "modules")
