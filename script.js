/**
 * ECOCLOSET CORE LOGIC
 */
const cloudName = "dmvuzwlxs"; 
const uploadPreset = "ecocloset"; 

// 1. GLOBAL STATE
let totalCO2Saved = 0.0;

// 2. INITIALIZE WIDGET
const myWidget = cloudinary.createUploadWidget({
    cloudName: cloudName, 
    uploadPreset: uploadPreset,
    sources: ['local', 'url', 'camera'],
    multiple: false,
    cropping: true, 
    theme: "minimal",
    clientAllowedFormats: ["jpg", "png", "jpeg"],
    thumbnailTransformation: [{ width: 200, height: 200, crop: 'fit' }]
}, (error, result) => { 
    if (!error && result && result.event === "success") { 
        console.log("Success! Image data:", result.info);
        addItemToGrid(result.info);
    }
});

// 3. UI DASHBOARD LOGIC
function updateTotalImpact(amount) {
    totalCO2Saved += amount;
    const counterDisplay = document.getElementById("total-co2");
    if (counterDisplay) {
        counterDisplay.innerText = totalCO2Saved.toFixed(1);
    }
}

/**
 * UI FUNCTION: Adds the AI-processed image to the grid
 */
function addItemToGrid(info) {
    const grid = document.getElementById("closet-grid");
    
    // CLOUDINARY AI TRANSFORMATIONS
    const aiUrl = info.secure_url.replace(
        "/upload/", 
        "/upload/e_background_removal/f_auto,q_auto,c_pad,h_400,w_400/"
    );

    const card = document.createElement("article");
    card.className = "clothing-card";
    
    // SMART CALCULATION LOGIC
    // Checks filename for 'jean' or 'denim' to apply 25kg vs 2.5kg
    const isDenim = info.original_filename.toLowerCase().includes('jean') || 
                    info.original_filename.toLowerCase().includes('denim');
    
    const co2Saved = isDenim ? 25.0 : 2.5; 

    const dateAdded = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    card.innerHTML = `
        <img src="${aiUrl}" alt="Closet Item" loading="lazy" onerror="this.src='${info.secure_url}';">
        <div class="card-info">
            <p><small>Added: ${dateAdded}</small></p>
            <p class="carbon-stat">🌱 ${co2Saved}kg CO₂ Avoided</p>
            <p><small>${isDenim ? "High-impact denim" : "Standard item"} digitized!</small></p>
        </div>
    `;
    
    grid.prepend(card);
    
    // Update the total dashboard
    updateTotalImpact(co2Saved);
}

// 4. EVENT LISTENERS
document.addEventListener("DOMContentLoaded", () => {
    const uploadBtn = document.getElementById("upload_widget");
    
    if (uploadBtn) {
        uploadBtn.addEventListener("click", () => {
            if (typeof cloudinary !== 'undefined') {
                myWidget.open();
            } else {
                alert("Cloudinary library is still loading.");
            }
        }, false);
    }
});
