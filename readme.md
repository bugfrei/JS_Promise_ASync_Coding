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

--> Bringt Performaceverbesserung

## Mögliche Fehlerquellen in vorhandenem Code

Evtl. erfordert eine Funktion die Rückgabe eines Promise um danach korrekt abgefertigt zu werden (await zuviel).
Oder es wird ein Promise zurückgegeben und es müsste ein einfacher Wert sein (await fehlte).
