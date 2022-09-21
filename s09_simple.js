// Einfaches Beispiel für das mehrfache Aufrufen bei unterschiedlicher Laufzeit
// Eine Job benötigt 100-600 ms
async function srv_run_SELECT(i)
{
    let ms = Math.floor(Math.random() * 5000 + 100);
    await new Promise(resolve => setTimeout(resolve, ms));
    console.log("done: " + i + " (" + ms + " ms)");
    return true;


}


// Es werden 20 Jobs gestartet (Zeitgleich)...
async function start()
{
    let lst = [];
    for (var i = 1; i <= 20; i++)
    {
        lst.push(srv_run_SELECT(i));
    }

    // und gewartet, bis alle fertig sind
    await Promise.allSettled(lst);
    console.log("Finish");
}

start();
