// ============================================================
// MOCK DATA — Admin Portal Assessments
// Uses Fintilla Score Bands (not generic labels).
// POC ONLY: Replace with Go API calls in production.
// All currency in IDR. Dates in DD/MM/YYYY (Indonesian convention).
// ============================================================

export type ScoreBand =
  | "VERIFIED-STRONG"
  | "VERIFIED-ADEQUATE"
  | "VERIFIED-THIN"
  | "UNVERIFIED"
  | "CONTRADICTED";

export type AdminAssessmentStatus = "Pending" | "Complete" | "Flagged";

export interface AdminAssessment {
  id: string;           // e.g. "ADM-ASS-001"
  loanRef: string;      // e.g. "LN-ID-2026-00124"
  borrower: string;
  businessName: string;
  businessType: string;
  location: string;     // e.g. "Jakarta Selatan, DKI Jakarta"
  province: string;
  city: string;
  assessmentDate: string; // stored ISO "2026-09-04", displayed DD/MM/YYYY
  status: AdminAssessmentStatus;
  scoreBand: ScoreBand;
  requestedAmount: number; // IDR
  notes: string;
  // Additional detail fields
  tenureMonths: number;
  monthlyRevenue: number;
  existingDebt: number;
  creditBureauScore: number; // 300-900
  assignedAnalyst: string;
  riskFactors: string[];
  flags: { type: string; severity: "Low" | "Medium" | "High" | "Critical"; description: string }[];
}

// ── Fintilla Score Band Definitions ────────────────────────────────────────
// These are the canonical descriptions. DO NOT rename or paraphrase.
export const SCORE_BAND_DEFINITIONS: Record<ScoreBand, { signal: string; signalId: string }> = {
  "VERIFIED-STRONG": {
    signal:
      "Top band — affordability is solid, business substance and reconciliation confidence are both high, completeness is good, integrity is clean.",
    signalId:
      "Band teratas — keterjangkauan solid, substansi bisnis dan kepercayaan rekonsiliasi keduanya tinggi, kelengkapan baik, integritas bersih.",
  },
  "VERIFIED-ADEQUATE": {
    signal:
      "Affordability and reconciliation hold up well enough to lend against, just short of the top tier.",
    signalId:
      "Keterjangkauan dan rekonsiliasi cukup untuk dipinjamkan, hanya sedikit di bawah tier teratas.",
  },
  "VERIFIED-THIN": {
    signal:
      "Some independent verification exists but it's sparse — thin reconciliation, weaker completeness, or a business substance rating on the low end.",
    signalId:
      "Beberapa verifikasi independen ada tetapi sedikit — rekonsiliasi tipis, kelengkapan lebih lemah, atau penilaian substansi bisnis di sisi rendah.",
  },
  UNVERIFIED: {
    signal:
      "Not enough independent evidence to confirm the claims either way — an insufficient-evidence outcome, not necessarily a bad one.",
    signalId:
      "Tidak cukup bukti independen untuk mengkonfirmasi klaim baik cara — hasil bukti tidak cukup, belum tentu buruk.",
  },
  CONTRADICTED: {
    signal:
      "The evidence actively conflicts with what the borrower claimed.",
    signalId:
      "Bukti secara aktif bertentangan dengan apa yang diklaim peminjam.",
  },
};

// Score Band ordering (strongest → weakest)
export const SCORE_BAND_ORDER: ScoreBand[] = [
  "VERIFIED-STRONG",
  "VERIFIED-ADEQUATE",
  "VERIFIED-THIN",
  "UNVERIFIED",
  "CONTRADICTED",
];

// ── Mock Assessment Data ────────────────────────────────────────────────────
export const MOCK_ADMIN_ASSESSMENTS: AdminAssessment[] = [
  {
    id: "ADM-ASS-001",
    loanRef: "LN-ID-2026-00124",
    borrower: "Budi Santoso",
    businessName: "Warung Budi",
    businessType: "Warung / Toko Kelontong",
    location: "Jakarta Selatan, DKI Jakarta",
    province: "DKI Jakarta",
    city: "Jakarta Selatan",
    assessmentDate: "2026-09-04",
    status: "Complete",
    scoreBand: "VERIFIED-STRONG",
    requestedAmount: 25000000,
    notes:
      "Usaha warung kelontong yang sudah berjalan 7 tahun. Omset harian stabil, dokumentasi lengkap, tidak ada tanda bahaya.",
    tenureMonths: 24,
    monthlyRevenue: 18500000,
    existingDebt: 0,
    creditBureauScore: 742,
    assignedAnalyst: "Siti Rahma",
    riskFactors: ["Lokasi di kawasan padat - positif untuk warung"],
    flags: [],
  },
  {
    id: "ADM-ASS-002",
    loanRef: "LN-ID-2026-00125",
    borrower: "Rina Marlina",
    businessName: "Toko Baju Rina",
    businessType: "Toko Pakaian",
    location: "Bandung, Jawa Barat",
    province: "Jawa Barat",
    city: "Bandung",
    assessmentDate: "2026-09-03",
    status: "Pending",
    scoreBand: "VERIFIED-ADEQUATE",
    requestedAmount: 50000000,
    notes:
      "Toko pakaian di pasar Cimol Gedebage. Pendapatan musiman, rekonsiliasi keuangan cukup baik.",
    tenureMonths: 36,
    monthlyRevenue: 22000000,
    existingDebt: 8000000,
    creditBureauScore: 685,
    assignedAnalyst: "Budi Hartono",
    riskFactors: ["Pendapatan musiman", "Persaingan pasar tinggi"],
    flags: [],
  },
  {
    id: "ADM-ASS-003",
    loanRef: "LN-ID-2026-00126",
    borrower: "Hendra Gunawan",
    businessName: "Warung Makan Hendra",
    businessType: "Rumah Makan",
    location: "Surabaya, Jawa Timur",
    province: "Jawa Timur",
    city: "Surabaya",
    assessmentDate: "2026-09-02",
    status: "Flagged",
    scoreBand: "VERIFIED-THIN",
    requestedAmount: 35000000,
    notes:
      "Warung makan dengan rekonsiliasi keuangan tipis. Pendapatan tidak konsisten selama 3 bulan terakhir.",
    tenureMonths: 18,
    monthlyRevenue: 12000000,
    existingDebt: 15000000,
    creditBureauScore: 598,
    assignedAnalyst: "Siti Rahma",
    riskFactors: ["Rekonsiliasi tipis", "Pendapatan tidak konsisten", "Utang berjalan signifikan"],
    flags: [
      {
        type: "Inkonsistensi Pendapatan",
        severity: "High",
        description: "Pendapatan bulan Juli dan Agustus 2026 berbeda >40% dari deklarasi.",
      },
    ],
  },
  {
    id: "ADM-ASS-004",
    loanRef: "LN-ID-2026-00127",
    borrower: "Sari Wulandari",
    businessName: "Apotek Sari Sehat",
    businessType: "Apotek",
    location: "Medan, Sumatera Utara",
    province: "Sumatera Utara",
    city: "Medan",
    assessmentDate: "2026-09-01",
    status: "Complete",
    scoreBand: "UNVERIFIED",
    requestedAmount: 75000000,
    notes:
      "Apotek baru berdiri 8 bulan. Tidak cukup data historis untuk verifikasi independen. Bukan indikasi buruk.",
    tenureMonths: 48,
    monthlyRevenue: 35000000,
    existingDebt: 0,
    creditBureauScore: 620,
    assignedAnalyst: "Budi Hartono",
    riskFactors: ["Usaha baru (<1 tahun)", "Rekam jejak terbatas"],
    flags: [],
  },
  {
    id: "ADM-ASS-005",
    loanRef: "LN-ID-2026-00128",
    borrower: "Eko Prasetyo",
    businessName: "Toko Elektronik Eko",
    businessType: "Toko Elektronik",
    location: "Semarang, Jawa Tengah",
    province: "Jawa Tengah",
    city: "Semarang",
    assessmentDate: "2026-08-31",
    status: "Flagged",
    scoreBand: "CONTRADICTED",
    requestedAmount: 100000000,
    notes:
      "Deklarasi pendapatan tidak sesuai dengan data bank. Rekonsiliasi aktif bertentangan dengan klaim peminjam.",
    tenureMonths: 60,
    monthlyRevenue: 45000000,
    existingDebt: 30000000,
    creditBureauScore: 510,
    assignedAnalyst: "Siti Rahma",
    riskFactors: ["Kontradiksi data keuangan", "Utang tinggi", "Skor biro kredit rendah"],
    flags: [
      {
        type: "Kontradiksi Pendapatan",
        severity: "Critical",
        description: "Pendapatan dideklarasikan Rp 45jt/bln tetapi rekening koran menunjukkan rata-rata Rp 18jt/bln.",
      },
      {
        type: "Rasio Utang Tinggi",
        severity: "High",
        description: "Rasio utang terhadap pendapatan melebihi ambang batas 40%.",
      },
    ],
  },
  {
    id: "ADM-ASS-006",
    loanRef: "LN-ID-2026-00129",
    borrower: "Dewi Anggraini",
    businessName: "Toko Sembako Dewi",
    businessType: "Toko Sembako",
    location: "Yogyakarta, DI Yogyakarta",
    province: "DI Yogyakarta",
    city: "Yogyakarta",
    assessmentDate: "2026-08-30",
    status: "Complete",
    scoreBand: "VERIFIED-STRONG",
    requestedAmount: 20000000,
    notes:
      "Toko sembako yang sudah berjalan 10 tahun. Keuangan sangat solid dan dokumentasi lengkap.",
    tenureMonths: 18,
    monthlyRevenue: 28000000,
    existingDebt: 0,
    creditBureauScore: 780,
    assignedAnalyst: "Budi Hartono",
    riskFactors: [],
    flags: [],
  },
  {
    id: "ADM-ASS-007",
    loanRef: "LN-ID-2026-00130",
    borrower: "Agus Setiawan",
    businessName: "Bengkel Motor Agus",
    businessType: "Bengkel Kendaraan",
    location: "Makassar, Sulawesi Selatan",
    province: "Sulawesi Selatan",
    city: "Makassar",
    assessmentDate: "2026-08-29",
    status: "Pending",
    scoreBand: "VERIFIED-ADEQUATE",
    requestedAmount: 40000000,
    notes:
      "Bengkel motor dengan 3 mekanik. Pendapatan cukup konsisten, rekonsiliasi memadai.",
    tenureMonths: 30,
    monthlyRevenue: 19000000,
    existingDebt: 5000000,
    creditBureauScore: 658,
    assignedAnalyst: "Siti Rahma",
    riskFactors: ["Sektor otomotif kompetitif"],
    flags: [],
  },
  {
    id: "ADM-ASS-008",
    loanRef: "LN-ID-2026-00131",
    borrower: "Fitri Handayani",
    businessName: "Salon Kecantikan Fitri",
    businessType: "Salon Kecantikan",
    location: "Denpasar, Bali",
    province: "Bali",
    city: "Denpasar",
    assessmentDate: "2026-08-28",
    status: "Pending",
    scoreBand: "VERIFIED-THIN",
    requestedAmount: 30000000,
    notes:
      "Salon kecantikan di area wisata. Pendapatan fluktuatif sesuai musim pariwisata.",
    tenureMonths: 24,
    monthlyRevenue: 14000000,
    existingDebt: 12000000,
    creditBureauScore: 612,
    assignedAnalyst: "Budi Hartono",
    riskFactors: ["Pendapatan musiman (tergantung pariwisata)", "Utang berjalan"],
    flags: [],
  },
  {
    id: "ADM-ASS-009",
    loanRef: "LN-ID-2026-00132",
    borrower: "Rudi Hermawan",
    businessName: "Toko Hardware Rudi",
    businessType: "Toko Bahan Bangunan",
    location: "Palembang, Sumatera Selatan",
    province: "Sumatera Selatan",
    city: "Palembang",
    assessmentDate: "2026-08-27",
    status: "Complete",
    scoreBand: "VERIFIED-ADEQUATE",
    requestedAmount: 60000000,
    notes:
      "Toko bahan bangunan dengan rekam jejak 5 tahun. Keuangan cukup solid, satu entri utang berjalan.",
    tenureMonths: 36,
    monthlyRevenue: 32000000,
    existingDebt: 10000000,
    creditBureauScore: 695,
    assignedAnalyst: "Siti Rahma",
    riskFactors: ["Persaingan dari toko besar (Indomaret/Alfamart)"],
    flags: [],
  },
  {
    id: "ADM-ASS-010",
    loanRef: "LN-ID-2026-00133",
    borrower: "Yanti Susanti",
    businessName: "Warung Nasi Yanti",
    businessType: "Warung Makan",
    location: "Bandung, Jawa Barat",
    province: "Jawa Barat",
    city: "Bandung",
    assessmentDate: "2026-08-26",
    status: "Flagged",
    scoreBand: "CONTRADICTED",
    requestedAmount: 15000000,
    notes:
      "Warung nasi dengan deklarasi omset tidak konsisten dengan laporan pajak yang tersedia.",
    tenureMonths: 12,
    monthlyRevenue: 8000000,
    existingDebt: 7000000,
    creditBureauScore: 490,
    assignedAnalyst: "Budi Hartono",
    riskFactors: ["Kontradiksi data pajak", "Skor kredit sangat rendah", "Utang mendekati kapasitas"],
    flags: [
      {
        type: "Kontradiksi Data Pajak",
        severity: "Critical",
        description: "Laporan pajak menunjukkan omset 60% lebih rendah dari yang dideklarasikan.",
      },
    ],
  },
  {
    id: "ADM-ASS-011",
    loanRef: "LN-ID-2026-00134",
    borrower: "Prasetyo Nugroho",
    businessName: "Toko Pulsa dan Gadget Pras",
    businessType: "Toko Pulsa & Aksesori",
    location: "Jakarta Timur, DKI Jakarta",
    province: "DKI Jakarta",
    city: "Jakarta Timur",
    assessmentDate: "2026-08-25",
    status: "Complete",
    scoreBand: "UNVERIFIED",
    requestedAmount: 20000000,
    notes:
      "Toko pulsa dan aksesori gadget. Usaha baru 6 bulan, belum ada rekam jejak keuangan yang memadai.",
    tenureMonths: 18,
    monthlyRevenue: 11000000,
    existingDebt: 0,
    creditBureauScore: 590,
    assignedAnalyst: "Siti Rahma",
    riskFactors: ["Usaha sangat baru (<1 tahun)", "Sektor telepon kompetitif"],
    flags: [],
  },
  {
    id: "ADM-ASS-012",
    loanRef: "LN-ID-2026-00135",
    borrower: "Lestari Wahyuni",
    businessName: "Klinik Kecantikan Lestari",
    businessType: "Klinik Kecantikan",
    location: "Surabaya, Jawa Timur",
    province: "Jawa Timur",
    city: "Surabaya",
    assessmentDate: "2026-08-24",
    status: "Complete",
    scoreBand: "VERIFIED-STRONG",
    requestedAmount: 80000000,
    notes:
      "Klinik kecantikan dengan dokter spesialis kulit. Pendapatan sangat stabil, dokumentasi lengkap, tidak ada tanda bahaya.",
    tenureMonths: 48,
    monthlyRevenue: 65000000,
    existingDebt: 0,
    creditBureauScore: 798,
    assignedAnalyst: "Budi Hartono",
    riskFactors: [],
    flags: [],
  },
  {
    id: "ADM-ASS-013",
    loanRef: "LN-ID-2026-00136",
    borrower: "Wahyu Eko",
    businessName: "Mini Market Wahyu",
    businessType: "Minimarket",
    location: "Depok, Jawa Barat",
    province: "Jawa Barat",
    city: "Depok",
    assessmentDate: "2026-08-23",
    status: "Pending",
    scoreBand: "VERIFIED-THIN",
    requestedAmount: 45000000,
    notes:
      "Minimarket yang baru beralih dari warung kelontong 1 tahun lalu. Rekonsiliasi tipis karena transisi sistem.",
    tenureMonths: 30,
    monthlyRevenue: 24000000,
    existingDebt: 18000000,
    creditBureauScore: 630,
    assignedAnalyst: "Siti Rahma",
    riskFactors: ["Transisi model bisnis", "Rekonsiliasi tipis", "Persaingan minimarket besar"],
    flags: [],
  },
  {
    id: "ADM-ASS-014",
    loanRef: "LN-ID-2026-00137",
    borrower: "Nur Halimah",
    businessName: "Catering Nur Halimah",
    businessType: "Katering",
    location: "Tangerang, Banten",
    province: "Banten",
    city: "Tangerang",
    assessmentDate: "2026-08-22",
    status: "Complete",
    scoreBand: "VERIFIED-ADEQUATE",
    requestedAmount: 55000000,
    notes:
      "Usaha katering dengan kontrak reguler dari perusahaan sekitar. Pendapatan cukup stabil.",
    tenureMonths: 36,
    monthlyRevenue: 38000000,
    existingDebt: 12000000,
    creditBureauScore: 671,
    assignedAnalyst: "Budi Hartono",
    riskFactors: ["Ketergantungan pada kontrak korporat"],
    flags: [],
  },
  {
    id: "ADM-ASS-015",
    loanRef: "LN-ID-2026-00138",
    borrower: "Doni Pratama",
    businessName: "Toko Komputer Doni",
    businessType: "Toko Komputer & Aksesori",
    location: "Bogor, Jawa Barat",
    province: "Jawa Barat",
    city: "Bogor",
    assessmentDate: "2026-08-21",
    status: "Flagged",
    scoreBand: "CONTRADICTED",
    requestedAmount: 90000000,
    notes:
      "Toko komputer dengan inkonsistensi serius antara deklarasi dan data pihak ketiga.",
    tenureMonths: 60,
    monthlyRevenue: 42000000,
    existingDebt: 40000000,
    creditBureauScore: 480,
    assignedAnalyst: "Siti Rahma",
    riskFactors: ["Kontradiksi data serius", "Utang sangat tinggi", "Skor kredit kritis"],
    flags: [
      {
        type: "Kontradiksi Data Rekening",
        severity: "Critical",
        description: "Mutasi rekening tidak mendukung klaim pendapatan bulanan yang dideklarasikan.",
      },
      {
        type: "Rasio Utang Kritis",
        severity: "Critical",
        description: "Total utang berjalan melebihi 95% pendapatan tahunan yang dideklarasikan.",
      },
    ],
  },
  {
    id: "ADM-ASS-016",
    loanRef: "LN-ID-2026-00139",
    borrower: "Sri Mulyani",
    businessName: "Laundry Sri Bersih",
    businessType: "Laundry",
    location: "Bekasi, Jawa Barat",
    province: "Jawa Barat",
    city: "Bekasi",
    assessmentDate: "2026-08-20",
    status: "Complete",
    scoreBand: "VERIFIED-STRONG",
    requestedAmount: 18000000,
    notes:
      "Laundry kiloan dengan pelanggan tetap area perumahan. Keuangan sangat bersih, tidak ada tanda bahaya.",
    tenureMonths: 24,
    monthlyRevenue: 16000000,
    existingDebt: 0,
    creditBureauScore: 751,
    assignedAnalyst: "Budi Hartono",
    riskFactors: [],
    flags: [],
  },
];
