// Nun mit zeitlicher Verzögerung beim laden der Daten
// Eine Methode die Daten lädt
function loadData()
{
    let products = [];
    setTimeout(() =>
    {
        products.push({ name: "Eier", stock: 5 });
        products.push({ name: "Milch", stock: 1 });
    }, 1000);

    return products;
}

// Eine Methode die Daten sucht
function findProduct(product)
{
    let products = loadData();
    return products.find((p) => p.name === product);
}

// Ausgegeben des gesuchten Produktes
console.log(findProduct("Eier"));

// Ausgegeben wird `undefined`, und eine Sekunde später wird das Programm beendet
// Zum Zeitpunkt als wir die Daten brauchen, waren sie noch nicht geladen!
