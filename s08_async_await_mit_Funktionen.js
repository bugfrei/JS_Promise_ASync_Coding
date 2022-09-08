// Eine Async-Funktion die zwei Zahlen addiert
// Das Promise dient nur dazu, eine zeitliche Verzögerung von einer Sekunde zu erreichen und könnte auch weggelassen werden
async function add(a, b)
{
    await new Promise(resolve => setTimeout(resolve, 1000));
    return a + b;
}

// Erstes Beispiel für die Verwendung: direkt mittels await das Ergebnis (return-Wert) der add-Funktion erhalten
async function doIt1()
{
    console.log("Output from doIt1 (await):");
    var z = await add(20, 5);
    console.log(z);
}

// Zweites Beispiel ohne await: z ist nicht die Zahl sondern eigentlich nur ein Promise (object) und kann auch wie ein solches
// behandelt werden (mit .then, ...)
async function doIt2()
{
    console.log("Output from doIt2 (then)");
    var z = add(10, 5);
    console.log(typeof (z));
    z.then((data) => console.log(data));
}

// Hier sieht man gut, das beide Funktionen direkt nacheinander aufgerufen werden, daher zuerst die beiden
// Output from... Zeilen ausgegeben werden. Erst die Verwendung der async-Funktion add macht den Unterschied
// in der weiteren Ausführung.
doIt1();
doIt2();
