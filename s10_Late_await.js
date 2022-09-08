let factor = 1;
// In diesem Beispiel wird ein Job gestartet, aber OHNE direktes await
// dies könnte ein eintragen von Daten in die Datenbank sein o.ä.
async function srv_run_UPDATE()
{
    // Job benötigt 5 Sekunden
    console.log("=========== JOB started");
    let runtime = 5;
    for (var sec = 1; sec <= runtime; sec++)
    {
        await new Promise(resolve => setTimeout(resolve, 1000 * factor));
        console.log("=========== JOB running " + sec + " / " + runtime + "s");
    }
    return true;
}

async function start()
{
    const start = new Date();
    if (factor != 1)
    {
        console.log("Eine Sekunde sind " + factor + " Sekunden...");
    }
    // Vorbereitungen, z.B. Entities extrahieren ...

    // Job ausführen, z.B. let UPDATE_JOB = srv.run(UPDATE ...);
    console.log("UPDATE_JOB wird gestartet:")
    let UPDATE_JOB = srv_run_UPDATE();                              // HIER await hinzufügen *****************************
    console.log("Direkt nach dem Starten des Jobs.");

    // Nach dem UPDATE wird noch mehr gemacht, braucht simuliert 2 Sekunden
    console.log("Noch mehr tun, braucht 3 Sekunden...");
    await new Promise(resolve => setTimeout(resolve, 3000 * factor));

    // Nun müssen wir noch warten bis das Update fertig ist
    console.log("fertig, nun warten bis Job (UPDATE) fertig ist");
    await UPDATE_JOB;
    console.log("Alles fertig.");
    const ms = new Date() - start;
    console.log("Laufzeit total: " + ms + " ms");
}

start();
