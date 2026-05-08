// --- 1. CONFIGURATION ---
const CLOUD_NAME = "dmvuzwlxs"; 
const UPLOAD_PRESET = "ecocloset"; 
// --- CORE LOGIC ---
const updateImpact = (count) => {
    document.getElementById('total-co2').innerText = (count * 2.5).toFixed(1);
};

const renderCard = (item, index) => {
    const grid = document.getElementById('wardrobe-grid');
    // Basic image processing
    const imgUrl = item.url.replace("/upload/", "/upload/e_background_removal/");

    const cardHTML = `
        <div class="clothing-card" onclick="openItem(${index})">
            <img src="${imgUrl}" onerror="this.src='${item.url}'"> 
            <div class="card-info">
                <p class="carbon-stat">Saved 2.5kg CO₂</p>
                <small class="label-tag">${item.category.toUpperCase()}</small>
            </div>
        </div>
    `;
    grid.innerHTML += cardHTML;
};

const loadGallery = () => {
    const grid = document.getElementById('wardrobe-grid');
    grid.innerHTML = ""; // Reset grid
    const saved = JSON.parse(localStorage.getItem("arcaItems")) || [];
    saved.forEach((item, index) => renderCard(item, index));
    updateImpact(saved.length);
};

// --- WIDGET & MODAL ---
window.onload = () => {
    const uploadBtn = document.getElementById("upload_widget");
    const categorySelect = document.getElementById("category-select");

    if (typeof cloudinary !== 'undefined' && uploadBtn) {
        const myWidget = cloudinary.createUploadWidget({
            cloudName: CLOUD_NAME,
            uploadPreset: UPLOAD_PRESET,
            cropping: true
        }, (error, result) => {
            if (!error && result && result.event === "success") {
                const newItem = { 
                    url: result.info.secure_url, 
                    category: categorySelect.value 
                };
                const saved = JSON.parse(localStorage.getItem("arcaItems")) || [];
                saved.push(newItem);
                localStorage.setItem("arcaItems", JSON.stringify(saved));
                loadGallery();
            }
        });

        uploadBtn.addEventListener("click", () => myWidget.open());
    }
    loadGallery();
};

// Simple Modal Functions
window.openItem = (index) => {
    const saved = JSON.parse(localStorage.getItem("arcaItems")) || [];
    const item = saved[index];
    const modal = document.getElementById('item-modal');
    document.getElementById('modal-img').src = item.url;
    document.getElementById('modal-label').innerText = item.category.toUpperCase();
    modal.style.display = "block";
    
    // Setup delete for THIS specific item
    document.getElementById('delete-btn').onclick = () => {
        saved.splice(index, 1);
        localStorage.setItem("arcaItems", JSON.stringify(saved));
        modal.style.display = "none";
        loadGallery();
    };
};
window.openItem = (index) => {
    const saved = JSON.parse(localStorage.getItem("arcaItems")) || [];
    const item = saved[index];
    const modal = document.getElementById('item-modal');
    
    // Set Image and Label
    document.getElementById('modal-img').src = item.url;
    document.getElementById('modal-label').innerText = item.category.toUpperCase();
    
    // Show Modal
    modal.style.display = "block";

    // LINK THE DELETE BUTTON
    const delBtn = document.getElementById('delete-btn');
    delBtn.onclick = () => {
        if(confirm("Are you sure you want to remove this item?")) {
            saved.splice(index, 1);
            localStorage.setItem("arcaItems", JSON.stringify(saved));
            modal.style.display = "none";
            loadGallery(); // This refreshes the grid
        }
    };
};
window.openStory = () => {
    document.getElementById('story-modal').style.display = "block";
};

window.closeStory = () => {
    document.getElementById('story-modal').style.display = "none";
};

// Update the general window.onclick to handle both modals
window.onclick = (event) => {
    const itemModal = document.getElementById('item-modal');
    const storyModal = document.getElementById('story-modal');
    if (event.target == itemModal) itemModal.style.display = "none";
    if (event.target == storyModal) storyModal.style.display = "none";
};
window.closeModal = () => document.getElementById('item-modal').style.display = "none";