console.log("===== 1) BEFORE new Promise() =====");
// Promise erstellen; wird direkt ausgeführt
const promiseJob = new Promise((resolveFunction, rejectFunction) =>
{
    const isJobSuccess = Math.random() > 0.5 ? true : false;

    if (isJobSuccess)
    {
        // Kann alles mögliche sein, von ein bool, int, string, array, object... Geht alles
        const resultData = {
            msg: "Job successfull",
            code: 1,
            data: [1, 2, 3, 4, 5]
        }
        resolveFunction(resultData);
    }
    else
    {
        const resultData = {
            msg: "Job failed",
            code: 0,
            data: []
        }
        rejectFunction(resultData);
    }

});

console.log("===== 2) AFTER new Promise() =====");
// diese promise prüfen, erfolgreich (resolve) -> then, nicht erfolgreich (reject) _> catch
promiseJob
    .then((data) =>
    {
        console.log(data.msg);
        for (var z of data.data) { console.log(z) };
    })
    .catch((data) =>
    {
        console.log(data.msg);
    });

console.log("===== 3) END OF SKRIPT =====");

// Dient nur zu Demonstrierung des Ablaufs, wird NACH dem letzten Kommentar ausgeführt, obwohl es nur 1 ms wartet.
setTimeout(() => console.log("TIMEOUT END!!!"), 1);

console.log("===== 4) AFTER TIMEOUT =====");
