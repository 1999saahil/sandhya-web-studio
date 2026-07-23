/* ==========================================================================
   SANDHYA WEB STUDIO - INTERACTIVE JAVASCRIPT LOGIC
   ========================================================================== */

// Currency Rates & Symbols Definition
const CURRENCIES = {
  USD: { symbol: '$', rate: 1.0 },
  INR: { symbol: '₹', rate: 50.0 }, // Tailored agency rate factor for easy rounding
  EUR: { symbol: '€', rate: 0.92 },
  GBP: { symbol: '£', rate: 0.80 }
};

let currentCurrency = 'USD';
let currentCalcType = 'simple'; // 'simple' or 'ecommerce'

// Initialize Page Logic
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  recalculatePrice();
});

// Switch Currency Function
function updateCurrency(newCurr) {
  if (!CURRENCIES[newCurr]) return;
  currentCurrency = newCurr;

  const currObj = CURRENCIES[currentCurrency];

  // Update Package Tier Prices
  const pkgPrices = document.querySelectorAll('.pkg-price');
  pkgPrices.forEach(el => {
    const usdVal = parseFloat(el.getAttribute('data-usd'));
    const converted = Math.round(usdVal * currObj.rate);
    el.textContent = `${currObj.symbol}${converted.toLocaleString()}`;
  });

  // Update Addon Prices Labels
  const addonPrices = document.querySelectorAll('.addon-price');
  addonPrices.forEach(el => {
    const usdAttr = el.getAttribute('data-usd');
    if (usdAttr) {
      const usdVal = parseFloat(usdAttr.replace(/[^0-9.]/g, ''));
      const converted = Math.round(usdVal * currObj.rate);
      el.textContent = `+ ${currObj.symbol}${converted.toLocaleString()}`;
    }
  });

  // Recalculate Range Slider & Calculator
  recalculatePrice();
}

// Calculator Type Switcher
function setCalcType(type) {
  currentCalcType = type;
  const btnSimple = document.getElementById('btnTypeSimple');
  const btnEcommerce = document.getElementById('btnTypeEcommerce');

  if (type === 'simple') {
    btnSimple.classList.add('active');
    btnEcommerce.classList.remove('active');
    document.getElementById('summaryTypeName').textContent = 'Simple Website';
  } else {
    btnEcommerce.classList.add('active');
    btnSimple.classList.remove('active');
    document.getElementById('summaryTypeName').textContent = 'E-Commerce Store';
  }

  recalculatePrice();
}

// Main Calculator Engine
function recalculatePrice() {
  const pageSlider = document.getElementById('pageSlider');
  const pageCount = parseInt(pageSlider.value, 10);
  document.getElementById('pageCountLabel').textContent = `${pageCount} Page${pageCount > 1 ? 's' : ''}`;
  document.getElementById('summaryPagesCount').textContent = `${pageCount} Pages`;

  // Base Prices in USD
  let basePriceUsd = (currentCalcType === 'simple') ? 299 : 599;

  // Extra pages beyond base (includes 3 pages)
  if (pageCount > 3) {
    const extraPages = pageCount - 3;
    const pricePerPage = (currentCalcType === 'simple') ? 30 : 50;
    basePriceUsd += extraPages * pricePerPage;
  }

  // Addons
  if (document.getElementById('addonPayment').checked) basePriceUsd += 100;
  if (document.getElementById('addonRush').checked) basePriceUsd += 150;
  if (document.getElementById('addonDomain').checked) basePriceUsd += 50;
  if (document.getElementById('addonSeo').checked) basePriceUsd += 80;

  // Currency Conversion
  const currObj = CURRENCIES[currentCurrency];
  const finalPrice = Math.round(basePriceUsd * currObj.rate);

  // Update Price Display
  document.getElementById('calcPriceDisplay').textContent = `${currObj.symbol}${finalPrice.toLocaleString()}`;

  // Estimate Timeline
  let baseDays = (currentCalcType === 'simple') ? 3 : 6;
  if (pageCount > 5) baseDays += 2;
  if (document.getElementById('addonRush').checked) baseDays = Math.max(2, baseDays - 2);

  document.getElementById('calcTimelineDisplay').textContent = `${baseDays} Days`;
}

// Portfolio Filter Tabs
function filterPortfolio(category, btnElement) {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => btn.classList.remove('active'));
  btnElement.classList.add('active');

  const cards = document.querySelectorAll('.portfolio-card');
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'all' || cardCat === category) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// Select Package Trigger
function selectPackage(packageName, baseUsd) {
  const serviceSelect = document.getElementById('serviceSelect');
  if (packageName.includes('Ecommerce')) {
    serviceSelect.value = 'Ecommerce Store';
  } else if (packageName.includes('VIP')) {
    serviceSelect.value = 'Custom Project';
  } else {
    serviceSelect.value = 'Simple Website';
  }

  document.getElementById('clientMessage').value = `Hi Sandhya, I would like to order the "${packageName}" package!`;
  openModal();
}

// Claim Calculated Quote Trigger
function claimCalculatedQuote() {
  const typeName = document.getElementById('summaryTypeName').textContent;
  const price = document.getElementById('calcPriceDisplay').textContent;
  const pages = document.getElementById('summaryPagesCount').textContent;

  document.getElementById('serviceSelect').value = typeName.includes('Ecommerce') ? 'Ecommerce Store' : 'Simple Website';
  document.getElementById('clientMessage').value = `Hi Sandhya, I calculated an estimated quote for a ${typeName} (${pages}) for ${price}. Let me reserve a slot!`;
  openModal();
}

// Modal Handlers
function openModal() {
  document.getElementById('quoteModal').classList.add('active');
}

function closeModal() {
  document.getElementById('quoteModal').classList.remove('active');
}

// Lead Form Handler & WhatsApp Redirect Fallback
function handleFormSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('clientName').value;
  const email = document.getElementById('clientEmail').value;
  const service = document.getElementById('serviceSelect').value;
  const message = document.getElementById('clientMessage').value;

  const encodedMsg = encodeURIComponent(
    `Hi Sandhya! My name is ${name} (${email}). I'm interested in: ${service}.\n\nMessage: ${message}`
  );

  // Redirect directly to WhatsApp with pre-filled lead details!
  window.open(`https://wa.me/919876543210?text=${encodedMsg}`, '_blank');
  
  alert(`Thank you ${name}! Your inquiry has been submitted. Opening WhatsApp chat with Sandhya...`);
  closeModal();
}
