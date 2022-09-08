// Nun mit zeitlicher Verzögerung beim laden der Daten
// Eine Methode die Daten lädt und ein Promise zurückgibt
async function loadData()
{
    return new Promise((resolve, reject) =>
    {
        setTimeout(() =>
        {
            let products = [];
            products.push({ name: "Eier", stock: 5 });
            products.push({ name: "Milch", stock: 1 });
            resolve(products);
        }, 1000);
    });
}

async function laden()
{
    const products = await loadData();
    console.log(products);
}

laden();
