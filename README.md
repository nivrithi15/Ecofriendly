# EcoPixel: Sustainable Media Calculator

This project was built to address the hidden environmental cost of the web. Every byte of data transferred across the internet consumes energy; by optimizing images with **Cloudinary**, we can significantly reduce bandwidth usage and the resulting digital carbon footprint.

## The Concept
**EcoPixel** is a lightweight tool that demonstrates the power of "Green Coding." It allows users to upload any image, automatically applies Cloudinary’s `f_auto` and `q_auto` transformations, and calculates the real-world CO₂ reduction achieved through data optimization.

## Features
*   **Instant Optimization:** Uses Cloudinary's AI to choose the best format and quality for images.
*   **Sustainability Metrics:** Calculates estimated CO₂ savings based on data reduction (using the formula: $CO_{2} \text{ (grams)} = \text{data saved in MB} \times 0.02$).
*   **Visual Comparison:** Side-by-side view of original vs. optimized media.
*   **One-Click Upload:** Integrated with the Cloudinary Upload Widget for a seamless user experience.

## Tech Stack
*   **Frontend:** HTML5, CSS3 (Water.css), JavaScript.
*   **Media Engine:** Cloudinary (Upload Widget & Transformation API).
*   **Deployment:** Netlify


*Developed for the Cloudinary Earth Day Mini Hack*
