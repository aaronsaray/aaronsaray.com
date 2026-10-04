let bsod = document.getElementById('bsod');

if (document.documentElement.webkitRequestFullscreen) {
    document.addEventListener("webkitfullscreenchange", function () {
        bsod.style.height = (document.webkitIsFullScreen) ? "auto" : "0px";
    }, false);
}
document.getElementById('form').addEventListener('submit', e => {
    e.preventDefault();

    if (bsod.requestFullscreen) {
        bsod.requestFullscreen();
    }
    else if (bsod.webkitRequestFullscreen) {
        document.getElementById('bsod').style.height = 'auto';
        bsod.webkitRequestFullscreen();
    } else {
        alert('Unfortunately, your browser does not support this functionality. You may want to try it on a laptop or desktop.');
    }
})

let toggler = document.getElementById('navbar-toggler');

toggler.addEventListener('click', () => {
    let open = document.getElementById('navbarcontent').classList.toggle('show');
    toggler.setAttribute('aria-expanded', open);
});

// Safari has no closedby. The dialog has no padding, so a click whose
// target is the dialog itself landed on the backdrop.
let about = document.getElementById('about-modal');

if (!('closedBy' in HTMLDialogElement.prototype)) {
    about.addEventListener('click', e => {
        if (e.target === about) {
            about.close();
        }
    });
}
