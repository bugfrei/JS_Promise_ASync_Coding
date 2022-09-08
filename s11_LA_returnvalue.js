let factor = 1;
// In diesem Beispiel wird ein Job gestartet, aber OHNE direktes await
// dies könnte abfragen von Daten in die Datenbank sein o.ä.
// z.B. SELECT ID FROM xyz WHERE abc = def
async function srv_run_SELECT()
{
    // Job benötigt 5 Sekunden
    console.log("=========== JOB started");
    let runtime = 5;
    for (var sec = 1; sec <= runtime; sec++)
    {
        await new Promise(resolve => setTimeout(resolve, 1000 * factor));
        console.log("=========== JOB running " + sec + " / " + runtime + "s");
    }
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c)
    {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    return uuid;
}

async function start()
{
    const start = new Date();
    if (factor != 1)
    {
        console.log("Eine Sekunde sind " + factor + " Sekunden...");
    }
    // Vorbereitungen, z.B. Entities extrahieren ...

    // Job ausführen, z.B. let INSERT_JOB = srv.run(INSERT ...);
    console.log("SELECT_JOB wird gestartet:")
    let SELECT_JOB = srv_run_SELECT();
    console.log("Direkt nach dem Starten des Jobs.");

    // Nach dem UPDATE wird noch mehr gemacht, braucht simuliert 2 Sekunden
    console.log("Noch mehr tun, braucht 3 Sekunden...");
    await new Promise(resolve => setTimeout(resolve, 3000 * factor));

    // Nun müssen wir noch warten bis das Update fertig ist
    console.log("fertig, nun warten bis Job (SELECT) fertig ist");
    let ID = await SELECT_JOB;
    console.log("Alles fertig. ID = " + ID);
    const ms = new Date() - start;
    console.log("Laufzeit total: " + ms + " ms");
}

start();
