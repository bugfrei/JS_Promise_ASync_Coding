const btnEndlos = document.getElementById("btn1");
const btnWait = document.getElementById("btn2");
const btnWait2 = document.getElementById("btn3");
const btnMehrmals = document.getElementById("btn4");
const btnRequest = document.getElementById("btn5");
const btnRequest2 = document.getElementById("btn6");
const output = document.getElementById("out1");


function setOutput(text)
{
    output.textContent = text;
}
// ---------------------------------------------------------------------------------------------------- 
btnEndlos.onclick = function () { doEndlos(); }
function doEndlos()
{
    while (true)
    {
        setOutput(new Date().toLocaleTimeString());
    }
}
// ---------------------------------------------------------------------------------------------------- 
btnWait.onclick = function () { doWait(); }
// Async Funktion da ein await verwendet wird (dann muss sie async sein)
async function doWait()
{
    while (true)
    {
        setOutput(new Date().toLocaleTimeString());
        // - ein Promise erstellen...
        // - mit nur einem Parameter: eine Arrow-Function mit einem Parameter, der "resolve"-Funktion
        // - In dieser Arrow-Function ein Timeout setzen der nach 1 ms die resolve Funktion aufruft
        // - mit await warten wir, bis der Promise fertig ist
        // -> Es wird also einfach nur 1ms gewartet
        await new Promise(resolve => setTimeout(resolve, 1));
    }
}

// Nebenbei: Das wäre eine Sleep-Funktion die eine angegebene Zeit in Sekunden wartet.
// Aufruf mit: await sleep(3);
async function sleep(sec)
{
    await new Promise(resolve => setTimeout(resolve, sec * 1000));
}
// ---------------------------------------------------------------------------------------------------- 
btnWait2.onclick = function () { doWait2(); }
async function getTimeString()
{
    await new Promise(resolve => setTimeout(resolve, 1000));
    return new Date().toLocaleTimeString();
}

async function doWait2()
{
    while (true)
    {
        // die Verwendung und das warten auf getTimeString() wartet eine Sekunde und stellt sicher, das der Browser reagiert
        setOutput(await getTimeString());
    }
}
// ---------------------------------------------------------------------------------------------------- 
btnMehrmals.onclick = function () { mehrmals(); }
var i = 0;
async function mehrmals()
{
    i++;
    let j = i;
    while (true)
    {
        setOutput(j + " " + await getTimeString());
    }
}

// ---------------------------------------------------------------------------------------------------- 
btnRequest.onclick = function () { request(); }
async function request()
{
    var start = new Date();
    for (var i = 1; i <= 20; i++)
    {
        try
        {
            const url = "https://api.nationalize.io/?name=alex" + i.toString();
            const response = await fetch(url);
            const text = await response.text();
            const j = JSON.parse(text);
            output.innerHTML += i.toString() + ": " + j.name + "<br />";
        }
        catch (e)
        {
            output.innerHTML += e + "<br />";
        }
    }
    var time = new Date() - start;
    output.innerHTML += "<h2>Fertig " + time.toString() + " ms</h2>";
}

// ---------------------------------------------------------------------------------------------------- 
btnRequest2.onclick = function () { request2(); }
async function request2()
{
    let reqList = [];
    var start = new Date();
    for (var i = 1; i <= 20; i++)
    {
        reqList.push(test(i.toString(), i));
    }
    await Promise.allSettled(reqList);
    var time = new Date() - start;
    output.innerHTML += "<h2>Fertig " + time.toString() + " ms</h2>";
}
async function test(text, i)
{
    return makeRequest("https://api.nationalize.io/?name=alex" + text, i);
}

async function makeRequest(url, i)
{
    // const url = "https://randomuser.me/api/";
    const response = await fetch(url);
    const text = await response.text();
    const j = JSON.parse(text);
    output.innerHTML += i.toString() + ": " + j.name + "<br />";
    return request;
}
