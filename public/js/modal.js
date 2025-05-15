// modal.js
const modal = document.getElementById("myModal");
const closeButton = document.querySelector(".close");

function openModal() {
    modal.style.display = "block";
    isModalOpen = true;
    toggleBackButton();
}

function closeModal() {
    modal.style.display = "none";
    isModalOpen = false;
    toggleBackButton();
}

closeButton.onclick = function() {
    closeModal();
};

window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
};
