Ansehen dieser Datei in VS Code mit: Strg+Shift+V

# Asynchrone Programmierung Beispiele

Zum ausführen einfach

```
node s1*
```

ausführen (entsprechend bei Beispiel s3... `s3*`)

Die Angabe des restlichen Dateinamens ist nicht notwendig, da `s#` eindeutig die Datei identifiziert.

# Erkenntnisse

## Verwendung in bereits geschriebenen oder zukünftigen Code

`await` nur wenn man mit dem Ergebnis arbeiten muss. Andernfalls kein oder eine spätes await.

Vorhandener Code kann dementsprechend angepasst werden.

-> Bringt Performaceverbesserung

## Mögliche Fehlerquellen in vorhandenem Code

Evtl. erfordert eine Funktion die Rückgabe eines Promise um danach korrekt abgefertigt zu werden (await zuviel).
Oder es wird ein Promise zurückgegeben und es müsste ein einfacher Wert sein (await fehlte).

# Anwendungen

Für die Verwendung von Asynchronen Funktionen (oder Funktionen, die einfach ein Promise zurück geben; was technisch das gleiche ist)
sollten bestimmte Reihenfolgen bzw. Richtlinien beachtet bzw. so gut wie möglich berücksichtigt werden:

## 1. Alle Aufrufe, deren Ergebnisse NICHT verwendet werden

Hierzu gehöhren hauptsächlich UPDATE und DELETE Request. Sollten denen komplexere Logiken vorausgehen, so können diese zusammen
mit den Requests in eine `async function` geschrieben und dann ohne `await` aufgerufen werden.

Letzteres natürlich nur, wenn die Logiken keine Ergebnisse bringen, die noch weiter benötigt werden.

## 2. Alle Aufrufe, deren Ergebnisse ZEITNAH benötigt werden

> Hier gilt: Prüfen, ob diese Aufrufe nicht in Aufrufe von Punkt 1 umgewandelt werden können. Wenn der **2. Aufruf** vom **Aufruf 1.** vorausgesetzt wird.

Dies trifft hauptsächlich bei INSERT Requests zu. Aber auch Queries aus REST-Services (GET).

Bei INSERT Requests könnte es vorkommen, dass das Ergebnis (z.B.: eine ID, oder STATUS) für ein UPDATE benötigt wird.
In diesem Fall besteht die Möglichkeit den UPDATE und den INSERT Request zu vereinen:

Anstatt:
```JS
let { ID } = await srv.run(SELECT('ID').from(Entity).where( { Name : name });
await srv.run(UPDATE(Entity).set({ Status: statusNew }).where( { ID: ID }));
```

Einfach ein Query ohne `await`:
```JS
srv.run(UPDATE(Entity).set({ Status: statzusNew }).where( { ID: SELECT('ID').from(Entity).where( { Name: name })}));
```

Aus zwei Queries (mit min. 1 `await`) wird ein Query ohne `await`.

Dies funktioniert dann sehr gut, wenn die `ID` gar nicht mehr benötigt wird.

## 3. Alle Aufrufe, deren Ergebnisse VIELLEICHT SPÄTER benötigt werden

Es kann durchaus vorkommen, das ein Ergebnis gar nicht gebraucht wird. Wenn z.B. die Anzahl der Devices in einer Box nicht stimmt.

Wir brauchen die zu setzenden Status vielleicht nicht für ein UPDATE oder INSERT (z.B. in den Rentlogger).

Der Request kann aber schon asynchron gestartet werden und wird bei Bedarf erst später synchronisiert (`await`).

```JS
let requestStatusFromDevice = srv.run(SELECT ....);
...
if (deviceCount == 5)
{
    let { Status } = await requestStatusFromDevice;
    ...
}
else
{
    ... In der UI eine Fehlermeldung ausgeben, mehr wird nicht gemacht
}
```

## 4. Alle Aufrufe, deren Ergebnisse erst später benötigt werden

Diese Aufrufe (z.B. INSERT -> wir brachen die neue ID; SELECT -> wird brauchen irgendwas) erstmal ohne `await`

```JS
let requestStatusFromDevice = srv.run(SELECT('Status').from(Devices).where( { ID: id }));
```

und wenn dann später das Ergebnis benötigt wird (in dem Beispiel der `Status`), dann mittels `await` auslesen:

```JS
let { Status: statusFromDevice } = await requestStatusFromDevice;
```

## Grund für die Reihenfolge

Diese Reihenfolge liefert eine sehr gute Auslastung der Hardware und damit eine sehr gute Performanze.

Vor allem bei **2.** ist es wichtig, keine 10 Requests nacheinander zu schreiben, wo jeder nächste den vorherigen benötigt.

Besser EIN Request, der die vorherigen 9 beinhaltet.

Das wäre ein extrem Beispiel, aber 2-3 Requests kombinieren kommt immer mal vor. Hier kann dem Sinn von CDS/Fiori am besten entsprochen werden:
- Mehr Arbeit für die Datenbank
- Und auch Arbeit auf die Clients auslagern
- weniger Arbeit für die Server
