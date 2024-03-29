var project_name ='Scleroderma'
var organColors = {
    'General Well-Being': '#D6C0F3',
    'ENT': '#4A1183',
    'Visual': '#D5E8E6',
    'Integumentary': '#377736',
    'Endocrine': '#76E9DB',
    'Digestive': '#AF94ED',
    'Urinary': '#B25844',
    'Reproductive': '#BAEFE9',
    'Genitourinary': '#E57373',
    'Lymphatic-Immune': '90A4AE',
    'Cardiovascular': '#F06292',
    'Respiratory': '#BA68C8',
    'Musculoskeletal': '4DB6AC', // Updated color to not interfere with highlighting
    'Nervous': '#9575CD',
    'Mental Health': '#FF8A65',
    'unbinned': '#A1887F'
};

var all_TUI_mappings = {
    'T052': 'Activity', 
    'T053': 'Behavior', 
    'T056': 'Daily or Recreational Activity', 
    'T051': 'Event', 
    'T064': 'Governmental or Regulatory Activity',
    'T055': 'Individual Behavior', 
    'T066': 'Machine Activity', 
    'T057': 'Occupational Activity', 
    'T054': 'Social Behavior',
    'T017': 'Anatomical Structure', 
    'T029': 'Body Location or Region', 
    'T023': 'Body Part, Organ, or Organ Component', 
    'T030': 'Body Space or Junction', 
    'T031': 'Body Substance', 
    'T022': 'Body System', 
    'T025': 'Cell', 
    'T026': 'Cell Component', 
    'T018': 'Embryonic Structure', 
    'T021': 'Fully Formed Anatomical Structure', 
    'T024': 'Tissue', 
    'T116': 'Amino Acid, Peptide, or Protein', 
    'T195': 'Antibiotic', 
    'T123': 'Biologically Active Substance', 
    'T122': 'Biomedical or Dental Material', 
    'T103': 'Chemical', 
    'T120': 'Chemical Viewed Functionally', 
    'T104': 'Chemical Viewed Structurally', 
    'T200': 'Clinical Drug', 
    'T196': 'Element, Ion, or Isotope', 
    'T126': 'Enzyme', 
    'T131': 'Hazardous or Poisonous Substance', 
    'T125': 'Hormone', 
    'T129': 'Immunologic Factor', 
    'T130': 'Indicator, Reagent, or Diagnostic Aid', 
    'T197': 'Inorganic Chemical', 
    'T114': 'Nucleic Acid, Nucleoside, or Nucleotide', 
    'T109': 'Organic Chemical', 
    'T121': 'Pharmacologic Substance', 
    'T192': 'Receptor', 
    'T127': 'Vitamin', 
    'T185': 'Classification', 
    'T077': 'Conceptual Entity', 
    'T169': 'Functional Concept', 
    'T102': 'Group Attribute', 'T078': 'Idea or Concept', 'T170': 'Intellectual Product', 'T171': 'Language', 'T080': 'Qualitative Concept', 'T081': 'Quantitative Concept', 'T089': 'Regulation or Law', 'T082': 'Spatial Concept', 'T079': 'Temporal Concept', 'T203': 'Drug Delivery Device', 'T074': 'Medical Device', 'T075': 'Research Device', 'T020': 'Acquired Abnormality', 'T190': 'Anatomical Abnormality', 'T049': 'Cell or Molecular Dysfunction', 'T019': 'Congenital Abnormality', 'T047': 'Disease or Syndrome', 'T050': 'Experimental Model of Disease', 'T033': 'Finding', 'T037': 'Injury or Poisoning', 'T048': 'Mental or Behavioral Dysfunction', 'T191': 'Neoplastic Process', 'T046': 'Pathologic Function', 'T184': 'Sign or Symptom', 'T087': 'Amino Acid Sequence', 'T088': 'Carbohydrate Sequence', 'T028': 'Gene or Genome', 'T085': 'Molecular Sequence', 'T086': 'Nucleotide Sequence', 'T083': 'Geographic Area', 'T100': 'Age Group', 'T011': 'Amphibian', 'T008': 'Animal', 'T194': 'Archaeon', 'T007': 'Bacterium', 'T012': 'Bird', 'T204': 'Eukaryote', 'T099': 'Family Group', 'T013': 'Fish', 'T004': 'Fungus', 'T096': 'Group', 'T016': 'Human', 'T015': 'Mammal', 'T001': 'Organism', 'T101': 'Patient or Disabled Group', 'T002': 'Plant', 'T098': 'Population Group', 'T097': 'Professional or Occupational Group', 'T014': 'Reptile', 'T010': 'Vertebrate', 'T005': 'Virus', 'T071': 'Entity', 'T168': 'Food', 'T073': 'Manufactured Object', 'T072': 'Physical Object', 'T167': 'Substance', 'T091': 'Biomedical Occupation or Discipline', 'T090': 'Occupation or Discipline', 'T093': 'Health Care Related Organization', 'T092': 'Organization', 'T094': 'Professional Society', 'T095': 'Self-help or Relief Organization', 'T038': 'Biologic Function', 'T069': 'Environmental Effect of Humans', 'T068': 'Human-caused Phenomenon or Process', 'T034': 'Laboratory or Test Result', 'T070': 'Natural Phenomenon or Process', 'T067': 'Phenomenon or Process', 'T043': 'Cell Function', 'T201': 'Clinical Attribute', 'T045': 'Genetic Function', 'T041': 'Mental Process', 'T044': 'Molecular Function', 'T032': 'Organism Attribute', 'T040': 'Organism Function', 'T042': 'Organ or Tissue Function', 'T039': 'Physiologic Function', 'T060': 'Diagnostic Procedure', 'T065': 'Educational Activity', 'T058': 'Health Care Activity', 'T059': 'Laboratory Procedure', 'T063': 'Molecular Biology Research Technique', 'T062': 'Research Activity', 'T061': 'Therapeutic or Preventive Procedure'
};

var organ_systems_to_roots=[{
    "General Well-Being": [
        "C1286942"
    ],
    "ENT": [
        "C0422833"
    ],
    "Visual": [
        "C0587900"
    ],
    "Integumentary": [
        "C0037267"
    ],
    "Endocrine": [
        "C0014136"
    ],
    "Digestive": [
        "C0012240",
        "C1333803",
        "C0426737",
        "C0432602",
        "C0424867"
    ],
    "Urinary": [
        "C1508753",
        "C0426391",
        "C0812426"
    ],
    "Reproductive": [
        "C1261210"
    ],
    "Genitourinary": [
        "C0042066"
    ],
    "Lymphatic-Immune": [
        "C0020962",
        "C0024235"
    ],
    "Cardiovascular": [
        "C0007226",
        "C0029854"
    ],
    "Respiratory": [
        "C0035237"
    ],
    "Musculoskeletal": [
        "C0026860",
        "C0026859",
        "C0029669",
        "C0426779"
    ],
    "Nervous": [
        "C0027763",
        "C0596002",
        "C0422837"
    ],
    "Mental Health": [
        "C0004936",
        "C1854373"
    ]
}]