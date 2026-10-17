export interface Question {
  id: string;
  source: string;
  no: number;
  q: string;
  options: string[];
  ans: number[]; // Index of correct options (0-based)
  category: string;
  explanation: string;
  imgHint?: string;
  isMultiSelect?: boolean;
}

export interface ExamSession {
  id: string;
  mode: 'exam' | 'practice';
  startTime: number;
  durationMinutes: number;
  timeRemainingSeconds: number;
  questionIds: string[]; // List of question IDs included in this session
  answers: Record<string, number | number[]>; // questionId -> selected index or indices
  markedForReview: Record<string, boolean>;
  completed: boolean;
  score?: number;
  completedAt?: string;
  totalQuestions: number;
  correctCount?: number;
}

export interface ExamHistoryRecord {
  id: string;
  date: string;
  mode: 'exam' | 'practice';
  score: number;
  correctCount: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  categoryBreakdown: Record<string, { total: number; correct: number }>;
}

export const BANK_SOAL_KATEKUMEN_80: Question[] = [
  {
    id: "q_1",
    source: "Quizizz Katekumen Des 2021",
    no: 1,
    q: "Pemahaman dalam Gereja Katolik tentang Allah yang memiliki satu kodrat, tiga pribadi dinamakan ...",
    options: ["Trilogi Agama", "Tri Dharma Illahi", "Tritugas Kristus", "Trinitas", "Trimurthi"],
    ans: [3],
    category: "Trinitas & Teologi",
    explanation: "Ajaran Trinitas Mahakudus menyatakan bahwa Allah adalah satu hakikat/kodrat (substantia/ousia) dalam tiga Pribadi Ilahi yang sehakikat: Allah Bapa, Allah Putera, dan Allah Roh Kudus."
  },
  {
    id: "q_2",
    source: "Quizizz Katekumen Des 2021",
    no: 2,
    q: "Ungkapan/rumusan iman Katolik yang jelas, padat ada dalam doa ...",
    options: ["Bapa kami", "Aku Percaya", "Doa Tobat", "Salam Maria"],
    ans: [1],
    category: "Pengakuan Iman",
    explanation: "Doa 'Aku Percaya' (Kredo / Syahadat Para Rasul dan Syahadat Nicea-Konstantinopel) merupakan rangkuman resmi serta rumusan ringkas dan padat seluruh pokok iman Katolik."
  },
  {
    id: "q_3",
    source: "Quizizz Katekumen Des 2021",
    no: 3,
    q: "Pemahaman akan tindakan Allah yang menyingkapkan DiriNya dan rencana keselamatanNya untuk semua ciptaan merupakan definisi dasar dari... .",
    options: ["Wahyu", "Iman", "Baptis", "Tobat"],
    ans: [0],
    category: "Wahyu & Kitab Suci",
    explanation: "Wahyu Ilahi (revelatio) adalah tindakan kasih Allah yang secara bebas menyingkapkan Diri-Nya serta kehendak keselamatan-Nya kepada umat manusia sepanjang sejarah keselamatan."
  },
  {
    id: "q_4",
    source: "Quizizz Katekumen Des 2021",
    no: 4,
    q: "Dalam Perjanjian Lama (PL), pewahyuan Allah disampaikan lewat pewartaan para nabi, sedangkan dalam Perjanjian Baru (PB) pewahyuan tersebut terpenuhi dalam diri... .",
    options: ["Gereja", "Bunda Maria", "Para kudus", "Yesus Kristus"],
    ans: [3],
    category: "Wahyu & Kitab Suci",
    explanation: "Surat Ibrani (Ibr 1:1-2) menegaskan bahwa setelah berulang kali Allah berfirman lewat para nabi, pada zaman akhir ini Ia berfirman kepada kita dengan perantaraan Anak-Nya, Yesus Kristus, yang adalah kepenuhan wahyu Allah."
  },
  {
    id: "q_5",
    source: "Quizizz Katekumen Des 2021",
    no: 5,
    q: "Gerakan iman di mana orang percaya akan wahyu Allah karena daya akal budinya, karena mendengarkan atau membaca sesuatu dari kitab Suci, dinamakan... .",
    options: ["Doing", "Trusting", "Believing", "Inspirasi"],
    ans: [2],
    category: "Dinamika Iman",
    explanation: "Tiga dimensi iman Katolik meliputi: Believing (tahu dan percaya akan kebenaran wahyu Allah dengan akal budi), Trusting (menyerahkan diri seutuhnya dalam harapan dan kasih), dan Doing (mengamalkan iman dalam tindakan nyata)."
  },
  {
    id: "q_6",
    source: "Quizizz Katekumen Des 2021",
    no: 6,
    q: "Dalam sejarah keselamatan, tokoh dalam Perjanjian Lama yang dijuluki sebagai Bapa Orang Beriman yakni... .",
    options: ["Ishak", "Yakub", "Musa", "Abraham"],
    ans: [3],
    category: "Tokoh Perjanjian Lama",
    explanation: "Abraham diakui sebagai 'Bapa Orang Beriman' karena kesetiaan dan ketaatannya yang mutlak saat dipanggil meninggalkan tanah kelahirannya demi janji keselamatan Allah."
  },
  {
    id: "q_7",
    source: "Quizizz Katekumen Des 2021",
    no: 7,
    q: "Dalam sejarah keselamatan Bangsa Israel, tiga tokoh yang dikenal sebagai \"Bapa-Bapa Bangsa\" Israel yakni... .",
    options: ["Abraham – Ayub – Ismail", "Abraham – Ishak – Musa", "Abraham – Ishak - Yakub", "Abraham – Ishak – Salomo"],
    ans: [2],
    category: "Sejarah Keselamatan",
    explanation: "Tiga patriark besar (Bapa Bangsa) Israel adalah Abraham, putranya Ishak, dan cucunya Yakub yang kemudian dianugerahi nama Israel."
  },
  {
    id: "q_8",
    source: "Quizizz Katekumen Des 2021",
    no: 8,
    q: "Alasan pokok yang melatarbelakangi munculnya rumusan Syahadat Nikea-Konstantinopel (syahadat panjang) yakni...",
    options: ["Rumusan yang pendek sudah kuno", "Menanggapi beberapa ajaran sesat yang muncul saat itu", "Dirumuskan oleh para ahli bahasa sehingga mudah dipahami", "Syahadat yang pendek ditulis dalam bahasa Latin"],
    ans: [1],
    category: "Pengakuan Iman",
    explanation: "Syahadat Nicea-Konstantinopel dirumuskan dalam Konsili Nicea (325 M) & Konstantinopel (381 M) untuk membela ajaran benar Gereja dan menolak ajaran sesat seperti Arianisme yang menyangkal keallahan Kristus."
  },
  {
    id: "q_9",
    source: "Quizizz Katekumen Des 2021",
    no: 9,
    q: "Proses penerusan (transmisi) pengalaman iman dan kebenarannya dari para rasul yang hidup bersama Yesus, kepada para pengganti mereka (dari generasi ke generasi selanjutnya) dinamakan...",
    options: ["Tradisi suci", "Inkulturasi iman dan budaya", "Tradisi budaya", "Magisterium"],
    ans: [0],
    category: "Pilar Kebenaran Iman",
    explanation: "Tradisi Suci (Sacra Traditio) adalah penerusan hidup kabar gembira keselamatan yang diterima para rasul dari Yesus Kristus dan Roh Kudus kepada para penerus mereka dari generasi ke generasi."
  },
  {
    id: "q_10",
    source: "Quizizz Katekumen Des 2021",
    no: 10,
    q: "Tiga pilar kebenaran iman dalam Gereja Katolik yakni...",
    options: ["Ekaristi, Tradisi Suci, dan Novena", "Kitab Suci, Tradisi Suci, dan Magisterium", "Magisterium, Hierarki, dan Para Uskup", "Doa Aku Percaya, Doa Bapa kami, Rosario"],
    ans: [1],
    category: "Pilar Kebenaran Iman",
    explanation: "Menurut Konstitusi Dogmatis Dei Verbum No. 10, tiga pilar penjamin kebenaran iman Katolik adalah Kitab Suci, Tradisi Suci, dan Magisterium (Wewenang Mengajar Gereja)."
  },
  {
    id: "q_11",
    source: "Quizizz Katekumen Des 2021",
    no: 11,
    q: "Dalam Tradisi Gereja Katolik, proses pemilihan Paus sebagai Pengganti Takhta Petrus dinamakan ... .",
    options: ["Tahbisan", "Konsili Vatikan", "Konklaf", "Pelantikan"],
    ans: [2],
    category: "Hierarki & Tradisi Gereja",
    explanation: "Konklaf (dari kata Latin 'cum clave' = dengan kunci) adalah sidang tertutup para Kardinal di Kapel Sistina untuk memilih Paus baru sebagai Uskup Roma dan Penerus Takhta Santo Petrus."
  },
  {
    id: "q_12",
    source: "Quizizz Katekumen Des 2021",
    no: 12,
    q: "Jumlah seluruh tulisan dalam PL dan PB yang pada akhirnya diterima dan diakui sebagai Alkitab dalam Gereja Katolik adalah... .",
    options: ["46", "73", "75", "76"],
    ans: [1],
    category: "Wahyu & Kitab Suci",
    explanation: "Kanon Alkitab Katolik terdiri dari 73 kitab: 46 kitab Perjanjian Lama (termasuk 7 kitab Deuterokanonika) dan 27 kitab Perjanjian Baru."
  },
  {
    id: "q_13",
    source: "Quizizz Katekumen Des 2021",
    no: 13,
    q: "Dalam kebiasaan baik Gereja dalam liturgi, yang disebut sebagai Bulan Kitab Suci (BKS) yakni bulan ....",
    options: ["Mei", "Juni", "September", "Oktober"],
    ans: [2],
    category: "Liturgi & Kalender Gereja",
    explanation: "Bulan Kitab Suci Nasional (BKSN) diperingati setiap bulan September di Gereja Katolik Indonesia, berpuncak pada peringatan Santo Hieronimus pada 30 September."
  },
  {
    id: "q_14",
    source: "Quizizz Katekumen Des 2021",
    no: 14,
    q: "“Barangsiapa tidak mengenal Kitab Suci, ia juga tidak akan mengenal Kristus”. Pernyataan tersebut adalah bentuk penghayatan hidup dari Santo ... yang dalam kalender liturgi diperingati setiap tanggal 30 September dalam tiap tahun.",
    options: ["Paulus", "Fransiskus Xaverius", "Hieronimus", "Yohanes"],
    ans: [2],
    category: "Orang Kudus & Tradisi",
    explanation: "Santo Hieronimus adalah pujangga Gereja yang menerjemahkan Alkitab ke dalam bahasa Latin (Vulgata) dan menyatakan: 'Ignoratio Scripturarum ignoratio Christi est'."
  },
  {
    id: "q_15",
    source: "Quizizz Katekumen Des 2021",
    no: 15,
    q: "Wewenang mengajar dan atau menafsirkan Alkitab secara gerejawi dan membagikannya kepada umat beriman disebut....",
    options: ["Magisterium", "Para biarawan-biarawati", "Tradisi Suci", "Seminarium"],
    ans: [0],
    category: "Pilar Kebenaran Iman",
    explanation: "Magisterium adalah kuasa atau wewenang mengajar otentik Gereja yang dipegang oleh Paus bersama para Uskup untuk menafsirkan firman Allah secara sah dan berwibawa."
  },
  {
    id: "q_16",
    source: "Quizizz Katekumen Des 2021",
    no: 16,
    q: "Dalam tradisi Gereja Katolik, perayaan kelahiran Yesus yang dirayakan sebagai Hari Raya Natal merupakan peristiwa dimana Allah mengambil wujud/menjadi manusia) dan disebut dengan istilah ... .",
    options: ["Inkarnasi", "Reinkarnasi", "Transformasi", "Informasi"],
    ans: [0],
    category: "Kristologi & Natal",
    explanation: "Inkarnasi (dari bahasa Latin 'in carne' = menjadi manusia/daging) adalah misteri iman di mana Firman Allah yang kekal mengambil kodrat manusia dalam diri Yesus Kristus (Yoh 1:14)."
  },
  {
    id: "q_17",
    source: "Quizizz Katekumen Des 2021",
    no: 17,
    q: "Tokoh dalam Kitab Suci yang membaptis Yesus di Sungai Yordan yakni ... .",
    options: ["Matius", "Paulus", "Yohanes Pembaptis", "Lukas"],
    ans: [2],
    category: "Kisah Injil",
    explanation: "Yohanes Pembaptis membaptis Yesus di Sungai Yordan sebagai permulaan karya publik Tuhan Yesus (Matius 3:13-17)."
  },
  {
    id: "q_18",
    source: "Quizizz Katekumen Des 2021",
    no: 18,
    q: "Begitu Yesus keluar dari air saat dibaptis, maka Roh Kudus hadir dan muncul dalam rupa ... .",
    options: ["Lidah-lidah nyala api", "Burung merpati", "Semak yang terbakar api", "Tiupan angin sepoi-sepoi"],
    ans: [1],
    category: "Kisah Injil",
    explanation: "Ketika Yesus dibaptis dan keluar dari air, langit terbuka dan Roh Kudus turun ke atas-Nya dalam rupa burung merpati (Lukas 3:22)."
  },
  {
    id: "q_19",
    source: "Quizizz Katekumen Des 2021",
    no: 19,
    q: "Dalam karyaNya di dunia, Yesus mempermaklumkan Kerajaan Allah dengan ... dan ....",
    options: ["Perkataan dan perumpamaan", "Perkataan dan tindakan nyata", "Kuasa dan ketrampilan dari kedua orangtuanya", "Kuasa dan wewenangnya sendiri"],
    ans: [1],
    category: "Karya Pelayanan Yesus",
    explanation: "Yesus mewartakan Kerajaan Allah secara utuh lewat perkataan (khotbah, pengajaran) yang senantiasa disertai tindakan nyata (mukjizat, kesembuhan, belas kasih kepada kaum lemah)."
  },
  {
    id: "q_20",
    source: "Quizizz Katekumen Des 2021",
    no: 20,
    q: "Dalam tradisi Gereja, Yesus wafat dengan cara disalibkan pada usia ... .",
    options: ["23 tahun", "33 tahun", "43 tahun", "53 tahun"],
    ans: [1],
    category: "Kisah Sengsara Kristus",
    explanation: "Berdasarkan catatan Kitab Suci dan tradisi sejarah Gereja, Yesus memulai karya publik sekitar umur 30 tahun dan wafat di salib pada usia sekitar 33 tahun."
  },
  {
    id: "q_21",
    source: "Quizizz Katekumen Des 2021",
    no: 21,
    q: "Secara liturgis, peristiwa sengsara dan wafat Yesus, dalam tradisi Gereja Katolik, diperingati secara khusus pada hari ...",
    options: ["Rabu Abu", "Kamis Putih", "Jumat Agung", "Jumat Kramat", "Minggu Paskah"],
    ans: [2],
    category: "Liturgi & Pekan Suci",
    explanation: "Jumat Agung merupakan puncak peringatan liturgis sengsara dan wafat Tuhan Yesus Kristus di kayu salib pada rangkaian Trihari Suci Paskah."
  },
  {
    id: "q_22",
    source: "Quizizz Katekumen Des 2021",
    no: 22,
    q: "Tanda nyata bahwa Yesus bersolider terhadap manusia yang lemah dan ditolak yakni peristiwa salib sebagai tindakan “kenosis”. Kenosis artinya ...",
    options: ["Peninggian diri", "Kehebatan diri", "Kekuasaan ilahi", "Pengosongan diri"],
    ans: [3],
    category: "Kristologi & Teologi Salib",
    explanation: "Kenosis (Filipi 2:7) berarti pengosongan diri. Kristus merelakan keallahan dan kemuliaan-Nya demi mengambil rupa seorang hamba untuk menebus manusia."
  },
  {
    id: "q_23",
    source: "Quizizz Katekumen Des 2021",
    no: 23,
    q: "Gereja Katolik memahami “Kitab Suci” sebagai ….",
    options: ["Buku Sejarah", "Kitab dari Surga", "Refleksi Iman atas Wahyu", "Sakramen"],
    ans: [2],
    category: "Wahyu & Kitab Suci",
    explanation: "Gereja Katolik memahami Kitab Suci sebagai tulisan hasil refleksi iman umat Allah yang diinspirasikan oleh Roh Kudus atas karya wahyu dan penyelamatan Allah."
  },
  {
    id: "q_24",
    source: "Quizizz Katekumen Des 2021",
    no: 24,
    q: "Arti dan makna penting dari pemahaman tentang Gereja adalah...",
    options: ["Bangunan", "Tempat doa", "Tempat suci", "seperti di surga", "Persekutuan umat Allah"],
    ans: [4],
    category: "Ekklesiologi",
    explanation: "Hakikat Gereja menurut Konsili Vatikan II (Lumen Gentium) adalah Persekutuan Umat Allah (Populus Dei) yang dipanggil dan dihimpun oleh Kristus dalam persekutuan Roh Kudus."
  },
  {
    id: "q_25",
    source: "Quizizz Katekumen Des 2021",
    no: 25,
    q: "Berdasarkan syahadat iman yang panjang, ada empat sifat (Ciri Pokok) Gereja yakni...",
    options: ["Suci – Kudus – Katolik – Apostolik", "Luhur – mulia – kudus – katolik", "Satu – Kudus – Katolik – Apostolik", "Martyria-Koinonia-Liturgia-DIakonia", "Iman – harapan – cintakasih – kebangkitan"],
    ans: [2],
    category: "Sifat-Sifat Gereja",
    explanation: "Empat sifat hakiki Gereja dalam Syahadat Nicea-Konstantinopel adalah: Satu, Kudus, Katolik, dan Apostolik."
  },
  {
    id: "q_26",
    source: "Quizizz Katekumen Des 2021",
    no: 26,
    q: "Berikut ini yang merupakan lima tugas pokok Gereja yang benar sesuai dengan Kis 2: 41-47 yakni...",
    options: ["Liturgia – kerygma – apostolika – koinonia – martyria", "Liturgia – metanoia – apostolika – koinonia – martyria", "Liturgia – kerygma - koinonia – diakonia - martyria", "Apostolika – liturgia – kenosis – diakonia – martyria", "Liturgia – kerygma – koinonia – metanoia – martyria"],
    ans: [2],
    category: "Pancatugas Gereja",
    explanation: "Pancatugas Gereja meliputi: Liturgia (pengudusan/ibadat), Kerygma (pewartaan sabda), Koinonia (persekutuan), Diakonia (pelayanan kasih), dan Martyria (kesaksian hidup)."
  },
  {
    id: "q_27",
    source: "Quizizz Katekumen Des 2021",
    no: 27,
    q: "Melakukan tindakan donor darah, memberikan perhatian kepada warga yang sakit atau lansia, memberikan pelayanan karitatif, dll merupakan contoh penghayatan dalam tugas pokok Gereja, tepatnya dalam bidang...",
    options: ["Liturgia", "Kerygma", "Koinonia", "Diakonia", "Martyria"],
    ans: [3],
    category: "Pancatugas Gereja",
    explanation: "Diakonia adalah karya pelayanan dan cinta kasih sosial nyata kepada sesama yang membutuhkan, sakit, miskin, dan tersingkir."
  },
  {
    id: "q_28",
    source: "Quizizz Katekumen Des 2021",
    no: 28,
    q: "Berani memimpin doa dalam kegiatan tertentu, berani menjadi pemimpin ibadat sabda di lingkungan, berani memilih menjadi petugas dalam misa adalah contoh menghayati tugas pokok Gereja dalam bidang...",
    options: ["Liturgia", "Kerygma", "Koinonia", "Diakonia", "Martyria"],
    ans: [0],
    category: "Pancatugas Gereja",
    explanation: "Liturgia mencakup seluruh pelayanan peribadatan resmi dan doa Gereja, termasuk memimpin doa lingkungan, lektor, paduan suara, prodiakon, maupun misdinar."
  },
  {
    id: "q_29",
    source: "Quizizz Katekumen Des 2021",
    no: 29,
    q: "Secara liturgis, imamat umum diterima oleh semua orang beriman pada saat...",
    options: ["Diampuni dosa-dosanya", "Dibaptis", "Menerima sakramen Mahakudus", "Merayakan ekaristi", "Ditahbiskan"],
    ans: [1],
    category: "Sakramen & Imamat",
    explanation: "Melalui Sakramen Baptis, setiap orang beriman diurapi dan diikutsertakan dalam imamat umum umat beriman (tugas imam, nabi, dan raja Kristus)."
  },
  {
    id: "q_30",
    source: "Quizizz Katekumen Des 2021",
    no: 30,
    q: "Tanda dan sarana keselamatan dari Allah bagi manusia merupakan pemahaman dasar dari...",
    options: ["Iman", "Wahyu", "Anugrah", "Sakramen", "Sakramentali"],
    ans: [3],
    category: "Sakramen",
    explanation: "Sakramen adalah tanda kelihatan yang berdaya guna dari rahmat Allah yang tak kelihatan, yang ditetapkan oleh Kristus dan dipercayakan kepada Gereja."
  },
  {
    id: "q_31",
    source: "Quizizz Katekumen Des 2021",
    no: 31,
    q: "Yang termasuk dalam kelompok Sakramen inisiasi yakni...",
    options: ["Baptis – ekaristi – imamat", "Baptis – tobat – pengurapan orang sakit", "Baptis – perkawinan – imamat", "Baptis – rekonsiliasi- imamat", "Baptis – ekaristi - krisma"],
    ans: [4],
    category: "Sakramen",
    explanation: "Tiga Sakramen Inisiasi Katolik yang meletakkan dasar hidup beriman penuh adalah Sakramen Baptis, Sakramen Penguatan (Krisma), dan Sakramen Ekaristi."
  },
  {
    id: "q_32",
    source: "Quizizz Katekumen Des 2021",
    no: 32,
    q: "Yang tergolong dalam kelompok \"sakramen pengampunan\" yakni...",
    options: ["Baptis dan Krisma", "Baptis dan Rekonsiliasi", "Rekonsiliasi dan Perkawinan", "Perkawinan dan imamat", "Rekonsiliasi dan Pengurapan orang sakit"],
    ans: [4],
    category: "Sakramen",
    explanation: "Sakramen penyembuhan dan pengampunan/pemulihan luka dosa dan fisik terdiri dari Sakramen Rekonsiliasi (Tobat) dan Sakramen Pengurapan Orang Sakit."
  },
  {
    id: "q_33",
    source: "Quizizz Katekumen Des 2021",
    no: 33,
    q: "Dalam Gereja Katolik, Sakramen panggilan hidup meliputi ....",
    options: ["Perkawinan dan Imamat", "Baptis dan imamat", "Pengurapan Orang Sakit dan Rekonsiliasi", "Ekaristi dan Perkawinan", "Semua sakramen"],
    ans: [0],
    category: "Sakramen",
    explanation: "Sakramen panggilan hidup dan pelayanan bagi persekutuan umat beriman adalah Sakramen Perkawinan dan Sakramen Imamat (Tahbisan Suci)."
  },
  {
    id: "q_34",
    source: "Quizizz Katekumen Des 2021",
    no: 34,
    q: "Sifat utama (Ciri Pokok) dalam Perkawinan secara katolik adalah...",
    options: ["Monogami (satu) dan boleh cerai", "Monogami (Satu) dan poligami", "Monogami (Satu) dan tak terceraikan", "Luhur dan mulia", "Suci dan murni"],
    ans: [2],
    category: "Sakramen Perkawinan",
    explanation: "Ciri hakiki perkawinan Katolik adalah monogami (satu pria dengan satu wanita) dan tak terceraikan (indissolubilitas) hingga maut memisahkan."
  },
  {
    id: "q_35",
    source: "Quizizz Katekumen Des 2021",
    no: 35,
    q: "Masa menjelang Hari Raya Natal yang biasanya berlangusng selama empat pekan, dalam tradisi Gereja katolik disebut masa penantian atau istilahnya masa...",
    options: ["Anamnese", "Advent", "Adventure", "Pra-paskah", "Paskah"],
    ans: [1],
    category: "Liturgi & Kalender Gereja",
    explanation: "Masa Adven (dari kata Latin 'adventus' = kedatangan) berlangsung selama 4 pekan menjelang Natal untuk menyiapkan hati menyambut kedatangan Kristus."
  },
  {
    id: "q_36",
    source: "Quizizz Katekumen Des 2021",
    no: 36,
    q: "Masa puasa dalam tradisi Gereja katolik berlangsung selama ... hari.",
    options: ["10 hari", "20 hari", "30 hari", "40 hari", "50 hari"],
    ans: [3],
    category: "Liturgi & Kalender Gereja",
    explanation: "Masa Puasa Katolik (Masa Pra-Paskah) berlangsung selama 40 hari, meneladani puasa Yesus di padang gurun dan perjalanan 40 tahun bangsa Israel."
  },
  {
    id: "q_37",
    source: "Quizizz Katekumen Des 2021",
    no: 37,
    q: "Warna liturgi dalam Gereja katolik selama masa Pra-paskah yakni ....",
    options: ["Putih", "Merah", "Hijau", "Hitam", "Ungu"],
    ans: [4],
    category: "Liturgi & Simbol",
    explanation: "Warna liturgi ungu melambangkan tobat, mati raga, penyesalan, dan mawas diri, digunakan pada masa Adven dan Pra-Paskah."
  },
  {
    id: "q_38",
    source: "Quizizz Katekumen Des 2021",
    no: 38,
    q: "Warna liturgi yang dipakai sepanjang masa biasa yang berlangsung selama 33/34 pekan adalah ...",
    options: ["Putih", "Merah", "Hijau", "Hitam", "Ungu"],
    ans: [2],
    category: "Liturgi & Simbol",
    explanation: "Warna hijau dipakai sepanjang Masa Biasa (Tempus per Annum) sebagai lambang pertumbuhan rohani, kesuburan iman, dan pengharapan dalam Kristus."
  },
  {
    id: "q_39",
    source: "Quizizz Katekumen Des 2021",
    no: 39,
    q: "Dalam tradisi Katolik, kebaktian, sumpah, kesalehan, cinta bakti yang mengarahkan diri kepada seseorang atau sesuatu yang dijunjung tinggi dan dicintai sebagai bentuk penghayatan iman seseorang di luar liturgi resmi dinamakan...",
    options: ["Doa pribadi", "Novena", "Devosi", "Ungkapan iman", "Ungkapan tobat"],
    ans: [2],
    category: "Spiritualitas & Devosi",
    explanation: "Devosi adalah bentuk kesalehan dan kebaktian umat beriman (seperti Rosario, Jalan Salib, Novena) di luar liturgi resmi yang memperkaya hidup iman kristiani."
  },
  {
    id: "q_40",
    source: "Quizizz Katekumen Des 2021",
    no: 40,
    imgHint: "Bejana suci bundar berkilau keemasan dengan pancaran sinar matahari untuk meletakkan Hosti Kudus saat Adorasi.",
    q: "Tempat suci yang sering dipakai untuk mentakhtakan Sakramen Mahakudus saat adorasi dinamakan ...",
    options: ["Piala", "Sibori", "Ampul", "Aspergilum", "Monstrans"],
    ans: [4],
    category: "Perlengkapan Liturgi",
    explanation: "Monstrans (dari bahasa Latin 'monstrare' = memperlihatkan) adalah wadah bejana suci berhias sinar keemasan tempat mentakhtakan Hosti Kudus saat Adorasi Ekaristi."
  },
  {
    id: "q_41",
    source: "Quizizz Katekumen Des 2021",
    no: 41,
    q: "Dalam penanggalan liturgi Gereja katolik, untuk menghormati peran keimanan Bunda Maria dalam karya keselamatan Allah, maka pada setiap tanggal 1 Januari dirayakan sebagai Hari Raya ... .",
    options: ["Maria, Bunda Allah", "Maria, Bunda Yesus", "Maria, ratu Rosario", "Maria, Bunda Penebus manusia"],
    ans: [0],
    category: "Maria & Dogma",
    explanation: "Pada 1 Januari, Gereja Katolik merayakan Hari Raya Santa Perawan Maria Bunda Allah (Theotokos) sebagai puncak perayaan Oktaf Natal."
  },
  {
    id: "q_42",
    source: "Quizizz Katekumen Des 2021",
    no: 42,
    q: "Dalam kebiasaan Gereja Katolik, yang disebut sebagai Bulan Rosario yakni ... .",
    options: ["Bulan Mei", "Bulan Juni", "Bulan September", "Bulan Oktober"],
    ans: [3],
    category: "Liturgi & Kalender Gereja",
    explanation: "Bulan Oktober secara khusus didedikasikan Gereja sebagai Bulan Rosario (untuk mengenang kemenangan doa Rosario pada peristiwa Lepanto), sedangkan bulan Mei adalah Bulan Maria."
  },
  {
    id: "q_43",
    source: "Quizizz Katekumen Des 2021",
    no: 43,
    q: "Dalam sejarah keselamatan Bangsa Israel pada masa Perjanjian Lama (PL), Tokoh yang mewakili Umat Israel menerima 10 Perintah Allah di Gunung Sinai yakni ... .",
    options: ["Abraham", "Ishak", "Yakub", "Musa"],
    ans: [3],
    category: "Tokoh Perjanjian Lama",
    explanation: "Nabi Musa adalah perantara yang dipanggil Allah ke puncak Gunung Sinai untuk menerima Dua Loh Batu berisi Sepuluh Perintah Allah (Dekalog)."
  },
  {
    id: "q_44",
    source: "Quizizz Katekumen Des 2021",
    no: 44,
    q: "Dalam sejarah keselamatan Bangsa Israel, pada dasarnya Paskah dalam Tradisi Perjanjian lama adalah ...",
    options: [
      "Memperingati turunnya 10 Perintah Allah",
      "Memperingati pembebasan Bangsa Israel dari perbudakan Mesir",
      "Memperingati perjalanan Abraham menuju tanah terjanji, Kanaan",
      "Memperingati Abraham mengurbankan Ishak, anaknya"
    ],
    ans: [1],
    category: "Sejarah Keselamatan",
    explanation: "Paskah Yahudi (Pesakh = lewat) memperingati pembebasan bangsa Israel dari perbudakan di tanah Mesir saat malaikat Tuhan melewati rumah-rumah berlumur darah anak domba."
  },
  {
    id: "q_45",
    source: "Quizizz Katekumen Des 2021",
    no: 45,
    q: "Perintah “Hormatilah ibu-bapakmu” adalah perintah ke ... dalam Sepuluh Perintah Allah.",
    options: ["Ke – 2", "Ke – 3", "Ke – 4", "Ke – 5"],
    ans: [2],
    category: "Sepuluh Perintah Allah",
    explanation: "Perintah ke-4 dalam Sepuluh Perintah Allah (Dekalog versi Katolik) adalah: 'Hormatilah ibu bapakmu, supaya lanjut umurmu di tanah yang diberikan TUHAN, Allahmu, kepadamu'."
  },
  {
    id: "q_46",
    source: "Quizizz Katekumen Des 2021",
    no: 46,
    q: "Perintah ke – 1 sampai dengan ke – 3 dalam Sepuluh Perintah Allah, hakikatnya mengatur hubungan / relasi antara ... dengan ... .",
    options: ["Manusia dengan manusia", "Allah dengan Raja-raja Israel", "Tuan dengan hambanya", "Manusia dengan Allah"],
    ans: [3],
    category: "Sepuluh Perintah Allah",
    explanation: "Tiga perintah pertama Dekalog mengatur relasi kasih dan penyembahan manusia dengan Allah, sedangkan perintah ke-4 sampai ke-10 mengatur relasi kasih antarsesama manusia."
  },
  {
    id: "q_47",
    source: "Quizizz Katekumen Des 2021",
    no: 47,
    q: "Perintah “Jangan mencuri” adalah perintah ... dalam Sepuluh Perintah Allah.",
    options: ["Ke – 4", "Ke – 5", "Ke – 6", "Ke – 7"],
    ans: [3],
    category: "Sepuluh Perintah Allah",
    explanation: "Perintah ke-7 adalah: 'Jangan mencuri', yang menuntut keadilan, kejujuran, dan penghormatan terhadap milik sesama."
  },
  {
    id: "q_48",
    source: "Quizizz Katekumen Des 2021",
    no: 48,
    q: "“Berpuasa dan berpantang pada hari-hari yang ditentukan” merupakan rumusan ke ... dalam Lima Perintah Gereja.",
    options: ["Ke – 1", "Ke – 2", "Ke – 3", "Ke – 4"],
    ans: [1],
    category: "Lima Perintah Gereja",
    explanation: "Lima Perintah Gereja: 1. Rayakan hari raya yang disamakan dengan hari Minggu; 2. Berpuasa dan berpantang pada hari-hari yang ditentukan; 3. Mengaku dosalah sekurang-kurangnya setahun sekali; 4. Sambutlah Tubuh Tuhan pada masa Paskah; 5. Bantulah memenuhi kebutuhan Gereja."
  },
  {
    id: "q_49",
    source: "Quizizz Katekumen Des 2021",
    no: 49,
    q: "Tindakan sadar, bebas untuk menolak tawaran cinta Allah yang menimbulkan rusaknya relasi antara manusia dengan dirinya, dengan sesamanya, alam semesta dan terlebih dengan Allah disebut",
    options: ["Salah paham", "Keliru", "Menyimpang", "Dosa"],
    ans: [3],
    category: "Moral & Ajaran Gereja",
    explanation: "Dosa pada hakikatnya adalah penolakan sadar dan bebas terhadap kasih Allah yang memecah-belah relasi manusia dengan Allah, sesama, alam, dan diri sendiri."
  },
  {
    id: "q_50",
    source: "Quizizz Katekumen Des 2021",
    no: 50,
    imgHint: "Foto Uskup Agung Jakarta berpakaian Kardinal merah dengan jubah uskup.",
    q: "Beliau adalah Bapak Uskup KAJ yang mendapatkan tanggung jawab menjadi Kardinal. Beliau adalah ...",
    options: [
      "Ignatius Kardinal Suharyo",
      "Ignatius Kardinal Soegija Pranata",
      "Ignatius Kardinal Siswoyo",
      "Ignatius Kardinal Joyo Siswoyo"
    ],
    ans: [0],
    category: "Hierarki Gereja Indonesia",
    explanation: "Ignatius Kardinal Suharyo Hardjoatmodjo adalah Uskup Keuskupan Agung Jakarta (KAJ) yang diangkat menjadi Kardinal oleh Paus Fransiskus pada 5 Oktober 2019."
  },
  {
    id: "q_51",
    source: "Quizizz Katekumen Des 2021",
    no: 51,
    imgHint: "Bejana logam keemasan menyerupai mangkuk berkaki tinggi bertutup dengan salib di puncaknya.",
    q: "Nama dari alat liturgi ini yang biasanya digunakan oleh prodiakon/imam untuk membagikan komuni suci ke umat",
    options: ["Piala", "Sibori", "Patena", "Purificatorium"],
    ans: [1],
    category: "Perlengkapan Liturgi",
    explanation: "Sibori adalah bejana logam menyerupai piala namun bertutup, digunakan untuk menyimpan dan membagikan Hosti Kudus saat misa maupun di tabernakel."
  },
  {
    id: "q_52",
    source: "Quizizz Katekumen Des 2021",
    no: 52,
    q: "Allah menciptakan manusia secara istimewa sebagai citra-Nya. Ia memberikan 3 anugerah yang membuat martabat manusia itu dapat dikatakan lebih tinggi daripada makhluk hidup ciptaan Tuhan lainnya. Tiga anugerah Allah yang harus terus dikembangkan itu adalah",
    options: [
      "Perasaan, emosi dan Intuisi",
      "Mata, Telinga dan Tangan",
      "Akal Budi, Hati dan Kehendak Bebas",
      "Waktu lalu, sekarang dan yang akan datang"
    ],
    ans: [2],
    category: "Penciptaan & Manusia",
    explanation: "Sebagai Citra Allah (Imago Dei), manusia dianugerahi Akal Budi untuk memahami kebenaran, Hati (nurani) untuk membedakan yang baik dan jahat, serta Kehendak Bebas untuk memilih dan mencintai."
  },
  {
    id: "q_53",
    source: "Quizizz Katekumen Des 2021",
    no: 53,
    q: "Setiap orang yang beragama diharapkan juga akan memiliki kepercayaan atau beriman kepada Allah secara benar. Dalam Gereja Katolik, yang menjadi pilar dalam pengajaran iman kepada Umat Allah adalah ...",
    options: [
      "Kitab Suci, Tradisi Suci dan Magisterium",
      "Pengalaman, Liturgi dan Kitab Suci",
      "Kitab Suci, Aturan-aturan Gereja",
      "Alkitab, Buku-buku Rohani dan Pengalaman Orang Kudus"
    ],
    ans: [0],
    category: "Pilar Kebenaran Iman",
    explanation: "Tiga pilar pengajaran iman Katolik yang saling menguatkan adalah Kitab Suci (Firman tertulis), Tradisi Suci (pewarisan hidup kabar keselamatan), dan Magisterium (kuasa mengajar Gereja)."
  },
  {
    id: "q_54",
    source: "Quizizz Katekumen Des 2021",
    no: 54,
    q: "Sakramen yang menjadi “Sumber dan Puncak” seluruh hidup kristiani (kegiatan gereja) adalah sakramen ...",
    options: ["Baptis", "Krisma", "Ekaristi", "Perkawinan"],
    ans: [2],
    category: "Sakramen Ekaristi",
    explanation: "Konsili Vatikan II menegaskan bahwa Sakramen Ekaristi adalah 'sumber dan puncak' (fons et culmen) seluruh hidup kristiani karena di dalamnya Kristus sendiri hadir secara nyata."
  },
  {
    id: "q_55",
    source: "Quizizz Katekumen Des 2021",
    no: 55,
    q: "Dalam ibadat bersama, orang mewujudkan kebersamaan (communion) sebagai satu kesatuan gereja (paguyuban orang beriman) katolik",
    options: ["Benar", "Salah"],
    ans: [0],
    category: "Liturgi & Ekklesiologi",
    explanation: "Pernyataan ini Benar. Ibadat liturgis bersama adalah perwujudan konkret dari persekutuan (koinonia/communio) seluruh umat beriman sebagai Tubuh Mistik Kristus."
  },
  {
    id: "q_56",
    source: "Quizizz Katekumen Des 2021",
    no: 56,
    q: "Belajar dari doa Bapa kami, dalam menjalin relasi atau komunikasi dengan Allah, setiap orang Kristiani diharapkan agar dalam hal berdoa pertama-tama menyampaikan ........ (unsur 1 dalam doa)",
    options: [
      "Permohonan sebanyak-banyaknya",
      "Kata-kata indah",
      "Syukur dan terima kasih kepada Allah",
      "Sesal mendalam"
    ],
    ans: [2],
    category: "Spiritualitas & Doa",
    explanation: "Doa kristiani sejati diawali dengan pujian, pengagungan, syukur, dan terima kasih atas kebaikan dan kekudusan nama Allah sebelum mengajukan permohonan."
  },
  {
    id: "q_57",
    source: "Quizizz Katekumen Des 2021",
    no: 57,
    q: "Pada saat Jumat Agung, semua umat Katolik wajib merayakan misa kudus untuk mengenang wafatNya Yesus Kristus",
    options: ["Salah", "Benar"],
    ans: [0],
    category: "Liturgi & Pekan Suci",
    explanation: "Pernyataan ini Salah. Pada hari Jumat Agung, Gereja Katolik TIDAK merayakan Misa Kudus (Ekaristi). Yang dirayakan adalah Ibadat Penghormatan Salib dan Upacara Sengsara Tuhan."
  },
  {
    id: "q_58",
    source: "Quizizz Katekumen Des 2021",
    no: 58,
    q: "Bacalah kutipan teks di bawah ini, “Kasihilah musuhmu, berbuatlah baik kepada orang yang membenci kamu, mintalah berkat bagi orang yang mengutuk kamu, berdoalah untuk orang yang mencaci kamu” (Luk 6:27-28)”\nPernyataan di bawah ini yang menunjukkan perwujudan nilai Kerajaan Allah sesuai dengan teks Kitab suci di atas adalah",
    options: [
      "harga diri terletak pada kekuasaan yang diperjuangkan seseorang untuk mendapatkan penghargaan di tengah masyarakatnya",
      "model komunitas yang diperjuangkan Yesus berdasarkan kasih antar manusia tidak dibatasi atas dasar kesamaan suku, agama, dan ras",
      "uang dan harta kekayaan tentu saja perlu untuk hidup, tetapi Yesus mengajak kita untuk tidak diperbudak uang dan harta kekayaan",
      "dengan kekuasaan dan jabatan banyak orang merasa dapat memperlakukan orang lain sesuai dengan keinginannya"
    ],
    ans: [1],
    category: "Ajaran Yesus & Moral",
    explanation: "Kasih radikal yang diajarkan Yesus meruntuhkan sekat kebencian dan permusuhan: kasih sejati tidak dibatasi kelompok, suku, maupun perlakuan orang lain."
  },
  {
    id: "q_59",
    source: "Quizizz Katekumen Des 2021",
    no: 59,
    q: "Tingkatan tertinggi dalam \"Perayaan Liturgi\" adalah ...",
    options: ["Pesta", "Hari Raya", "Peringatan Wajib", "Hari Biasa"],
    ans: [1],
    category: "Liturgi & Kalender Gereja",
    explanation: "Hierarki tingkat perayaan liturgi Katolik dari yang tertinggi: 1. Hari Raya (Solemnitas), 2. Pesta (Festum), 3. Peringatan (Memoria Wajib/Fakultatif), dan 4. Hari Biasa (Feria)."
  },
  {
    id: "q_60",
    source: "Quizizz Katekumen Des 2021",
    no: 60,
    q: "Gereja bersifat apostolik. Artinya, Gereja menjadi perwujudan",
    options: [
      "kesatuan iman yang dibangun atas dasar kesatuan Allah Tri Tunggal",
      "kehendak Allah untuk mempersatukan manusia dalam kekudusan-Nya",
      "kesatuan iman yang berpegang teguh pada kesaksian iman para Rasul",
      "jemaat yang terbuka bagi dunia, tidak terbatas pada tempat tertentu"
    ],
    ans: [2],
    category: "Sifat-Sifat Gereja",
    explanation: "Sifat Apostolik berarti Gereja dibangun atas dasar para rasul, meneruskan ajaran dan mandat para rasul, serta dipimpin oleh penerus para rasul (Paus dan Uskup)."
  },
  {
    id: "q_61",
    source: "Quizizz Katekumen Des 2021",
    no: 61,
    q: "Perhatikanlah pernyataan-pernyataan berikut!\ni. Ketua lingkungan mengunjungi warganya yang sedang sakit di rumah sakit\nii. Seorang ibu Katolik melaksanakan tugas pembinaan iman anak di paroki\niii. Dokter yang beragama katolik membantu memberikan pelayanan medis kepada umat yang sakit dan tersingkir secara cuma-cuma\niv. Seorang bapak katolik mengabdikan diri sebagai pengurus RW di masyarakat\nv. Umat Lingkungan melaksanakan tugas koor pada waktu misa malam Natal\nvi. Awam pemuka umat (prodiakon) memimpin ibadat peringatan arwah di lingkungan\nvii. Guru agama Katolik melaksanakan tugas pengajaran di sekolah terpencil\nTugas diakonia yang dilaksanakan oleh umat awam dalam Gereja Katolik adalah…",
    options: [
      "(i), (ii), (iii), dan (iv)",
      "(i), (iii), (iv), dan (vii)",
      "(ii), (iii), (v), dan (vii)",
      "(ii), (iv), (vi), dan (vii)"
    ],
    ans: [1],
    category: "Pancatugas Gereja",
    explanation: "Tugas Diakonia adalah karya pelayanan kasih nyata bagi sesama: (i) menjenguk warga sakit di RS, (iii) dokter melayani cuma-cuma kaum tersingkir, (iv) mengabdi untuk kesejahteraan warga RW, dan (vii) mengabdi melayani pendidikan di daerah terpencil."
  },
  {
    id: "q_62",
    source: "Quizizz Katekumen Des 2021",
    no: 62,
    q: "Tanggung jawab yang utama dari umat Katolik yang sudah terima Sakramen Inisiasi penuh adalah",
    options: [
      "memberikan bantuan hukum kepada masyarakat yang mengalami ketidakadilan",
      "membawa kabar sukacita dan harapan kepada semua orang melalui perkataan dan tindakan",
      "mampu mewujudkan negara yang aman dan adil bagi setiap warga masyarakat",
      "berani menyatakan salah jika memang salah dan benar jika benar"
    ],
    ans: [1],
    category: "Sakramen & Kerasulan Awam",
    explanation: "Setelah inisiasi penuh, umat diutus untuk menjadi garam dan terang dunia, mewartakan Injil kabar sukacita dan harapan Kristus melalui seluruh perkataan dan perbuatan hidupnya."
  },
  {
    id: "q_63",
    source: "Quizizz Katekumen Des 2021",
    no: 63,
    q: "Setiap orang Kristiani mempunyai tanggungjawab untuk ikut serta menjadi saksi Kristus dengan cara kerja dan hidupnya di tempat kerja maupun di tengah masyarakat, ketika menjalin relasi dengan umat beriman lain. Hal tersebut termasuk sebagai suatu penghayatan imannya akan Yesus Kristus dalam kehidupan menggereja yang dapat digolongkan dalam tugas",
    options: ["Kesaksian (Martyria)", "Pelayanan (Diakonia)", "Persekutuan (Koinonia)", "Pewartaan (Kerygma)"],
    ans: [0],
    category: "Pancatugas Gereja",
    explanation: "Martyria adalah kesaksian hidup beriman di tengah masyarakat melalui integritas, kejujuran, teladan kerja, dan kesetiaan kepada nilai-nilai Kristus."
  },
  {
    id: "q_64",
    source: "Quizizz Katekumen Des 2021",
    no: 64,
    q: "Tanda salib yang dilakukan saat hendak berdoa untuk makan di tempat umum merupakan",
    options: [
      "prakarsa Yesus yang menampakkan diri pada para rasul",
      "pengakuan akan Tritunggal Mahakudus",
      "kesaksian para rasul akan misi Yesus",
      "kebangkitan Kristus bagi Gereja perdana"
    ],
    ans: [1],
    category: "Spiritualitas & Tanda Salib",
    explanation: "Tanda Salib dibuat dalam nama 'Bapa, dan Putera, dan Roh Kudus' sebagai pengakuan iman yang nyata dan ringkas akan Allah Tritunggal Mahakudus dan karya penebusan Kristus di kayu salib."
  },
  {
    id: "q_65",
    source: "Quizizz Katekumen Des 2021",
    no: 65,
    q: "Jika orang yang sudah menikah hidup saling mengasihi dan hidup setia seumur hidup berarti mereka mengikuti perintah Allah yang berbunyi",
    options: ["kuduskanlah hari Tuhan", "hormatilah ibu bapakmu", "jangan berbuat zinah", "jangan bersaksi dusta"],
    ans: [2],
    category: "Sepuluh Perintah Allah",
    explanation: "Perintah 'Jangan berbuat zinah' (Perintah ke-6) mewajibkan kesucian tubuh, kemurnian batin, serta kesetiaan kasih seumur hidup bagi pasangan suami-istri."
  },
  {
    id: "q_66",
    source: "Quizizz Katekumen Des 2021",
    no: 66,
    q: "Penumpangan Tangan dan Pengurapan minyak pada dahi yang bermakna “Siap untuk menjadi saksi Kristus” dalam kehidupan bermasyarakat terjadi saat menerima sakramen …",
    options: ["Baptis", "Krisma", "Ekaristi", "Pengurapan Orang Sakit"],
    ans: [1],
    category: "Sakramen Krisma",
    explanation: "Sakramen Krisma (Penguatan) mengurapi dahi dengan minyak krisma suci disertai penumpangan tangan sebagai materai Roh Kudus agar berani menjadi saksi Kristus yang dewasa dalam perkataan dan tindakan."
  },
  {
    id: "q_67",
    source: "Quizizz Katekumen Des 2021",
    no: 67,
    q: "Doa Malaikat Tuhan (Angelus Dei) dilakukan umat Katolik setiap pukul:",
    options: [
      "06.00, 12.00 WIB dan 16.00 WIB",
      "07.00, 12.00 WIB dan 17.00 WIB",
      "06.00, 12.00 WIB dan 18.00 WIB",
      "05.00, 12.00 WIB dan 19.00 WIB"
    ],
    ans: [2],
    category: "Doa & Devosi",
    explanation: "Doa Malaikat Tuhan (Angelus) didoakan tiga kali sehari dalam tradisi Katolik, yaitu pada pagi hari pukul 06.00, siang hari pukul 12.00, dan petang hari pukul 18.00."
  },
  {
    id: "q_68",
    source: "Quizizz Katekumen Des 2021",
    no: 68,
    q: "Perilaku yang menghormati dan menghargai kebhinekaan di tempat kerja / masyarakat adalah",
    options: [
      "rajin berdoa dan beribadah kepada Allah",
      "jujur mengakui kesalahan yang dilakukan",
      "kerjasama / bergaul tanpa memilih-milih teman",
      "membantu ibu mencuci piring di rumah"
    ],
    ans: [2],
    category: "Kerasulan Sosial & Toleransi",
    explanation: "Menghargai kebhinekaan diwujudkan dengan mau bekerja sama, bergotong-royong, dan berteman dengan siapa saja tanpa membeda-bedakan suku, agama, dan latar belakang."
  },
  {
    id: "q_69",
    source: "Quizizz Katekumen Des 2021",
    no: 69,
    q: "Forma (Kata yang menyertai tindakan) yang harus ada dalam pembaptisan Katolik adalah",
    options: [
      "\"Terimalah Karunia Roh Kudus\"",
      "\"Aku membaptismu dalam nama bapa, putra, dan roh kudus\"",
      "Air",
      "Konsekrasi Roti dan Anggur dan penerimaan komuni"
    ],
    ans: [1],
    category: "Sakramen Baptis",
    explanation: "Forma sakramen adalah rumusan kata-kata yang diucapkan oleh pelayan sakramen: 'Aku membaptis engkau dalam nama Bapa dan Putera dan Roh Kudus', sedangkan air adalah materianya."
  },
  {
    id: "q_70",
    source: "Quizizz Katekumen Des 2021",
    no: 70,
    q: "Pembinaan lanjut setelah seseorang menerima sakramen Baptis dewasa adalah",
    options: ["katekumen", "mistagogi", "pra katekumenat", "katekumenat"],
    ans: [1],
    category: "Inisiasi & Katekumenat",
    explanation: "Tahap-tahap inisiasi kristiani dewasa (RICA): 1. Pra-katekumenat, 2. Katekumenat, 3. Tahap Pemilihan/Penyucian, dan 4. Mistagogi (pendalaman misteri iman setelah pembaptisan)."
  },
  {
    id: "q_71",
    source: "Quizizz Katekumen Des 2021",
    no: 71,
    q: "Misa Kudus atau Ekaristi berasal dari kata Eucharistia yang berarti",
    options: ["sembah sujud", "syalom", "damai sejahtera", "puji syukur"],
    ans: [3],
    category: "Sakramen Ekaristi",
    explanation: "Kata Ekaristi berasal dari bahasa Yunani 'eucharistia' yang berarti ucapan syukur atau puji syukur kepada Allah atas seluruh karya keselamatan-Nya dalam Yesus Kristus."
  },
  {
    id: "q_72",
    source: "Quizizz Katekumen Des 2021",
    no: 72,
    q: "Dalam keadaan darurat, orang diizinkan untuk menerima komuni walaupun belum dibaptis",
    options: ["Benar", "Salah"],
    ans: [1],
    category: "Hukum Gereja & Sakramen",
    explanation: "Pernyataan ini Salah. Sakramen Baptis adalah pintu gerbang ('ianua sacramentorum') dari semua sakramen. Seseorang tidak dapat menerima Komuni Kudus jika belum menerima Sakramen Baptis."
  },
  {
    id: "q_73",
    source: "Quizizz Katekumen Des 2021",
    no: 73,
    q: "Arti kata berbela rasa adalah",
    options: [
      "Peduli dan tanggap pada yang menderita",
      "Kasihan pada orang miskin",
      "Membuat menderita",
      "Menderita terus"
    ],
    ans: [0],
    category: "Spiritualitas & Moral",
    explanation: "Berbela rasa (compassion) berarti turut merasakan penderitaan sesama dan tergerak hatinya untuk peduli, tanggap, serta melakukan tindakan pertolongan nyata."
  },
  {
    id: "q_74",
    source: "Quizizz Katekumen Des 2021",
    no: 74,
    imgHint: "Wadah bundar kecil dari logam bertutup dengan ukiran salib, biasa dibawa oleh pelayan komuni untuk orang sakit.",
    q: "Kotak kecil sebagai tempat membawa hosti suci yang akan diberikan untuk orang sakit / orang dalam penjara disebut …",
    options: ["Piala", "Piksis", "Tabernakel", "Sibori"],
    ans: [1],
    category: "Perlengkapan Liturgi",
    explanation: "Piksis (pyxis) adalah wadah kecil bundar dari logam berharga berhias salib untuk membawa Hosti Kudus saat melayani komuni bagi orang sakit atau di penjara."
  },
  {
    id: "q_75",
    source: "Quizizz Katekumen Des 2021",
    no: 75,
    q: "Gambaran tentang Gereja menurut KS dan LG ada 3 yaitu .. (pilih 3)",
    options: ["Umat Allah", "Tubuh Mistik Kristus", "Jemaat Kudus", "Kediaman Roh Kudus"],
    ans: [0, 1, 3],
    isMultiSelect: true,
    category: "Ekklesiologi",
    explanation: "Tiga gambaran biblis utama Gereja menurut Kitab Suci dan dokumen Konsili Vatikan II Lumen Gentium adalah: 1. Umat Allah (Populus Dei), 2. Tubuh Mistik Kristus (Corpus Christi Mysticum), dan 3. Bait / Kediaman Roh Kudus."
  },
  {
    id: "q_76",
    source: "Quizizz Katekumen Des 2021",
    no: 76,
    imgHint: "Piringan logam emas bundar mengkilap tempat meletakkan hosti besar di atas piala sebelum konsekrasi.",
    q: "Gambar berikut adalah salah satu alat dalam misa yang diletakkan di atas calix/piala. Ia adalah piring logam tempat diletakkannya hosti sebelum dikonsekrasi. Apakah nama dari alat liturgi ini?",
    options: ["Palla", "Turibulum", "Patena", "Piala / Calix"],
    ans: [2],
    category: "Perlengkapan Liturgi",
    explanation: "Patena adalah piring bundar dari logam berlapis emas untuk meletakkan Hosti besar sebelum dan sesudah konsekrasi saat Perayaan Ekaristi."
  },
  {
    id: "q_77",
    source: "Quizizz Katekumen Des 2021",
    no: 77,
    q: "Dogma Bunda Maria diangkat ke surga pertama kali lahir dari pemahaman bersama umat (sensus fidelium), bukan dari pernyataan teologis",
    options: ["Benar", "Salah"],
    ans: [0],
    category: "Maria & Dogma",
    explanation: "Pernyataan ini Benar. Keyakinan bahwa Bunda Maria diangkat ke surga jiwa dan raga (Assumptio) dihayati dan dirayakan dalam doa dan tradisi umat beriman (sensus fidelium) selama berabad-abad sebelum dimaklumkan secara ex cathedra oleh Paus Pius XII tahun 1950."
  },
  {
    id: "q_78",
    source: "Quizizz Katekumen Des 2021",
    no: 78,
    q: "Materia dari Sakramen Perkawinan adalah Pernyataan Janji Nikah dari pasangan",
    options: ["Salah", "Benar"],
    ans: [1],
    category: "Sakramen Perkawinan",
    explanation: "Pernyataan ini Benar. Materia sakramen perkawinan adalah penyerahan diri timbal balik kedua mempelai yang dinyatakan secara lahiriah melalui janji nikah bebas dan sah."
  },
  {
    id: "q_79",
    source: "Quizizz Katekumen Des 2021",
    no: 79,
    q: "Kata liturgi berasal dari kata 'leitourgia' yang berarti",
    options: ["Ibadat", "Karya bersama", "Sakramen", "Misteri"],
    ans: [1],
    category: "Liturgi & Simbol",
    explanation: "Kata 'liturgi' berasal dari kata bahasa Yunani 'leitourgia' (leitos = publik/rakyat + ergon = karya/kerja), yang semula berarti karya bersama atau pelayanan demi kepentingan umum."
  },
  {
    id: "q_80",
    source: "Quizizz Katekumen Des 2021",
    no: 80,
    q: "Bunyi perintah Gereja no 4 adalah mengaku dosalah sekurang-kurangnya setahun sekali",
    options: ["Benar", "Salah"],
    ans: [1],
    category: "Lima Perintah Gereja",
    explanation: "Pernyataan ini Salah. Perintah Gereja yang berbunyi 'Mengaku dosalah sekurang-kurangnya setahun sekali' adalah perintah ke-3. Sedangkan perintah ke-4 berbunyi: 'Sambutlah Tubuh Tuhan pada masa Paskah'."
  }
];

export const ALL_CATEGORIES = Array.from(
  new Set(BANK_SOAL_KATEKUMEN_80.map((item) => item.category))
).sort();
