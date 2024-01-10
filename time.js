const updateTime = () => {
    document.querySelector('header').textContent = `${new Date().toUTCString()}`;
}

setInterval(updateTime, 1000);
