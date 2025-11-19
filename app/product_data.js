const productData = [
  // Consumer Accounts - Gross Deposits
  {
    category: "GROSS DEPOSITS",
    subCategory: "CONSUMER ACCOUNTS",
    group: "NON-INTEREST BEARING CHECKING",
    productName: "All Access Checking",
    pointsPerProduct: null,
    minBalanceThreshold: null,
    balanceTiers: [
      { range: "$250 - $999.99", points: 10 },
      { range: "$1,000 - $9,999.99", points: 20 },
      { range: "$10,000+", points: 30 },
    ],
  },
  {
    category: "GROSS DEPOSITS",
    subCategory: "CONSUMER ACCOUNTS",
    group: "NON-INTEREST BEARING CHECKING",
    productName: "My Team Checking",
    pointsPerProduct: null,
    minBalanceThreshold: "$250",
    balanceTiers: [
      { range: "$250 - $999.99", points: 10 },
      { range: "$1,000 - $9,999.99", points: 20 },
      { range: "$10,000+", points: 30 },
    ],
  },
  {
    category: "GROSS DEPOSITS",
    subCategory: "CONSUMER ACCOUNTS",
    group: "MONEY MARKETS & INTEREST BEARING CHECKING",
    productName: "Money Market Savings",
    pointsPerProduct: null,
    minBalanceThreshold: "$10,000",
    balanceTiers: [
      { range: "$10,000 - $24,999.99", points: 5 },
      { range: "$25,000 - $99,999.99", points: 10 },
      { range: "$100,000+", points: 15 },
    ],
  },
  {
    category: "GROSS DEPOSITS",
    subCategory: "CONSUMER ACCOUNTS",
    group: "SAVINGS",
    productName: "Kids First Savings Club",
    pointsPerProduct: null,
    minBalanceThreshold: "$300",
    balanceTiers: [
      { range: "$300 - $9,999.99", points: 5 },
      { range: "$10,000+", points: 10 },
    ],
  },
  {
    category: "GROSS DEPOSITS",
    subCategory: "CONSUMER ACCOUNTS",
    group: "CD's & IRA's",
    productName: "Jumbo Single Maturity - Personal CD",
    pointsPerProduct: null,
    minBalanceThreshold: "$500",
    balanceTiers: [
      { range: "$500 - $9,999.99", points: 1 },
      { range: "$10,000 - $99,999.99", points: 3 },
      { range: "$100,000+", points: 5 },
    ],
  },

  // Commercial Accounts - Gross Deposits
  {
    category: "GROSS DEPOSITS",
    subCategory: "COMMERCIAL ACCOUNTS",
    group: "NON-INTEREST BEARING CHECKING",
    productName: "Small Business Checking",
    pointsPerProduct: null,
    minBalanceThreshold: "$1,000",
    balanceTiers: [
      { range: "$1,000 - $9,999.99", points: 20 },
      { range: "$10,000 - $99,999.99", points: 30 },
      { range: "$100,000+", points: 40 },
    ],
  },
  {
    category: "GROSS DEPOSITS",
    subCategory: "COMMERCIAL ACCOUNTS",
    group: "NON-INTEREST BEARING CHECKING",
    productName: "SMB Bundle 1 (AT 550) - Basic Business",
    pointsPerProduct: "20 (1st Balance Tier)",
    minBalanceThreshold: null,
    balanceTiers: [
      { range: "$1,000 - $9,999.99", points: 30 },
      { range: "$10,000 - $99,999.99", points: 50 },
      { range: "$100,000+", points: 60 },
    ],
  },
  {
    category: "GROSS DEPOSITS",
    subCategory: "COMMERCIAL ACCOUNTS",
    group: "NON-INTEREST BEARING CHECKING",
    productName: "SMB Bundle 2 (AT 551) - Advantage Business",
    pointsPerProduct: "30 (1st Balance Tier)",
    minBalanceThreshold: null,
    balanceTiers: [
      { range: "$1,000 - $9,999.99", points: 30 },
      { range: "$10,000 - $99,999.99", points: 50 },
      { range: "$100,000+", points: 60 },
    ],
  },
  {
    category: "GROSS DEPOSITS",
    subCategory: "COMMERCIAL ACCOUNTS",
    group: "NON-INTEREST BEARING CHECKING",
    productName: "SMB Bundle 3 (AT 552) - Premier Business",
    pointsPerProduct: "40 (1st Balance Tier)",
    minBalanceThreshold: null,
    balanceTiers: [
      { range: "$1,000 - $9,999.99", points: 30 },
      { range: "$10,000 - $99,999.99", points: 50 },
      { range: "$100,000+", points: 60 },
    ],
  },
  {
    category: "GROSS DEPOSITS",
    subCategory: "COMMERCIAL ACCOUNTS",
    group: "BUSINESS SAVINGS",
    productName: "Business Savings",
    pointsPerProduct: null,
    minBalanceThreshold: "$500",
    balanceTiers: [
      { range: "$500 - $9,999.99", points: 5 },
      { range: "$10,000+", points: 10 },
    ],
  },
  {
    category: "GROSS DEPOSITS",
    subCategory: "COMMERCIAL ACCOUNTS",
    group: "BUSINESS CD'S",
    productName: "BUSINESS CD'S (All Types)",
    pointsPerProduct: null,
    minBalanceThreshold: "$500",
    balanceTiers: [
      { range: "$500 - $9,999.99", points: 1 },
      { range: "$10,000 - $99,999.99", points: 3 },
      { range: "$100,000+", points: 5 },
    ],
  },
  {
    category: "GROSS DEPOSITS",
    subCategory: "COMMERCIAL ACCOUNTS",
    group: "BUSINESS MONEY MARKET",
    productName: "Business Money Market",
    pointsPerProduct: null,
    minBalanceThreshold: "$10,000",
    balanceTiers: [
      { range: "$10,000 - $24,999.99", points: 5 },
      { range: "$25,000 - $99,999.99", points: 10 },
      { range: "$100,000+", points: 15 },
    ],
  },

  // Loan Referrals
  {
    category: "LOAN REFERRALS",
    subCategory: "CONSUMER LOANS",
    productName: "New Car Loans",
    pointsPerProduct: 30,
  },
  {
    category: "LOAN REFERRALS",
    subCategory: "COMMERCIAL LOANS",
    productName: "Digital Business Banking Loans",
    pointsPerProduct: 30,
  },
  {
    category: "LOAN REFERRALS",
    subCategory: "COMMERCIAL LOANS",
    productName: "Community Lending",
    pointsPerProduct: 50,
  },

  // New CIF Growth
  {
    category: "NEW CIF GROWTH",
    productName: "Personal",
    pointsPerProduct: 5,
    minBalanceThreshold: "$250.00",
  },
  {
    category: "NEW CIF GROWTH",
    productName: "Business",
    pointsPerProduct: 10,
    minBalanceThreshold: "$1,000.00",
  },

  // New Digital Enrollments
  {
    category: "NEW DIGITAL ENROLLMENTS",
    productName: "Online Enrollment",
    pointsPerProduct: 2,
  },

  // Partner Referrals
  {
    category: "PARTNER REFERRALS",
    subCategory: "REVENUE GENERATING PRODUCTS/SERVICES",
    productName: "ADP",
    pointsPerProduct: 25,
  },
  {
    category: "PARTNER REFERRALS",
    subCategory: "DEPOSIT ACCOUNT REFERRALS",
    productName: "International",
    pointsPerProduct: 25,
  },

  // Treasury Solutions
  {
    category: "TREASURY SOLUTIONS PRODUCTS/SERVICES",
    productName: "ACH Origination",
    pointsPerProduct: 10,
  },
  {
    category: "TREASURY SOLUTIONS PRODUCTS/SERVICES",
    productName: "SMB Bundle 1 (AT 550) - Basic Business",
    pointsPerProduct: 0,
  },
  {
    category: "TREASURY SOLUTIONS PRODUCTS/SERVICES",
    productName: "SMB Bundle 2 (AT 551) - Advantage Business",
    pointsPerProduct: 30,
  },
  {
    category: "TREASURY SOLUTIONS PRODUCTS/SERVICES",
    productName: "SMB Bundle 3 (AT 552) - Premier Business",
    pointsPerProduct: 30,
  },
];
  // Consumer Accounts - Gross Deposits
  {
    category: "GROSS DEPOSITS",
    subCategory: "CONSUMER ACCOUNTS",
    group: "NON-INTEREST BEARING CHECKING",
    productName: "All Access Checking",
    pointsPerProduct: null,
    minBalanceThreshold: null,
    balanceTiers: [
      { range: "$250 - $999.99", points: 10 },
      { range: "$1,000 - $9,999.99", points: 20 },
      { range: "$10,000+", points: 30 },
    ],
  },
  {
    category: "GROSS DEPOSITS",
    subCategory: "CONSUMER ACCOUNTS",
    group: "NON-INTEREST BEARING CHECKING",
    productName: "My Team Checking",
    pointsPerProduct: null,
    minBalanceThreshold: "$250",
    balanceTiers: [
      { range: "$250 - $999.99", points: 10 },
      { range: "$1,000 - $9,999.99", points: 20 },
      { range: "$10,000+", points: 30 },
    ],
  },
  {
    category: "GROSS DEPOSITS",
    subCategory: "CONSUMER ACCOUNTS",
    group: "MONEY MARKETS & INTEREST BEARING CHECKING",
    productName: "Money Market Savings",
    pointsPerProduct: null,
    minBalanceThreshold: "$10,000",
    balanceTiers: [
      { range: "$10,000 - $24,999.99", points: 5 },
      { range: "$25,000 - $99,999.99", points: 10 },
      { range: "$100,000+", points: 15 },
    ],
  },
  {
    category: "GROSS DEPOSITS",
    subCategory: "CONSUMER ACCOUNTS",
    group: "SAVINGS",
    productName: "Kids First Savings Club",
    pointsPerProduct: null,
    minBalanceThreshold: "$300",
    balanceTiers: [
      { range: "$300 - $9,999.99", points: 5 },
      { range: "$10,000+", points: 10 },
    ],
  },
  {
    category: "GROSS DEPOSITS",
    subCategory: "CONSUMER ACCOUNTS",
    group: "CD's & IRA's",
    productName: "Jumbo Single Maturity - Personal CD",
    pointsPerProduct: null,
    minBalanceThreshold: "$500",
    balanceTiers: [
      { range: "$500 - $9,999.99", points: 1 },
      { range: "$10,000 - $99,999.99", points: 3 },
      { range: "$100,000+", points: 5 },
    ],
  },

  // Commercial Accounts - Gross Deposits
  {
    category: "GROSS DEPOSITS",
    subCategory: "COMMERCIAL ACCOUNTS",
    group: "NON-INTEREST BEARING CHECKING",
    productName: "Small Business Checking",
    pointsPerProduct: null,
    minBalanceThreshold: "$1,000",
    balanceTiers: [
      { range: "$1,000 - $9,999.99", points: 20 },
      { range: "$10,000 - $99,999.99", points: 30 },
      { range: "$100,000+", points: 40 },
    ],
  },
  {
    category: "GROSS DEPOSITS",
    subCategory: "COMMERCIAL ACCOUNTS",
    group: "NON-INTEREST BEARING CHECKING",
    productName: "SMB Bundle 1 (AT 550) - Basic Business",
    pointsPerProduct: "20 (1st Balance Tier)",
    minBalanceThreshold: null,
    balanceTiers: [
      { range: "$1,000 - $9,999.99", points: 30 },
      { range: "$10,000 - $99,999.99", points: 50 },
      { range: "$100,000+", points: 60 },
    ],
  },
  {
    category: "GROSS DEPOSITS",
    subCategory: "COMMERCIAL ACCOUNTS",
    group: "NON-INTEREST BEARING CHECKING",
    productName: "SMB Bundle 2 (AT 551) - Advantage Business",
    pointsPerProduct: "30 (1st Balance Tier)",
    minBalanceThreshold: null,
    balanceTiers: [
      { range: "$1,000 - $9,999.99", points: 30 },
      { range: "$10,000 - $99,999.99", points: 50 },
      { range: "$100,000+", points: 60 },
    ],
  },
  {
    category: "GROSS DEPOSITS",
    subCategory: "COMMERCIAL ACCOUNTS",
    group: "NON-INTEREST BEARING CHECKING",
    productName: "SMB Bundle 3 (AT 552) - Premier Business",
    pointsPerProduct: "40 (1st Balance Tier)",
    minBalanceThreshold: null,
    balanceTiers: [
      { range: "$1,000 - $9,999.99", points: 30 },
      { range: "$10,000 - $99,999.99", points: 50 },
      { range: "$100,000+", points: 60 },
    ],
  },
  {
    category: "GROSS DEPOSITS",
    subCategory: "COMMERCIAL ACCOUNTS",
    group: "BUSINESS SAVINGS",
    productName: "Business Savings",
    pointsPerProduct: null,
    minBalanceThreshold: "$500",
    balanceTiers: [
      { range: "$500 - $9,999.99", points: 5 },
      { range: "$10,000+", points: 10 },
    ],
  },
  {
    category: "GROSS DEPOSITS",
    subCategory: "COMMERCIAL ACCOUNTS",
    group: "BUSINESS CD'S",
    productName: "BUSINESS CD'S (All Types)",
    pointsPerProduct: null,
    minBalanceThreshold: "$500",
    balanceTiers: [
      { range: "$500 - $9,999.99", points: 1 },
      { range: "$10,000 - $99,999.99", points: 3 },
      { range: "$100,000+", points: 5 },
    ],
  },
  {
    category: "GROSS DEPOSITS",
    subCategory: "COMMERCIAL ACCOUNTS",
    group: "BUSINESS MONEY MARKET",
    productName: "Business Money Market",
    pointsPerProduct: null,
    minBalanceThreshold: "$10,000",
    balanceTiers: [
      { range: "$10,000 - $24,999.99", points: 5 },
      { range: "$25,000 - $99,999.99", points: 10 },
      { range: "$100,000+", points: 15 },
    ],
  },

  // Loan Referrals
  {
    category: "LOAN REFERRALS",
    subCategory: "CONSUMER LOANS",
    productName: "New Car Loans",
    pointsPerProduct: 30,
  },
  {
    category: "LOAN REFERRALS",
    subCategory: "COMMERCIAL LOANS",
    productName: "Digital Business Banking Loans",
    pointsPerProduct: 30,
  },
  {
    category: "LOAN REFERRALS",
    subCategory: "COMMERCIAL LOANS",
    productName: "Community Lending",
    pointsPerProduct: 50,
  },

  // New CIF Growth
  {
    category: "NEW CIF GROWTH",
    productName: "Personal",
    pointsPerProduct: 5,
    minBalanceThreshold: "$250.00",
  },
  {
    category: "NEW CIF GROWTH",
    productName: "Business",
    pointsPerProduct: 10,
    minBalanceThreshold: "$1,000.00",
  },

  // New Digital Enrollments
  {
    category: "NEW DIGITAL ENROLLMENTS",
    productName: "Online Enrollment",
    pointsPerProduct: 2,
  },

  // Partner Referrals
  {
    category: "PARTNER REFERRALS",
    subCategory: "REVENUE GENERATING PRODUCTS/SERVICES",
    productName: "ADP",
    pointsPerProduct: 25,
  },
  {
    category: "PARTNER REFERRALS",
    subCategory: "DEPOSIT ACCOUNT REFERRALS",
    productName: "International",
    pointsPerProduct: 25,
  },

  // Treasury Solutions
  {
    category: "TREASURY SOLUTIONS PRODUCTS/SERVICES",
    productName: "ACH Origination",
    pointsPerProduct: 10,
  },
  {
    category: "TREASURY SOLUTIONS PRODUCTS/SERVICES",
    productName: "SMB Bundle 1 (AT 550) - Basic Business",
    pointsPerProduct: 0,
  },
  {
    category: "TREASURY SOLUTIONS PRODUCTS/SERVICES",
    productName: "SMB Bundle 2 (AT 551) - Advantage Business",
    pointsPerProduct: 30,
  },
  {
    category: "TREASURY SOLUTIONS PRODUCTS/SERVICES",
    productName: "SMB Bundle 3 (AT 552) - Premier Business",
    pointsPerProduct: 30,
  },
];
