(async function() {
  // ==========================================
  // CONFIGURATION - CHANGE THIS URL
  // ==========================================
  // Set your custom QR code base URL here
  const QR_CODE_BASE_URL = 'https://extensibility-store-2.myshopify.com';

  console.log('Using QR Code Base URL:', QR_CODE_BASE_URL);

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================

  // Get color based on material name
  function getColorForMaterial(material) {
    const colorMap = {
      'cotton': '#8e24aa',
      'organic cotton': '#8e24aa',
      'elastane': '#d1c4e9',
      'recycled elastane': '#d1c4e9',
      'polyester': '#ab47bc',
      'wool': '#7b1fa2',
      'silk': '#ba68c8',
      'linen': '#9c27b0',
      'nylon': '#ce93d8'
    };

    const materialLower = (material || '').toLowerCase();
    for (const [key, color] of Object.entries(colorMap)) {
      if (materialLower.includes(key)) {
        return color;
      }
    }
    return '#ab47bc'; // Default purple color
  }

  // Get icon based on journey stage
  function getIconForStage(stage) {
    const iconMap = {
      'harvest': '🌱',
      'raw material': '🌱',
      'material': '🌱',
      'spinning': '🧶',
      'weaving': '🧶',
      'dyeing': '🎨',
      'dye': '🎨',
      'manufacturing': '🧵',
      'production': '🧵',
      'quality': '✓',
      'control': '✓',
      'distribution': '📦',
      'delivery': '📦',
      'packaging': '📦',
      'shipping': '🚢',
      'retail': '🏪'
    };

    const stageLower = (stage || '').toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (stageLower.includes(key)) {
        return icon;
      }
    }
    return '📍'; // Default location pin
  }

  // ==========================================
  // 1. FETCH PRODUCT DATA FROM AKENEO API
  // ==========================================
  // Default product data structure
  let productData = {
    name: "Loading...",
    sku: "Loading...",
    status: "Verified Passport",
    sustainability: {
      water: "N/A",
      co2: "N/A",
      grade: "N/A"
    },
    composition: [],
    journey: [],
    certifications: [],
    careInstructions: [],
    qrCodeUrl: null,
    qrCodeData: null
  };

  // Fetch product data from Akeneo API using current context
  try {
    // Check if we're on a product page
    if ('product' in PIM.context) {
      // Get the product UUID, locale, and scope from context
      const productUuid = PIM.context.product.uuid;
      const currentLocale = PIM.context.user?.catalog_locale || 'en_US';
      const currentScope = PIM.context.user?.catalog_scope || 'ecommerce';

      console.log('Context - Locale:', currentLocale, 'Scope:', currentScope);
      console.log('Full context:', PIM.context);

      // Fetch full product data using the Product UUID API
      const product = await PIM.api.product_uuid_v1.get({
        uuid: productUuid
      });

      // Update product data with current product information
      if (product) {
        // Debug: Log the product object to console
        console.log('Product object:', product);

        // Helper function to get attribute value for current locale/scope
        const getAttributeValue = (attributeCode, skipFallback = false) => {
          const attribute = product.values?.[attributeCode];
          if (!attribute || !Array.isArray(attribute)) return null;

          console.log(`[${attributeCode}] Available values:`, attribute.map(v => ({ locale: v.locale, scope: v.scope, data: v.data })));

          // Try to find value matching current locale and scope
          let value = attribute.find(v => v.locale === currentLocale && v.scope === currentScope);
          if (value) {
            console.log(`[${attributeCode}] Found exact match (locale=${currentLocale}, scope=${currentScope})`);
            return value.data;
          }

          // Fallback: try current locale with null scope
          value = attribute.find(v => v.locale === currentLocale && v.scope === null);
          if (value) {
            console.log(`[${attributeCode}] Found locale match (locale=${currentLocale}, scope=null)`);
            return value.data;
          }

          // Fallback: try null locale with current scope
          value = attribute.find(v => v.locale === null && v.scope === currentScope);
          if (value) {
            console.log(`[${attributeCode}] Found scope match (locale=null, scope=${currentScope})`);
            return value.data;
          }

          // If skipFallback is true, don't use first available value
          if (skipFallback) {
            console.log(`[${attributeCode}] No match found for current locale/scope, skipping fallback`);
            return null;
          }

          // Fallback: try first available value
          if (attribute.length > 0) {
            value = attribute[0];
            console.log(`[${attributeCode}] Using fallback first value (locale=${value.locale}, scope=${value.scope})`);
            return value.data;
          }

          return null;
        };

        // Get product name using locale/scope context (no fallback to other locales)
        productData.name = getAttributeValue('name', true) || product.identifier || "Product Name";

        // Get SKU - try multiple possible locations
        productData.sku = product.identifier ||
                          product.values?.sku?.[0]?.data ||
                          product.values?.identifier?.[0]?.data ||
                          product.uuid ||
                          "SKU";

        console.log('Extracted SKU:', productData.sku);
        console.log('Product identifier:', product.identifier);

        // ==========================================
        // DYNAMIC COMPOSITION (Material DNA)
        // ==========================================
        // Try to get composition from product attributes using locale/scope context
        // Option 1: If you have individual material attributes (e.g., cotton_percentage, elastane_percentage)
        // Use skipFallback=true to only show materials that have data for current locale/scope
        const cottonPercentage = getAttributeValue('cotton_percentage', true);
        const elastanePercentage = getAttributeValue('elastane_percentage', true);
        const polyesterPercentage = getAttributeValue('polyester_percentage', true);

        // Option 2: If you have a structured composition attribute (JSON or table)
        const compositionData = getAttributeValue('composition', true);

        // Build composition array
        if (compositionData && Array.isArray(compositionData)) {
          // If composition is stored as structured data
          productData.composition = compositionData.map(item => ({
            label: item.material || item.label,
            value: item.percentage || item.value,
            color: item.color || getColorForMaterial(item.material || item.label)
          }));
        } else {
          // Build from individual attributes
          productData.composition = [];
          if (cottonPercentage) {
            productData.composition.push({
              label: "Cotton",
              value: parseFloat(cottonPercentage),
              color: "#8e24aa"  // Purple for cotton
            });
          }
          if (elastanePercentage) {
            productData.composition.push({
              label: "Elastane",
              value: parseFloat(elastanePercentage),
              color: "#d1c4e9"  // Light purple for elastane
            });
          }
          if (polyesterPercentage) {
            productData.composition.push({
              label: "Polyester",
              value: parseFloat(polyesterPercentage),
              color: "#ab47bc"  // Medium purple for polyester
            });
          }

          // No fallback - if no composition data, leave it empty
        }

        // ==========================================
        // DYNAMIC JOURNEY (Enhanced with more stages)
        // ==========================================
        // Try to get journey stages from product attributes using locale/scope context (no fallback)
        const harvestingLocation = getAttributeValue('harvesting_location', true);
        const harvestingDate = getAttributeValue('harvesting_date', true);
        const harvestingSupplier = getAttributeValue('harvesting_supplier', true);

        const spinningLocation = getAttributeValue('spinning_location', true);
        const spinningDate = getAttributeValue('spinning_date', true);
        const spinningSupplier = getAttributeValue('spinning_supplier', true);

        const dyeingLocation = getAttributeValue('dyeing_location', true);
        const dyeingDate = getAttributeValue('dyeing_date', true);
        const dyeingSupplier = getAttributeValue('dyeing_supplier', true);

        const manufacturingLocation = getAttributeValue('manufacturing_location', true);
        const manufacturingDate = getAttributeValue('manufacturing_date', true);
        const manufacturingSupplier = getAttributeValue('manufacturing_supplier', true);

        const qualityControlLocation = getAttributeValue('quality_control_location', true);
        const qualityControlDate = getAttributeValue('quality_control_date', true);

        const distributionLocation = getAttributeValue('distribution_location', true);
        const distributionDate = getAttributeValue('distribution_date', true);

        // Option 2: If you have a structured journey attribute (JSON or table)
        const journeyData = getAttributeValue('journey', true);

        // Build journey array
        if (journeyData && Array.isArray(journeyData)) {
          // If journey is stored as structured data
          productData.journey = journeyData.map(item => ({
            stage: item.stage,
            location: item.location,
            date: item.date,
            icon: item.icon || getIconForStage(item.stage)
          }));
        } else {
          // Build from individual attributes
          productData.journey = [];

          if (harvestingLocation) {
            productData.journey.push({
              stage: "Harvesting",
              location: harvestingLocation,
              date: harvestingDate || "N/A",
              supplier: harvestingSupplier || null,
              icon: "🌱"
            });
          }

          if (spinningLocation) {
            productData.journey.push({
              stage: "Spinning",
              location: spinningLocation,
              date: spinningDate || "N/A",
              supplier: spinningSupplier || null,
              icon: "🧶"
            });
          }

          if (dyeingLocation) {
            productData.journey.push({
              stage: "Dyeing",
              location: dyeingLocation,
              date: dyeingDate || "N/A",
              supplier: dyeingSupplier || null,
              icon: "🎨"
            });
          }

          if (manufacturingLocation) {
            productData.journey.push({
              stage: "Manufacturing",
              location: manufacturingLocation,
              date: manufacturingDate || "N/A",
              supplier: manufacturingSupplier || null,
              icon: "🧵"
            });
          }

          if (qualityControlLocation) {
            productData.journey.push({
              stage: "Quality Control",
              location: qualityControlLocation,
              date: qualityControlDate || "N/A",
              supplier: null,
              icon: "✓"
            });
          }

          if (distributionLocation) {
            productData.journey.push({
              stage: "Distribution",
              location: distributionLocation,
              date: distributionDate || "N/A",
              supplier: null,
              icon: "📦"
            });
          }

          // No fallback - if no journey data, leave it empty
        }

        console.log('Composition:', productData.composition);
        console.log('Journey:', productData.journey);

        // ==========================================
        // DYNAMIC CERTIFICATIONS
        // ==========================================
        const certificationsData = getAttributeValue('certifications', true);
        const gots = getAttributeValue('gots_certified', true);
        const fairTrade = getAttributeValue('fair_trade_certified', true);
        const oeko = getAttributeValue('oeko_tex_certified', true);

        if (certificationsData && Array.isArray(certificationsData)) {
          productData.certifications = certificationsData;
        } else {
          // Build from individual attributes
          if (gots) productData.certifications.push("GOTS");
          if (fairTrade) productData.certifications.push("Fair Trade");
          if (oeko) productData.certifications.push("OEKO-TEX");

          // No fallback - if no certifications data, leave it empty
        }

        // ==========================================
        // DYNAMIC CARE INSTRUCTIONS
        // ==========================================
        const careInstructionsData = getAttributeValue('care_instructions', true);
        const washTemp = getAttributeValue('wash_temperature', true);
        const bleachAllowed = getAttributeValue('bleach_allowed', true);
        const dryMethod = getAttributeValue('dry_method', true);
        const ironTemp = getAttributeValue('iron_temperature', true);

        if (careInstructionsData && Array.isArray(careInstructionsData)) {
          productData.careInstructions = careInstructionsData;
        } else {
          // Build from individual attributes
          productData.careInstructions = [];
          if (washTemp) {
            productData.careInstructions.push({
              icon: "🌡️",
              text: `Machine wash at ${washTemp}`
            });
          }
          if (bleachAllowed !== null && bleachAllowed !== undefined) {
            if (bleachAllowed === false || bleachAllowed === "no" || bleachAllowed === 0) {
              productData.careInstructions.push({
                icon: "🚫",
                text: "Do not bleach"
              });
            } else {
              productData.careInstructions.push({
                icon: "✓",
                text: "Bleach allowed"
              });
            }
          }
          if (dryMethod) {
            productData.careInstructions.push({
              icon: "💨",
              text: dryMethod
            });
          }
          if (ironTemp) {
            productData.careInstructions.push({
              icon: "🔥",
              text: `Iron at ${ironTemp}`
            });
          }

          // No fallback - if no care instructions data, leave it empty
        }

        console.log('Certifications:', productData.certifications);
        console.log('Care Instructions:', productData.careInstructions);

        // ==========================================
        // DYNAMIC SUSTAINABILITY IMPACT
        // ==========================================
        // Try to get sustainability data from product attributes using locale/scope context (no fallback)
        const waterUsage = getAttributeValue('water_usage', true);
        const co2Emissions = getAttributeValue('co2_emissions', true);
        const sustainabilityGrade = getAttributeValue('sustainability_grade', true);

        // Option 2: If you have a structured sustainability attribute
        const sustainabilityData = getAttributeValue('sustainability', true);

        if (sustainabilityData && typeof sustainabilityData === 'object') {
          // If sustainability is stored as structured data (JSON)
          productData.sustainability = {
            water: sustainabilityData.water || sustainabilityData.water_usage || "N/A",
            co2: sustainabilityData.co2 || sustainabilityData.co2_emissions || "N/A",
            grade: sustainabilityData.grade || sustainabilityData.sustainability_grade || "N/A"
          };
        } else {
          // Build from individual attributes
          if (waterUsage) {
            productData.sustainability.water = waterUsage;
          }
          if (co2Emissions) {
            productData.sustainability.co2 = co2Emissions;
          }
          if (sustainabilityGrade) {
            productData.sustainability.grade = sustainabilityGrade;
          }
        }

        console.log('Sustainability:', productData.sustainability);

        // ==========================================
        // GENERATE QR CODE
        // ==========================================
        // Use the constant from the top of the file
        let qrCodeBaseUrl = QR_CODE_BASE_URL;

        // Ensure the URL has a protocol
        if (qrCodeBaseUrl && !qrCodeBaseUrl.startsWith('http://') && !qrCodeBaseUrl.startsWith('https://')) {
          qrCodeBaseUrl = `https://${qrCodeBaseUrl}`;
        }

        console.log('Final QR Code Base URL:', qrCodeBaseUrl);

        // Generate a URL for the QR code using the SKU/identifier
        productData.qrCodeData = `${qrCodeBaseUrl}/products/${product.identifier}`;
        console.log('QR Code Data:', productData.qrCodeData);

        // Alternative: Use UUID instead of SKU/identifier
        // productData.qrCodeData = `${qrCodeBaseUrl}/${product.uuid}`;

        // Generate QR code image URL using a free QR code API
        // Using quickchart.io (free service)
        productData.qrCodeUrl = `https://quickchart.io/qr?text=${encodeURIComponent(productData.qrCodeData)}&size=130&margin=1`;
      }
    } else {
      console.warn('Not on a product page - no product data available');
    }
  } catch (error) {
    console.error('Error fetching product data:', error);
    // Keep default "Loading..." values on error
  }

  const colors = {
    bg: "transparent",  // Transparent background
    card: "#ffffff",
    cardBg: "#fafafa",  // Light background for sections
    text: "#4a148c",
    accent: "#ab47bc",
    subtle: "#f3e5f5",
    border: "#e1bee7"
  };

  // ==========================================
  // 2. HTML GENERATION
  // ==========================================
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Digital Product Passport</title>
      <style>
        body {
          font-family: 'Calibri', 'Segoe UI', sans-serif;
          background-color: ${colors.bg};
          color: ${colors.text};
          margin: 0;
          padding: 10px 2px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 100vh;
          box-sizing: border-box;
        }

        /* The Vertical Card */
        .passport-card {
          background: ${colors.card};
          width: 100%;
          max-width: 380px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(74, 20, 140, 0.12);
          overflow: hidden;
          margin: 10px 2px;
          border: 1px solid ${colors.border};
        }

        /* Extension Title */
        .extension-title {
          background: ${colors.accent};
          color: white;
          padding: 12px 20px;
          text-align: center;
          font-size: 14px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        /* Header Section */
        .header-section {
          background: ${colors.subtle};
          padding: 35px 15px;
          text-align: center;
          border-bottom: 1px solid ${colors.border};
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* UPDATED: QR Frame with Text Centering */
        .qr-frame {
          width: 130px;
          height: 130px;
          padding: 8px;
          background: white;
          border: 2px dashed ${colors.accent};
          border-radius: 12px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: ${colors.accent};
          font-weight: bold;
          font-size: 14px;
        }

        h1 { 
          margin: 10px 0 5px 0; 
          font-size: 22px; 
          line-height: 1.3;
          color: ${colors.text};
        }
        
        .sku-badge {
          font-family: monospace;
          background: white;
          color: ${colors.text};
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 14px;
          border: 1px solid ${colors.border};
        }

        .status-badge {
          margin-top: 15px;
          font-size: 11px; 
          font-weight: bold; 
          color: #27ae60; 
          text-transform: uppercase;
          letter-spacing: 1px;
          display: flex; align-items: center; gap: 5px;
        }

        /* Content Section */
        .content-section {
          padding: 30px 15px;
        }

        h3 {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: ${colors.accent};
          border-bottom: 2px solid ${colors.subtle};
          padding-bottom: 8px;
          margin: 0 0 20px 0;
        }

        .data-block { margin-bottom: 35px; }

        /* Metrics */
        .metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
        }
        .metric {
          background: #f8f0fc;
          padding: 12px 5px;
          border-radius: 12px;
          text-align: center;
        }
        .metric-val {
          display: block;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 4px;
        }
        .metric-lbl {
          font-size: 10px;
          text-transform: uppercase;
          opacity: 0.8;
        }

        /* Composition */
        .comp-row { margin-bottom: 12px; }
        .comp-label {
          display: flex; justify-content: space-between;
          font-size: 14px; font-weight: bold; margin-bottom: 4px;
        }
        .bar-bg {
          background: ${colors.subtle};
          height: 8px; border-radius: 4px; overflow: hidden;
        }

        /* Journey Timeline */
        .journey-item {
          display: flex;
          align-items: flex-start; 
          margin-bottom: 20px;
          position: relative;
        }
        /* Vertical Line */
        .journey-item:not(:last-child)::after {
            content: '';
            position: absolute;
            left: 17px;
            top: 36px;
            bottom: -20px;
            width: 2px;
            background: ${colors.border};
        }
        .j-icon {
          width: 36px; height: 36px;
          background: ${colors.subtle};
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin-right: 15px;
          font-size: 18px;
          flex-shrink: 0;
          z-index: 1;
        }
        .j-text { display: flex; flex-direction: column; }
        .j-text h4 { margin: 0 0 2px 0; font-size: 14px; color: ${colors.text}; }
        .j-text p { margin: 0; font-size: 12px; color: ${colors.accent}; }
        .j-supplier { font-size: 11px; color: #555; margin-top: 2px; font-weight: 600; }
        .j-date { font-size: 11px; color: #9e9e9e; margin-top: 2px; font-style: italic; }

        /* Certifications */
        .certifications-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .cert-badge {
          background: #e8f5e9;
          border: 2px solid #4caf50;
          border-radius: 8px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: bold;
          color: #2e7d32;
        }
        .cert-icon {
          font-size: 14px;
          color: #4caf50;
        }

        /* Care Instructions */
        .care-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .care-item {
          background: #f8f0fc;
          padding: 10px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
        }
        .care-icon {
          font-size: 18px;
          flex-shrink: 0;
        }
        .care-text {
          color: ${colors.text};
        }

        /* Footer */
        .footer {
          text-align: center;
          font-size: 10px;
          color: ${colors.accent};
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid ${colors.subtle};
        }
      </style>
    </head>
    <body>
      <div class="passport-card">

        <div class="extension-title">
          📋 Digital Product Passport
        </div>

        <div class="header-section">
          <div class="qr-frame">
            ${productData.qrCodeUrl
              ? `<img src="${productData.qrCodeUrl}" alt="Product QR Code" style="width: 100%; height: 100%; object-fit: contain;" />`
              : 'QR Code<br>Example'
            }
          </div>
          <h1>${productData.name}</h1>
          <span class="sku-badge">${productData.sku}</span>
          <div class="status-badge">
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>
            ${productData.status}
          </div>
        </div>

        <div class="content-section">

          ${productData.sustainability.water || productData.sustainability.co2 || productData.sustainability.grade ? `
          <div class="data-block">
            <h3>Sustainability Impact</h3>
            <div class="metrics-grid">
              <div class="metric"><span class="metric-val">${productData.sustainability.water}</span><span class="metric-lbl">Water</span></div>
              <div class="metric"><span class="metric-val">${productData.sustainability.co2}</span><span class="metric-lbl">CO2</span></div>
              <div class="metric"><span class="metric-val">${productData.sustainability.grade}</span><span class="metric-lbl">Grade</span></div>
            </div>
          </div>
          ` : ''}

          ${productData.composition.length > 0 ? `
          <div class="data-block">
            <h3>Material DNA</h3>
            ${productData.composition.map(c => `
              <div class="comp-row">
                <div class="comp-label"><span>${c.label}</span><span>${c.value}%</span></div>
                <div class="bar-bg"><div style="width:${c.value}%; height:100%; background:${c.color}"></div></div>
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${productData.journey.length > 0 ? `
          <div class="data-block">
            <h3>Product Journey</h3>
            ${productData.journey.map(j => `
              <div class="journey-item">
                <div class="j-icon">${j.icon}</div>
                <div class="j-text">
                    <h4>${j.stage}</h4>
                    <p>${j.location}</p>
                    ${j.supplier ? `<span class="j-supplier">Supplier: ${j.supplier}</span>` : ''}
                    <span class="j-date">${j.date}</span>
                </div>
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${productData.certifications.length > 0 ? `
          <div class="data-block">
            <h3>Certifications & Compliance</h3>
            <div class="certifications-grid">
              ${productData.certifications.map(cert => `
                <div class="cert-badge">
                  <span class="cert-icon">✓</span>
                  <span class="cert-text">${cert}</span>
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}

          ${productData.careInstructions.length > 0 ? `
          <div class="data-block">
            <h3>Care Instructions</h3>
            <div class="care-list">
              ${productData.careInstructions.map(care => `
                <div class="care-item">
                  <span class="care-icon">${care.icon}</span>
                  <span class="care-text">${care.text}</span>
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}

          <div class="footer">
            Powered by Akeneo DX
          </div>

        </div>
      </div>
    </body>
    </html>
  `;

  // ==========================================
  // 3. EXECUTE: WIPE PAGE INSTANTLY
  // ==========================================
  document.documentElement.innerHTML = htmlContent;

})();