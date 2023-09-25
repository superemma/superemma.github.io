var organColors = {
    'General Well-Being': '#e57373',  // Red
    'ENT': '#f06292',  // Pink
    'Visual': '#ba68c8',  // Purple
    'Integumentary': '#9575cd',  // Deep Purple
    'Endocrine': '#7986cb',  // Indigo
    'Digestive': '#64b5f6',  // Blue
    'Urinary': '#4fc3f7',  // Light Blue
    'Reproductive': '#4dd0e1',  // Cyan
    'Genitourinary': '#4db6ac',  // Teal
    'Lymphatic-Immune': '#81c784',  // Green
    'Cardiovascular': '#aed581',  // Light Green
    'Respiratory': '#dce775',  // Lime
    'Musculoskeletal': '#ffd54f',  // Yellow
    'Nervous': '#ffb74d',  // Orange
    'Mental Health': '#ff8a65',  // Deep Orange
    'unbinned': '#a1887f'  // Brown
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
var bin= {
    "Musculoskeletal": [
        {
            "C0031900": "pierre robin syndrome"
        },
        {
            "C0026837": "MUSCLE RIGIDITY"
        },
        {
            "C0410574": "Synovial hypertrophy"
        },
        {
            "C1837657": "CHST3-related skeletal dysplasia"
        },
        {
            "C0001080": "chondrodysplasia; fetalis"
        },
        {
            "C0028326": "Turner-like syndrome"
        },
        {
            "C1527336": "SJOGREN SYNDROME"
        },
        {
            "C0036439": "Scoliosis, unspecified"
        },
        {
            "C0003864": "ARTHRITIS INFLAMMATORY"
        },
        {
            "C0024796": "Marfan's syndrome, unspecified"
        },
        {
            "C1399354": "Hemifacial hyperplasia"
        },
        {
            "C0024141": "LUPUS"
        },
        {
            "C0270971": "infant; floppy baby syndrome"
        },
        {
            "C0343239": "Benign Congenital Hypotonia"
        },
        {
            "C0042454": "Velopharyngeal incompetence"
        },
        {
            "C0221357": "Brachydactyly"
        },
        {
            "C3495559": "Juvenile chronic arthritis"
        },
        {
            "C0432072": "Dysmorphic features"
        },
        {
            "C0700208": "Acquired scoliosis"
        },
        {
            "C0206655": "alveolar rhabdomyosarcoma"
        }
    ],
    "Respiratory": [
        {
            "C1275808": "Congenital central hypoventilation syndrome"
        },
        {
            "C0085078": "PHOSPHOLIPIDOSIS"
        },
        {
            "C0476273": "respiratory; distress"
        },
        {
            "C0037315": "sleep apnea"
        },
        {
            "C0013404": "Dyspnea, unspecified"
        },
        {
            "C0520679": "Obstructive Sleep Apnea Syndrome"
        },
        {
            "C0037384": "Snoring"
        },
        {
            "C3887547": "Central sleep apnoea syndrome"
        },
        {
            "C0031880": "pickwickian syndrome"
        },
        {
            "C0004096": "BRONCHIAL ASTHMA"
        },
        {
            "C0010674": "fibrocystic; disease"
        },
        {
            "C1145670": "RESPIRATORY FAILURE"
        }
    ],

    "Mental Health": [
        {
            "C1263846": "hyperactivity; child"
        },
        {
            "C0085281": "addiction"
        },
        {
            "C0600104": "compulsion"
        },
        {
            "C1270972": "disorder; mild cognitive"
        },
        {
            "C0003467": "Feeling;anxious"
        },
        {
            "C0004352": "disorder; autistic"
        },
        {
            "C3714756": "Intellectual Disability"
        },
        {
            "C0004936": "Mental disorder, NOS"
        },
        {
            "C0557874": "global developmental delay"
        },
        {
            "C0233697": "Obsessions"
        },
        {
            "C0015544": "FAILURE TO THRIVE"
        },
        {
            "C0233514": "Abnormal behaviour"
        },
        {
            "C0003469": "Anxiety disorders"
        },
        {
            "C0233558": "Tantrums"
        }
    ],
    "Digestive": [
        {
            "C0232462": "Poor;appetite"
        },
        {
            "C2711227": "Hepatic steatosis"
        },
        {
            "C0001339": "Acute Pancreatitis"
        },
        {
            "C1321756": "Achalasia"
        },
        {
            "C0014848": "CARDIOSPASM"
        },
        {
            "C0040456": "Impacted tooth"
        },
        {
            "C0268059": "HEMOCHROMATOSIS, NEONATAL"
        },
        {
            "C0750952": "Malignant neoplasm of biliary tract, part unspecified site"
        },
        {
            "C0007102": "Malignant neoplasm of colon, unspecified part"
        },
        {
            "C1857276": "Trichohepatoenteric syndrome"
        },
        {
            "C0278701": "gastric adenocarcinoma"
        },
        {
            "C0699790": "COLON CARCINOMA"
        }
    ],
    "Nervous": [
        {
            "C2981140": "Glaucoma of childhood"
        },
        {
            "C0022336": "Creutzfeldt-Jakob Disease"
        },
        {
            "C0265202": "Dwarf, nanocephalic"
        },
        {
            "C0014544": "Epilepsy, unspecified"
        },
        {
            "C0027404": "Narcolepsy"
        },
        {
            "C0007789": "paralysis; cerebral"
        },
        {
            "C0010276": "CRANIOPHARYNGIOMA, BENIGN"
        },
        {
            "C0917799": "sleeping too much"
        },
        {
            "C1845055": "alpha-thalassemia/mental retardation syndrome, nondeletion type (ATR2, ATR, nondeletion)"
        },
        {
            "C0265341": "anomaly; Rieger"
        },
        {
            "C0027868": "Neuromuscular disease or syndrome"
        },
        {
            "C0041341": "tuberous; sclerosis"
        },
        {
            "C0036572": "seizures"
        },
        {
            "C0162635": "happy puppet syndrome"
        },
        {
            "C0162678": "NEUROFIBROMATOSIS"
        },
        {
            "C0424790": "Rigor(s)"
        },
        {
            "C1096063": "epilepsy intractable"
        },
        {
            "C1145628": "Disorder of autonomic nervous system, unspecified"
        },
        {
            "C0002736": "creeping; palsy"
        },
        {
            "C0027831": "type I neurofibromatosis"
        },
        {
            "C2267233": "Neonatal hypotonia"
        },
        {
            "C0752166": "Bardet-Biedl syndrome"
        },
        {
            "C0424605": "child developmental delay"
        },
        {
            "C0040517": "de la Tourette"
        },
        {
            "C0338656": "Cognitive Impairment"
        },
        {
            "C0424295": "Hyperactive behavior"
        },
        {
            "C0035372": "Rett syndrome"
        },
        {
            "C0037769": "West syndrome (WS)"
        },
        {
            "C0020179": "chorea; Huntington"
        },
        {
            "C0007384": "Cataplexy"
        }
    ],
    "Endocrine": [
        {
            "C0271561": "Somatotropin Deficiency"
        },
        {
            "C0001206": "Acromegaly"
        },
        {
            "C0162429": "DIETARY DEFICIENCY"
        },
        {
            "C0032002": "Disease of pituitary gland, NOS"
        },
        {
            "C0524620": "Metabolic Syndrome"
        },
        {
            "C0020676": "Hypothyroidism, NOS"
        },
        {
            "C0151721": "Eunuchoidism"
        },
        {
            "C0342467": "Late onset congenital adrenal hyperplasia"
        },
        {
            "C0085576": "Iron-refractory iron deficiency anemia"
        },
        {
            "C0751230": "Hypothalamic syndrome, NOS"
        },
        {
            "C0342543": "Central precocious puberty"
        },
        {
            "C2362324": "Childhood Obesity"
        },
        {
            "C0405580": "Adrenocortical Insufficiency"
        },
        {
            "C0004903": "Beckwith's syndrome"
        },
        {
            "C0271801": "central hypothyroidism"
        },
        {
            "C0001623": "adrenal insufficiency"
        },
        {
            "C0154830": "Proliferative retinopathy due to diabetes mellitus"
        },
        {
            "C0032897": "PRADER WILLI SYNDROME"
        },
        {
            "C0028756": "OBESITY MORBID"
        },
        {
            "C0221032": "Congenital generalised lipodystrophy"
        },
        {
            "C0206635": "myelolipoma"
        },
        {
            "C0271650": "diabetes; chemical"
        },
        {
            "C0011854": "diabetes; insulin-dependent"
        },
        {
            "C0028754": "Obesity"
        },
        {
            "C0034013": "Precocious true puberty"
        },
        {
            "C0011860": "Diabetes;adult onset"
        },
        {
            "C4317171": "Obesity in adolescence"
        },
        {
            "C0014130": "Endocrine Disorders"
        },
        {
            "C0011849": "Diabetes mellitus, NOS"
        },
        {
            "C0001624": "Tumor of adrenal gland"
        }
    ],
    "Lymphatic-Immune": [
        {
            "C1961102": "precursor cell lymphoblastic leukemia"
        },
        {
            "C1096155": "macrophage activation syndrome"
        },
        {
            "C0040028": "ESSENTIAL THROMBOCYTHEMIA"
        },
        {
            "C0043194": "Wiskott-Aldrich Syndrome"
        },
        {
            "C0004364": "Autoimmune diseases"
        },
        {
            "C0342895": "Fish-eye disease"
        },
        {
            "C0018378": "Guillain-Barr\u00e9"
        },
        {
            "C0023449": "LEUKEMIA ACUTE LYMPHOBLASTIC"
        },
        {
            "C0744235": "FUNGAL SEPSIS"
        },
        {
            "C0745242": "Immunoglobulin deficiency"
        }
    ],
    "Genitourinary": [
        {
            "C0002312": "Hemoglobin H disease"
        },
        {
            "C0238419": "Fournier gangrene"
        },
        {
            "C0158687": "genital malformation"
        },
        {
            "C0279672": "Cervical Adenocarcinoma"
        }
    ],
    "Reproductive": [
        {
            "C0020619": "hypogonadotropism"
        },
        {
            "C0032460": "polycystic ovarian syndrome"
        },
        {
            "C0271623": "secondary testicular failure"
        },
        {
            "C0041408": "Pterygolymphangiectasia syndrome"
        },
        {
            "C0010417": "testicle; nondescent"
        },
        {
            "C0022735": "Klinefelters Syndrome"
        }
    ],
    "Visual": [
        {
            "C0042164": "uveitis"
        },
        {
            "C0017612": "Open-angle glaucoma, NOS"
        },
        {
            "C0175713": "Aicardi Syndrome"
        },
        {
            "C0013592": "eyelid; ectropion"
        },
        {
            "C0078918": "Oculocutaneous albinism"
        },
        {
            "C0154916": "Iris neovascularization"
        },
        {
            "C0701807": "Acute anterior uveitis"
        },
        {
            "C0038379": "heterotropia"
        },
        {
            "C0042165": "anterior uveitis"
        },
        {
            "C0005745": "Eyelid ptosis"
        }
    ],
    "Cardiovascular": [
        {
            "C0020538": "Complications affecting other specified body systems, not elsewhere classified, hypertension"
        },
        {
            "C1142166": "brugada syndrome"
        },
        {
            "C0948441": "Venous Obstruction"
        },
        {
            "C0018790": "Cardiac Arrest"
        },
        {
            "C0333243": "Pitting Edema"
        },
        {
            "C0004943": "Beh\u00e7et"
        },
        {
            "C0018802": "congestive heart failure"
        },
        {
            "C0018922": "Haemangiopericytoma NOS"
        },
        {
            "C0018801": "Insufficiency;cardiac"
        },
        {
            "C0175693": "Silver-Russell syndrome (SRS)"
        }
    ],
    "Integumentary": [
        {
            "C0175704": "Generalised lentiginosis"
        },
        {
            "C1854630": "Wiedemann Steiner syndrome"
        },
        {
            "C0023787": "Lipodystrophy, NOS"
        },
        {
            "C0014518": "Toxic epidermal necrolysis [Lyell]"
        },
        {
            "C0036421": "sclerosis; system"
        },
        {
            "C0014599": "epithelial; hyperplasia"
        },
        {
            "C0025202": "Melanoma"
        },
        {
            "C0002986": "Fabry's disease"
        },
        {
            "C0033860": "Psoriasis"
        },
        {
            "C0220989": "progressive lipodystrophy"
        },
        {
            "C1955934": "trichothiodystrophy"
        }
    ],
    "Urinary": [
        {
            "C0175702": "Williams Syndrome"
        },
        {
            "C2931788": "Atypical Hemolytic Uremic Syndrome"
        },
        {
            "C0403447": "Chronic Renal Insufficiency"
        },
        {
            "C0232826": "antidiuresis"
        },
        {
            "C1561643": "chronic renal disease"
        }
    ],
    "General Well-Being": [
        {
            "C0015672": "Fatigue"
        },
        {
            "C0231218": "general malaise"
        }
    ],
    "unbinned": [
        {
            "C0037088": "Signs and Symptoms"
        },
        {
            "C1535926": "Neurodevelopmental Disorders"
        },
        {
            "C0152021": "Congenital heart disease"
        },
        {
            "C0001418": "Adenocarcinoma"
        },
        {
            "C0030472": "Paraneoplastic Syndromes"
        },
        {
            "C0233535": "Butting"
        },
        {
            "C0010626": "Embryonic cyst"
        },
        {
            "C0013080": "Down Syndrome"
        },
        {
            "C0008679": "Chronic disease"
        },
        {
            "C0019247": "Hereditary Diseases"
        },
        {
            "C0233660": "Mental blocking"
        },
        {
            "C0277562": "Adult disease"
        },
        {
            "C1306459": "Primary malignant neoplasm"
        },
        {
            "C0000768": "Congenital Abnormality"
        },
        {
            "C0020524": "Disorders of Excessive Somnolence"
        },
        {
            "C0009450": "Communicable Diseases"
        },
        {
            "C0020557": "Hypertriglyceridemia"
        },
        {
            "C0564567": "Impulsive character (finding)"
        },
        {
            "C3266843": "47, XYY syndrome"
        },
        {
            "C0033377": "Ptosis"
        },
        {
            "C2931707": "Chromosome 15, trisomy mosaicism"
        },
        {
            "C0851578": "Sleep Disorders"
        },
        {
            "C0332875": "Congenital webbing"
        },
        {
            "C1853490": "22q13.3 Deletion Syndrome"
        },
        {
            "C0012634": "Disease"
        },
        {
            "C0265267": "Congenital Hemidysplasia with Ichthyosiform Erythroderma and Limb Defects"
        },
        {
            "C0027651": "Neoplasms"
        },
        {
            "C1846009": "Intrauterine growth restriction, metaphyseal dysplasia, adrenal hypoplasia congenita, and genital anomaly syndrome"
        },
        {
            "C0242354": "Congenital Disorders"
        },
        {
            "C0236816": "Stress Disorders, Traumatic, Acute"
        },
        {
            "C0020175": "Hunger"
        },
        {
            "C0013336": "Dwarfism"
        },
        {
            "C0152096": "Complete trisomy 18 syndrome"
        },
        {
            "C0008626": "Congenital chromosomal disease"
        },
        {
            "C0013473": "Eating Disorders"
        },
        {
            "C0524528": "Pervasive Development Disorder"
        },
        {
            "C0231243": "Early complication"
        },
        {
            "C0006826": "Malignant Neoplasms"
        },
        {
            "C0025517": "Metabolic Diseases"
        },
        {
            "C0242339": "Dyslipidemias"
        },
        {
            "C0949628": "Uniparental Disomy"
        },
        {
            "C0007222": "Cardiovascular Diseases"
        },
        {
            "C0518214": "Perceived quality of life"
        },
        {
            "C0270549": "Generalized Anxiety Disorder"
        }
    ],
    "ENT": []
}