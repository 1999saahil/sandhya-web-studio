/* ==========================================================================
   SANDHYA WEB STUDIO - INTERACTIVE JAVASCRIPT LOGIC
   ========================================================================== */

// Currency Rates & Symbols Definition (INR as baseline)
const CURRENCIES = {
  INR: { symbol: 'Rs ', suffix: '/-', rate: 1.0 },
  USD: { symbol: '$', suffix: '', rate: 0.012 },
  EUR: { symbol: '€', suffix: '', rate: 0.011 },
  GBP: { symbol: '£', suffix: '', rate: 0.0095 }
};

let currentCurrency = 'INR';
let currentCalcType = 'simple'; // 'simple' or 'ecommerce'
const WHATSAPP_PHONE = '917530989390'; // Updated WhatsApp Number

// Initialize Page Logic
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  recalculatePrice();
  initSocialProofToasts();
});

// Mobile Navigation Toggle
function toggleMobileMenu() {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('mobile-active');
}

function closeMobileMenu() {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.remove('mobile-active');
}

// Switch Currency Function
function updateCurrency(newCurr) {
  if (!CURRENCIES[newCurr]) return;
  currentCurrency = newCurr;

  const currObj = CURRENCIES[currentCurrency];

  // Update Package Tier Prices
  const pkgPrices = document.querySelectorAll('.pkg-price');
  pkgPrices.forEach(el => {
    const inrVal = parseFloat(el.getAttribute('data-inr'));
    if (!isNaN(inrVal)) {
      const converted = Math.round(inrVal * currObj.rate);
      const isUpto = el.textContent.includes('Upto');
      const isPlus = el.textContent.includes('+');
      const prefixStr = isUpto ? 'Upto ' : '';
      const suffixStr = isPlus ? '/+' : currObj.suffix;
      el.textContent = `${prefixStr}${currObj.symbol}${converted.toLocaleString()}${suffixStr}`;
    }
  });

  // Update Addon Prices Labels
  const addonPrices = document.querySelectorAll('.addon-price');
  addonPrices.forEach(el => {
    const inrAttr = el.getAttribute('data-inr');
    if (inrAttr) {
      const inrVal = parseFloat(inrAttr.replace(/[^0-9.]/g, ''));
      const converted = Math.round(inrVal * currObj.rate);
      el.textContent = `+ ${currObj.symbol}${converted.toLocaleString()}${currObj.suffix}`;
    }
  });

  // Recalculate Range Slider & Calculator Output
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

// Main Calculator Engine (INR Baseline)
function recalculatePrice() {
  const pageSlider = document.getElementById('pageSlider');
  const pageCount = parseInt(pageSlider.value, 10);
  
  if (currentCalcType === 'simple') {
    document.getElementById('pageCountLabel').textContent = `${pageCount} Page${pageCount > 1 ? 's' : ''}`;
    document.getElementById('summaryPagesCount').textContent = `${pageCount} Pages`;
  } else {
    const productScale = pageCount * 20; // 20 to 200 products
    document.getElementById('pageCountLabel').textContent = `Up to ${productScale} Products`;
    document.getElementById('summaryPagesCount').textContent = `Up to ${productScale} Products`;
  }

  // Base Prices in INR
  let basePriceInr = (currentCalcType === 'simple') ? 10000 : 75000;

  // Extra pages/scale beyond baseline
  if (pageCount > 3) {
    const extraUnits = pageCount - 3;
    const unitPrice = (currentCalcType === 'simple') ? 1500 : 15000;
    basePriceInr += extraUnits * unitPrice;
  }

  // Addon Selections (REVISED USER PRICING)
  if (document.getElementById('addonDomain').checked) basePriceInr += 5000; // Custom Domain Setup - Rs 5000
  if (document.getElementById('addonPayment').checked) basePriceInr += 5000; // New Payment Integration - Rs 5000
  if (document.getElementById('addonRush').checked) basePriceInr += 25000; // Rush Hour Delivery - Rs 25000

  // Currency Conversion Calculation
  const currObj = CURRENCIES[currentCurrency];
  const finalPrice = Math.round(basePriceInr * currObj.rate);

  // Display Total Price
  document.getElementById('calcPriceDisplay').textContent = `${currObj.symbol}${finalPrice.toLocaleString()}${currObj.suffix}`;

  // Estimate Timeline Calculation
  let baseDays = (currentCalcType === 'simple') ? 7 : 12;
  if (pageCount > 5) baseDays += 5;
  if (document.getElementById('addonRush').checked) baseDays = Math.max(3, baseDays - 4);

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
function selectPackage(packageName, baseInr) {
  const serviceSelect = document.getElementById('serviceSelect');
  
  // Set matching select option
  for (let option of serviceSelect.options) {
    if (option.value.toLowerCase().includes(packageName.toLowerCase().split(' ')[0])) {
      serviceSelect.value = option.value;
      break;
    }
  }

  document.getElementById('clientMessage').value = `Hi Sandhya (+91 7530989390), I would like to book the "${packageName}" package!`;
  openModal();
}

// Claim Calculated Quote Trigger
function claimCalculatedQuote() {
  const typeName = document.getElementById('summaryTypeName').textContent;
  const price = document.getElementById('calcPriceDisplay').textContent;
  const scope = document.getElementById('summaryPagesCount').textContent;

  document.getElementById('clientMessage').value = `Hi Sandhya, I calculated an estimated quote for a ${typeName} (${scope}) for ${price}. Let's discuss and reserve a slot!`;
  openModal();
}

// Modal Handlers
function openModal() {
  document.getElementById('quoteModal').classList.add('active');
}

function closeModal() {
  document.getElementById('quoteModal').classList.remove('active');
}

// Lead Form Submission Handler (WhatsApp Direct Trigger to +91 7530989390)
function handleFormSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('clientName').value;
  const email = document.getElementById('clientEmail').value;
  const service = document.getElementById('serviceSelect').value;
  const message = document.getElementById('clientMessage').value;

  const encodedMsg = encodeURIComponent(
    `Hi Sandhya! My name is ${name} (${email}).\nI am interested in: ${service}.\n\nMessage: ${message}`
  );

  // Redirect directly to WhatsApp with pre-filled details!
  window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodedMsg}`, '_blank');
  
  closeModal();
}

// Social Proof Toast Notification Cycle
function initSocialProofToasts() {
  const toasts = [
    "🔥 Rohan from Mumbai just booked an Ecommerce Core store!",
    "⚡ Ananya from Delhi reserved a Growth Business Website!",
    "🚀 Kabir from Bangalore inquired about 'Your Mechanic' maintenance!"
  ];

  let toastIndex = 0;
  const toastEl = document.getElementById('toastNotification');
  const toastText = document.getElementById('toastText');

  if (!toastEl) return;

  setInterval(() => {
    toastText.textContent = toasts[toastIndex];
    toastEl.classList.add('active');

    setTimeout(() => {
      toastEl.classList.remove('active');
    }, 4000);

    toastIndex = (toastIndex + 1) % toasts.length;
  }, 14000);
}
