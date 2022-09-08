const fs = require('fs');

// In diesem Beispiel verzichten wir auf das await am Ende komplett
// Wir werfen z.B. ein Update an und das wird dann schon irgendwann fertig sein.
async function src_run_UPDATE()
{
    // Job benötigt 3 Sekunden
    console.log("=========== JOB started");
    let runtime = 3;
    for (var sec = 1; sec <= runtime; sec++)
    {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("=========== JOB running " + sec + " / " + runtime + "s");
    }
    console.log("========== JOB IST ERLEDIGT!");
    let dateString = new Date().toString();
    fs.writeFileSync("UPDATE_RESULT.txt", dateString);
}

async function start()
{
    const start = new Date();
    // Vorbereitungen, z.B. Entities extrahieren ...

    // Job ausführen, z.B. let UPDATE_JOB = srv.run(UPDATE ...);
    console.log("UPDATE_JOB wird gestartet:")
    let UPDATE_JOB = src_run_UPDATE();                              // HIER await hinzufügen *****************************
    console.log("Direkt nach dem Starten des Jobs.");

    // der rest des Events braucht nur 500 ms
    await new Promise(resolve => setTimeout(resolve, 500));

    // Wir warten NICHT bis es fertig ist.

    console.log("Alles fertig.");
    const ms = new Date() - start;
    console.log("Laufzeit total: " + ms + " ms");
    console.log("Ergebnis steht in UPDATE_RESULT.txt");
}

start();
