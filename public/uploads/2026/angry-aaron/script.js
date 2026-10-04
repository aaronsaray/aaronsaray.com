const FIRE_ANIMATION_DURATION = 600;

let audioElements = [],
    lastPlayedIndex = -1,
    fireIntensityLevel = 0,
    angryButton,
    fireContainer,
    volumeModal,
    modalConfirmButton,
    hasAcknowledgedVolume = false;

function init() {
    angryButton = document.querySelector('main button');
    fireContainer = document.querySelector('aside');
    volumeModal = document.querySelector('dialog');
    modalConfirmButton = volumeModal.querySelector('button');
    setupEventListeners();
    for (let i = 1; i <= 5; i++) {
        const audio = new Audio(`sounds/angry${i}.mp3`);
        audio.preload = 'auto';
        audioElements.push(audio);
    }
    showVolumeModal();
}

function setupEventListeners() {
    angryButton.addEventListener('click', handleButtonInteraction);
    angryButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleButtonInteraction();
    }, { passive: false });
    modalConfirmButton.addEventListener('click', handleModalConfirm);
    volumeModal.addEventListener('cancel', (event) => event.preventDefault());
    volumeModal.addEventListener('animationend', handleModalAnimationEnd);
}

function handleButtonInteraction() {
    if (!hasAcknowledgedVolume) {
        showVolumeModal();
        return;
    }
    playRandomSound();
    triggerFireAnimation();
}

function handleModalConfirm() {
    closeVolumeModal();
}

function handleModalAnimationEnd(event) {
    if (event.target !== volumeModal || !volumeModal.classList.contains('closing')) {
        return;
    }
    volumeModal.classList.remove('closing');
    volumeModal.close();
}

function playRandomSound() {
    let randomIndex;

    do {
        randomIndex = Math.floor(Math.random() * audioElements.length);
    } while (randomIndex === lastPlayedIndex && audioElements.length > 1);

    lastPlayedIndex = randomIndex;
    const selectedAudio = audioElements[randomIndex];
    selectedAudio.currentTime = 0;
    selectedAudio.play();
}

function triggerFireAnimation() {
    if (fireIntensityLevel < 10) {
        fireIntensityLevel++;
    }

    const scaleFinal = 1.2 + (fireIntensityLevel - 1) * 0.1667;
    const colorG = Math.round(180 - (fireIntensityLevel - 1) * 11.11);
    const colorB = Math.round(50 - (fireIntensityLevel - 1) * 5.56);
    const duration = Math.round(700 - (fireIntensityLevel - 1) * 33.33);

    fireContainer.style.setProperty('--fire-scale-final', scaleFinal);
    fireContainer.style.setProperty('--fire-color-r', 255);
    fireContainer.style.setProperty('--fire-color-g', colorG);
    fireContainer.style.setProperty('--fire-color-b', colorB);
    fireContainer.style.setProperty('--fire-duration', `${duration}ms`);

    navigator.vibrate?.([40 + fireIntensityLevel * 6, 15, 20 + fireIntensityLevel * 3]);

    fireContainer.classList.add('firing');
    setTimeout(() => {
        fireContainer.classList.remove('firing');
    }, duration);
}

function showVolumeModal() {
    volumeModal.classList.remove('closing');
    if (volumeModal.open) {
        return;
    }
    volumeModal.showModal();
}

function closeVolumeModal() {
    hasAcknowledgedVolume = true;
    if (!volumeModal.open || volumeModal.classList.contains('closing')) {
        return;
    }
    volumeModal.classList.add('closing');
}

document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
