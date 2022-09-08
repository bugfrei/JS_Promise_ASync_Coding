// Nun mit zeitlicher Verzögerung beim laden der Daten
// Eine Methode die Daten lädt und zufällig resolve oder reject aufruft.

// Die gleiche Funktion wie bei der Behandlung des Promise mit .then/.catch
function loadData()
{
    return new Promise((resolve, reject) =>
    {
        setTimeout(() =>
        {
            const success = Math.random() > 0.5 ? true : false;
            if (success)
            {
                let products = [];
                products.push({ name: "Eier", stock: 5 });
                products.push({ name: "Milch", stock: 1 });
                resolve(products);
            }
            else
            {
                reject("Error");
            }
        }, 1000);
    });
}

async function findProduct(product)
{
    try
    {
        let products = await loadData();
        let prod = products.find((p) => p.name === product);
        return prod;
    }
    catch (err)
    {
        console.log("Failed: " + err);
    }
    return null;
}

async function doWork()
{
    const prod = await findProduct("Milch");
    console.log("Result:");
    console.log(prod);
}

doWork();

