export const jobList = [
  {
    id: 1,
    title: "Data Scientist",
    location: "Slipi, Jakarta Barat",
    status: "Aktif",
    applicants: 3,
    date: "17/4/25",
    type: "Full-Time",
    salary: "Rp 10.000.000 - Rp 15.000.000",
    description: "Menganalisis dan menginterpretasi data kompleks untuk membantu pengambilan keputusan bisnis."
  },
  {
    id: 2,
    title: "Mobile Front-End Engineer",
    location: "Gambir, Jakarta Timur",
    status: "Aktif",
    applicants: 1,
    date: "17/4/25",
    type: "Full-Time",
    salary: "Rp 12.000.000 - Rp 18.000.000",
    description: "Mengembangkan dan memelihara antarmuka pengguna aplikasi mobile menggunakan React Native."
  },
  {
    id: 3,
    title: "AI Engineer",
    location: "Sleman, Daerah Istimewa Yogyakarta",
    status: "Draft",
    applicants: 5,
    date: "17/4/25",
    type: "Full-Time",
    salary: "Rp 15.000.000 - Rp 25.000.000",
    description: "Merancang dan mengembangkan solusi AI untuk kebutuhan bisnis dan product."
  },
  {
    id: 4,
    title: "Penetration Tester",
    location: "Slipi, Jakarta Barat",
    status: "Closed",
    applicants: 3,
    date: "17/4/25",
    type: "Full-Time",
    salary: "Rp 12.000.000 - Rp 20.000.000",
    description: "Melakukan pengujian keamanan pada sistem dan infrastruktur IT perusahaan."
  },
  {
    id: 5,
    title: "Back-End Engineer",
    location: "Yogyakarta, Daerah Istimewa Yogyakarta",
    status: "Closed",
    applicants: 10,
    date: "17/4/25",
    type: "Full-Time",
    salary: "Rp 12.000.000 - Rp 18.000.000",
    description: "Mengembangkan dan memelihara API dan infrastruktur server untuk aplikasi web dan mobile."
  }
];

// Daftar pelamar per lowongan
export const applicantsData = {
  // Key adalah ID lowongan
  1: [ // Data Scientist
    {
      id: 1,
      name: "Timotius Kristafael Harjanto",
      experience: 100,
      skills: 100,
      background: 100
    },
    {
      id: 2,
      name: "Raden Aryo Bismo Nugroho",
      experience: 150,
      skills: 150,
      background: 150
    },
    {
      id: 3,
      name: "Fahrin Ulya Nisrina",
      experience: 200,
      skills: 200,
      background: 200
    }
  ],
  2: [ // Mobile Front-End Engineer
    {
      id: 4,
      name: "Timotius Kristafael Harjanto",
      experience: 200,
      skills: 200,
      background: 200
    }
  ],
  3: [ // AI Engineer
    {
      id: 5,
      name: "Raden Aryo Bismo Nugroho",
      experience: 150,
      skills: 150,
      background: 150
    },
    {
      id: 6,
      name: "Fahrin Ulya Nisrina",
      experience: 250,
      skills: 250,
      background: 250
    },
    {
      id: 7,
      name: "Timotius Kristafael Harjanto",
      experience: 100,
      skills: 100,
      background: 100
    },
    {
      id: 8,
      name: "Raden Aryo Bismo Nugroho",
      experience: 150,
      skills: 150,
      background: 150
    },
    {
      id: 9,
      name: "Fahrin Ulya Nisrina",
      experience: 200,
      skills: 200,
      background: 200
    }
  ],
  4: [ // Penetration Tester
    {
      id: 10,
      name: "Raden Aryo Bismo Nugroho",
      experience: 180,
      skills: 220,
      background: 150
    },
    {
      id: 11,
      name: "Fahrin Ulya Nisrina",
      experience: 190,
      skills: 180,
      background: 210
    },
    {
      id: 12,
      name: "Timotius Kristafael Harjanto",
      experience: 210,
      skills: 190,
      background: 180
    }
  ],
  5: [ // Back-End Engineer
    {
      id: 13,
      name: "Timotius Kristafael Harjanto",
      experience: 150,
      skills: 180,
      background: 170
    },
    {
      id: 14,
      name: "Raden Aryo Bismo Nugroho",
      experience: 190,
      skills: 170,
      background: 160
    },
    {
      id: 15,
      name: "Fahrin Ulya Nisrina",
      experience: 170,
      skills: 190,
      background: 180
    },
    {
      id: 16,
      name: "Timotius Kristafael Harjanto",
      experience: 160,
      skills: 150,
      background: 190
    },
    {
      id: 17,
      name: "Raden Aryo Bismo Nugroho",
      experience: 180,
      skills: 160,
      background: 150
    },
    {
      id: 18,
      name: "Fahrin Ulya Nisrina",
      experience: 150,
      skills: 150,
      background: 160
    },
    {
      id: 19,
      name: "Timotius Kristafael Harjanto",
      experience: 170,
      skills: 170,
      background: 170
    },
    {
      id: 20,
      name: "Raden Aryo Bismo Nugroho",
      experience: 160,
      skills: 160,
      background: 180
    },
    {
      id: 21,
      name: "Fahrin Ulya Nisrina",
      experience: 180,
      skills: 180,
      background: 190
    },
    {
      id: 22,
      name: "Timotius Kristafael Harjanto",
      experience: 190,
      skills: 190,
      background: 150
    }
  ]
};

// Fungsi helper untuk mendapatkan job berdasarkan id atau title
export const getJobById = (jobId) => {
  return jobList.find(job => job.id === parseInt(jobId));
};

export const getJobByTitle = (jobTitle) => {
  return jobList.find(job => job.title === jobTitle);
};

// Status warna
export const statusColor = {
  Aktif: "bg-green-100 text-green-600",
  Draft: "bg-gray-100 text-gray-600",
  Closed: "bg-red-100 text-red-600",
};
