var start = new Date()

document.addEventListener("DOMContentLoaded", ()=>{
    document.getElementById("pl").innerText = new Date().getTime() - start.getTime();
})