// --- 1. CONFIGURATION ---
const CLOUD_NAME = "dmvuzwlxs"; 
const UPLOAD_PRESET = "ecocloset"; 

let currentSelectedItemIndex = null;

// --- 2. IMPACT & RENDER LOGIC ---
const updateImpact = (count) => {
    const totalDisplay = document.getElementById('total-co2');
    if (totalDisplay) {
        totalDisplay.innerText = (count * 2.5).toFixed(1);
    }
};

const renderCard = (item, index) => {
    const grid = document.getElementById('wardrobe-grid');
    if (!grid) return;

    // Apply AI background removal transformation
    const processedUrl = item.url.replace("/upload/", "/upload/e_background_removal/");

    const card = `
        <div class="clothing-card" onclick="openItem(${index})" data-category="${item.category}">
            <img src="${processedUrl}" alt="${item.category}">
            <div class="card-info">
                <p class="carbon-stat">Saved 2.5kg CO₂</p>
                <small>${item.category.toUpperCase()}</small>
            </div>
        </div>
    `;
    grid.insertAdjacentHTML('beforeend', card);
};

// --- 3. MODAL (POP-UP) FUNCTIONS ---
window.openItem = (index) => {
    const saved = JSON.parse(localStorage.getItem("arcaWardrobe")) || [];
    const item = saved[index];
    currentSelectedItemIndex = index;

    document.getElementById('modal-img').src = item.url.replace("/upload/", "/upload/e_background_removal/");
    document.getElementById('modal-label').innerText = `Type: ${item.category.toUpperCase()}`;
    document.getElementById('item-modal').style.display = "block";
};

window.closeModal = () => {
    document.getElementById('item-modal').style.display = "none";
};

// Close modal if user clicks outside the box
window.onclick = (event) => {
    const modal = document.getElementById('item-modal');
    if (event.target == modal) closeModal();
};

// --- 4. DELETE FUNCTION ---
document.getElementById('delete-btn').addEventListener('click', () => {
    let saved = JSON.parse(localStorage.getItem("arcaWardrobe")) || [];
    
    // Remove the specific item
    saved.splice(currentSelectedItemIndex, 1);
    
    // Update LocalStorage
    localStorage.setItem("arcaWardrobe", JSON.stringify(saved));
    
    // Close and Refresh
    closeModal();
    loadGallery(); 
});

// --- 5. FOLDER FILTERING ---
window.filterFolder = (category) => {
    const cards = document.querySelectorAll('.clothing-card');
    
    // Update buttons
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

// --- 6. INITIALIZE GALLERY ---
const loadGallery = () => {
    const grid = document.getElementById('wardrobe-grid');
    grid.innerHTML = ''; // Clear current grid
    const saved = JSON.parse(localStorage.getItem("arcaWardrobe")) || [];
    saved.forEach((item, index) => renderCard(item, index));
    updateImpact(saved.length);
};

// --- 7. CLOUDINARY WIDGET SETUP ---
window.onload = () => {
    if (typeof cloudinary !== 'undefined') {
        const myWidget = cloudinary.createUploadWidget({
            cloudName: CLOUD_NAME,
            uploadPreset: UPLOAD_PRESET,
            sources: ['local', 'camera'],
            cropping: true,
            multiple: false
        }, (error, result) => {
            if (!error && result && result.event === "success") {
                const category = prompt("Which folder? (dresses, casuals, home)").toLowerCase() || 'casuals';
                const newItem = { url: result.info.secure_url, category: category };
                
                const saved = JSON.parse(localStorage.getItem("arcaWardrobe")) || [];
                saved.push(newItem);
                localStorage.setItem("arcaWardrobe", JSON.stringify(saved));

                loadGallery(); // Refresh the whole view
            }
        });

        document.getElementById("upload_widget").addEventListener("click", () => myWidget.open(), false);
    }
    loadGallery();
};