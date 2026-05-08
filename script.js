// --- 1. CONFIGURATION (Double-check these in your Cloudinary Dashboard) ---
const CLOUD_NAME = "dmvuzwlxs"; // Find this on your Dashboard
const UPLOAD_PRESET = "ecocloset"; // Must be an "Unsigned" preset

// --- 2. THE GALLERY STORAGE LOGIC ---
// This ensures your clothes stay on the page after a refresh
const loadGallery = () => {
    const savedClothes = JSON.parse(localStorage.getItem("arcaWardrobe")) || [];
    savedClothes.forEach(url => renderCard(url));
    updateImpact(savedClothes.length);
};

const updateImpact = (count) => {
    const totalDisplay = document.getElementById('total-co2');
    if (totalDisplay) {
        totalDisplay.innerText = (count * 2.5).toFixed(1);
    }
};

const renderCard = (url) => {
    const grid = document.getElementById('wardrobe-grid');
    if (!grid) return;

    // Apply AI background removal transformation to the URL
    const processedUrl = url.replace("/upload/", "/upload/e_background_removal/");

    const card = `
        <div class="clothing-card">
            <img src="${processedUrl}" alt="Clothing Item">
            <div class="card-info">
                <p class="carbon-stat">Saved 2.5kg CO₂</p>
                <small>Verified Carbon Save</small>
            </div>
        </div>
    `;
    grid.insertAdjacentHTML('afterbegin', card);
    // --- 1. RENDER WITH CATEGORY ---
const renderCard = (item) => {
    const grid = document.getElementById('wardrobe-grid');
    // item is now an object: { url: "...", category: "..." }
    const processedUrl = item.url.replace("/upload/", "/upload/e_background_removal/");

    const card = `
        <div class="clothing-card" data-category="${item.category}">
            <img src="${processedUrl}" alt="${item.category}">
            <div class="card-info">
                <p class="carbon-stat">Saved 2.5kg CO₂</p>
                <small>${item.category.toUpperCase()}</small>
            </div>
        </div>
    `;
    grid.insertAdjacentHTML('afterbegin', card);
};

// --- 2. FILTERING LOGIC ---
window.filterFolder = (category) => {
    const cards = document.querySelectorAll('.clothing-card');
    
    // Update button styling
    document.querySelectorAll('.folder-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText.toLowerCase().includes(category)) btn.classList.add('active');
    });

    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
};

// --- 3. MODIFIED WIDGET SUCCESS ---
// Inside your widget success callback:
(error, result) => {
    if (!error && result && result.event === "success") {
        // Ask the user which folder this belongs to
        const category = prompt("Which folder? (dresses, casuals, home)").toLowerCase() || 'casuals';
        
        const newItem = { url: result.info.secure_url, category: category };
        
        const saved = JSON.parse(localStorage.getItem("arcaWardrobe")) || [];
        saved.push(newItem);
        localStorage.setItem("arcaWardrobe", JSON.stringify(saved));

        renderCard(newItem);
        updateImpact(saved.length);
    }
}
};

// --- 3. CLOUDINARY INTEGRATION ---
let myWidget;

// Wait for the window to load to ensure Cloudinary library is present
window.onload = () => {
    if (typeof cloudinary !== 'undefined') {
        myWidget = cloudinary.createUploadWidget({
            cloudName: CLOUD_NAME,
            uploadPreset: UPLOAD_PRESET,
            sources: ['local', 'camera'],
            multiple: false,
            cropping: true,
            styles: {
                palette: {
                    window: "#FFFFFF",
                    sourceBg: "#F4F4F5",
                    windowBorder: "#9CAF88", // Sage Green border
                    tabIcon: "#00B894",
                    inactiveTabIcon: "#636E72",
                    menuIcons: "#00B894",
                    link: "#00B894",
                    action: "#00B894",
                    inProgress: "#00B894",
                    complete: "#20B832",
                    error: "#E84C3D",
                    textDark: "#2D3436",
                    textLight: "#FFFFFF"
                }
            }
        }, (error, result) => {
            if (!error && result && result.event === "success") {
                const newUrl = result.info.secure_url;
                
                // Save to LocalStorage
                const savedClothes = JSON.parse(localStorage.getItem("arcaWardrobe")) || [];
                savedClothes.push(newUrl);
                localStorage.setItem("arcaWardrobe", JSON.stringify(savedClothes));

                // Add to UI
                renderCard(newUrl);
                updateImpact(savedClothes.length);
            }
        });

        // Attach event listener to button
        const btn = document.getElementById("upload_widget");
        if (btn) {
            btn.addEventListener("click", () => myWidget.open(), false);
        }
    } else {
        console.error("Cloudinary library not found. Check your script tag in HTML.");
    }
    
    // Load existing items
    loadGallery();
};