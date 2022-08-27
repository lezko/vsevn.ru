// set onclick = 'return false' to all links with empty href attribute
// to prevent them from reloading the page
document.querySelectorAll('a[href=""]').forEach(a => {
    console.log(a);
    a.addEventListener('click', e => e.preventDefault());
});

// custom checkbox
document.querySelectorAll('.checkbox').forEach(c => {
    c.addEventListener('click', e => {
        e.target.classList.toggle('active');
    });
})