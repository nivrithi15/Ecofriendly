// --- CONFIGURATION ---
const cloudName = "dmvuzwlxs"; // Replace with your Cloudinary name
const uploadPreset = "ecocloset";  // Replace with your unsigned preset

// --- UI ELEMENTS ---
const grid = document.getElementById('wardrobe-grid');
const totalDisplay = document.getElementById('total-co2');

// --- IMPACT LOGIC ---
function updateImpact() {
    // Count how many clothing cards are currently in the grid
    const itemCount = grid.getElementsByClassName('clothing-card').length;
    
    // Logic: Every item = 2.5kg saved
    const totalSaved = (itemCount * 2.5).toFixed(1);
    
    // Update the dashboard number
    totalDisplay.innerText = totalSaved;
}

// --- CLOUDINARY WIDGET ---
const myWidget = cloudinary.createUploadWidget({
    cloudName: cloudName, 
    uploadPreset: uploadPreset,
    sources: ['local', 'camera'],
    multiple: false,
    cropping: true, // Helps keep card images looking uniform
    clientAllowedFormats: ["png", "jpg", "jpeg"]
}, (error, result) => { 
    if (!error && result && result.event === "success") { 
        console.log('Done! Here is the image info: ', result.info);
        
        // 1. Get the image URL
        // Replace the old imageUrl line with this:
        const imageUrl = result.info.secure_url.replace("/upload/", "/upload/e_background_removal/");

        // 2. Create the HTML for the new card
        const cardHTML = `
            <div class="clothing-card">
                <img src="${imageUrl}" alt="Clothing Item">
                <div class="card-info">
                    <p class="carbon-stat">Saved 2.5kg CO₂</p>
                    <small>Added to Arca</small>
                </div>
            </div>
        `;

        // 3. Inject into the grid
        grid.insertAdjacentHTML('afterbegin', cardHTML);

        // 4. Update the impact counter immediately
        updateImpact();
    }
});

// Open widget on button click
document.getElementById("upload_widget").addEventListener("click", function(){
    myWidget.open();
}, false)
// --- 1. LOAD GALLERY ON STARTUP ---
document.addEventListener("DOMContentLoaded", () => {
    const savedClothes = JSON.parse(localStorage.getItem("myArcaCloset")) || [];
    savedClothes.forEach(url => renderCard(url));
    updateImpact();
});

// --- 2. THE RENDER FUNCTION ---
function renderCard(imageUrl) {
    const grid = document.getElementById('wardrobe-grid');
    // We apply the background removal transformation here too
    const transparentImg = imageUrl.replace("/upload/", "/upload/e_background_removal/");
    
    const cardHTML = `
        <div class="clothing-card">
            <img src="${transparentImg}" alt="Clothing Item">
            <div class="card-info">
                <p class="carbon-stat">Saved 2.5kg CO₂</p>
                <small>Digitalized</small>
            </div>
        </div>
    `;
    grid.insertAdjacentHTML('afterbegin', cardHTML);
}

// --- 3. UPDATED UPLOAD WIDGET ---
const myWidget = cloudinary.createUploadWidget({
    cloudName: cloudName, 
    uploadPreset: uploadPreset,
    cropping: true
}, (error, result) => { 
    if (!error && result && result.event === "success") { 
        const newUrl = result.info.secure_url;

        // Save to LocalStorage so it persists!
        const savedClothes = JSON.parse(localStorage.getItem("myArcaCloset")) || [];
        savedClothes.push(newUrl);
        localStorage.setItem("myArcaCloset", JSON.stringify(savedClothes));

        // Show it on the page
        renderCard(newUrl);
        updateImpact();
    }
});