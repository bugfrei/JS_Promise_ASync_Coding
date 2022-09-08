/////////////////////////////////////////////////////////////////////
//Box Not Available Handler
/////////////////////////////////////////////////////////////////////    
srv.on("boxOut", Box, async req =>
{
    let { ID: idBox } = req.params[0]
    const { patientID } = req.data;
    if (patientID == '')
    {
        return req.warn('Patient auswählen')
    }
    else
    {

        //const db = srv.transaction(req);

        let { Box, User, Devices, RentLoggers, RentLoggers_Devices, DeviceTypes } = srv.entities; // alle Box,User,Devices auslesen und in Objekte packen

        //!!let resultDevices = await db.read("*").from(Devices).where({ toBox_ID: idBox });
        let resultDevices = SELECT('toDeviceType_ID').from(Devices).where({ toBox_ID: idBox });
        let deviceTypes = SELECT('deviceTypeNumber').from(DeviceTypes).where`ID in ${resultDevices}`
        let resultDeviceTypesInBox = await cds.run(deviceTypes)
        resultDevices = SELECT('*').from(Devices).where({ toBox_ID: idBox });
        resultDevices = await cds.run(resultDevices);

        /* Testdaten für
              - Vollständigkeitsprüfung
              - Prüfung auf mehrfaches Vorkommen
        */
        // switch ("Unvollständig und doppelt 1-6")
        //switch ( "Unvollständig 1-6")
        //switch ( "Vollständig 1-6")
        switch ("KeinTest")
        {
            case "Doppelt 1-6":
                resultDeviceTypesInBox =
                    [
                        { deviceTypeNumber: 1005 },
                        { deviceTypeNumber: 2006 },
                        { deviceTypeNumber: 3002 },
                        { deviceTypeNumber: 3008 },  // DOPPELT!
                        { deviceTypeNumber: 4003 },
                        { deviceTypeNumber: 5022 },
                        { deviceTypeNumber: 6074 }
                    ]
                break;
            case "Unvollständig 1-6":
                resultDeviceTypesInBox =
                    [
                        { deviceTypeNumber: 1005 },
                        { deviceTypeNumber: 4003 },
                        { deviceTypeNumber: 2006 },  // Die 3 fehlt
                        { deviceTypeNumber: 6074 },
                        { deviceTypeNumber: 5022 }
                    ]
                break;
            case "Unvollständig und doppelt 1-6":
                resultDeviceTypesInBox =
                    [
                        { deviceTypeNumber: 1005 },
                        { deviceTypeNumber: 4003 },
                        { deviceTypeNumber: 4007 },  // DOPPELT!
                        { deviceTypeNumber: 2006 },  // Die 3 fehlt
                        { deviceTypeNumber: 6074 },
                        { deviceTypeNumber: 5022 }
                    ]
                break;
            case "Vollständig 1-6":
                resultDeviceTypesInBox =
                    [
                        { deviceTypeNumber: 1005 },
                        { deviceTypeNumber: 2006 },
                        { deviceTypeNumber: 3008 },
                        { deviceTypeNumber: 4003 },
                        { deviceTypeNumber: 5022 },
                        { deviceTypeNumber: 6074 }
                    ]
                break;
        }

        //TODO Die DevicePrüfung überspringen wenn Boxstatus B . eventuell Code runterziehen
        let erg;
        let deviceTypesInBox = [];
        const deviceTypeNumberFactor = 1000;
        const possibleDeviceTypeNumbersList =
            [
                [1, 2, 3, 4, 5, 6]
            ]
        /* Mehrere Kombinationen können wiefolgt angegeben werden:
        const possibleDeviceTypeNumbersList =
          [
            [1, 2, 3],
            [4, 5, 6],
            [2, 4, 6],
            [5, 6, 7],
            [1, 5, 3]
          ]
        */

        const deviceTypeNumbersReduced = resultDeviceTypesInBox.map(d => (d.deviceTypeNumber - (d.deviceTypeNumber % deviceTypeNumberFactor)) / deviceTypeNumberFactor);

        let boxComplete = possibleDeviceTypeNumbersList.some(vv => vv.every(v => deviceTypeNumbersReduced.includes(v)));
        let uniqueNumbers = deviceTypeNumbersReduced.every(d => deviceTypeNumbersReduced.filter(dd => dd == d).length == 1);
        let allConditionsOk = boxComplete && uniqueNumbers;

        // TODO: Jeder Typ (Number) darf nur einmal vorhanden sein!
        console.log(allConditionsOk);

        //Wenn die Werte DL,CB,HRM,A,B,C nicht in dem Array enthalten sind
        //UND devices ungleich 6 sind wird BoxStatus auf Blocked setzen
        // Klartext: Überprüft ob alle Geräte genau einmal enthalten sind
        if (!allConditionsOk)
        {
            //!!await db.update(Box).set({ boxStatus_code: "B" }).where({ ID: idBox });
            await UPDATE(Box).set({ boxStatus_code: "B" }).where({ ID: idBox })
            return req.warn('Box wurde blockiert')
        }
        else
        {
            //
            //devicestatus und boxstatus auf "lendable" prüfen und den Status auf außer Haus "NA" setzten falls möglich
            //ansonsten reject
            //
            //!! let resultBox = await db.read("*").from(Box).where({ ID: idBox }); //einzelnes Boxobject in resultBox übergeben
            let resultBox = await SELECT("*").from(Box).where({ ID: idBox }); //einzelnes Boxobject in resultBox übergeben

            //
            if (resultBox[0].boxStatus_code != "L")
            {
                console.log("Ausleihen ist nicht möglich da Boxstatus nicht Zulässig");
                return;
            } else
            {
                //Ausgabe- und Rückgabedatum anpassen
                //JW let date = new Date().toISOString().match(/^(\d{2,4}-\d{2}-\d{2})/)[0];
                let date = (new Date).toISOString().slice(0, 10); // today
                await UPDATE(Box).set({ beginDateRental: date }).where({ ID: idBox });
                await UPDATE(Box).set({ endDateRental: null }).where({ ID: idBox });

                //!! let resultUser = await db.read("*").from(User).where({ ID: patientID }); // TODO Einzelnen User auslesen und break falls nicht vorhanden
                let resultUser = await SELECT("*").from(User).where({ ID: patientID }); // TODO Einzelnen User auslesen und break falls nicht vorhanden

                //!! await db.update(Box).set({ toPatient: resultUser }).where({ ID: idBox }); // TODO Prüfen ob User vorhanden ansonsten Break
                await UPDATE(Box).set({ toPatient: resultUser }).where({ ID: idBox }); // TODO Prüfen ob User vorhanden ansonsten Break

                //!! await db.update(Box).set({ boxStatus_code: "NA" }).where({ ID: idBox }); // Boxstatus setzten =>({toPatient : resultUser,boxstatus:"NA"})
                await UPDATE(Box).set({ boxStatus_code: "NA" }).where({ ID: idBox }); // Boxstatus setzten =>({toPatient : resultUser,boxstatus:"NA"})

                //!! await db.update(Devices).set({ deviceStatus_code: "NA" }).where({ toBox_ID: idBox }); // DeviceStatus setzen || "where User.userRole.code ='PA'";
                await UPDATE(Devices).set({ deviceStatus_code: "NA" }).where({ toBox_ID: idBox }); // DeviceStatus setzen || "where User.userRole.code ='PA'";
                let { ID: newLogID } = await srv.run(INSERT.into(RentLoggers).entries({ toBox_ID: idBox, toPatient: resultUser, beginDateRental: date })); //TODO Deep Insert einbauen

                let rentLoggers_Devices = resultDevices.map(r => [newLogID, r.ID, r.operatingHours])
                await srv.run(INSERT.into(RentLoggers_Devices).columns(
                    'rentLogger_ID', 'device_ID', 'deviceCurrentOperatingHours'
                ).rows(
                    rentLoggers_Devices
                    // [ newLogID, resultDevices[0].ID, resultDevices[0].operatingHours],
                    // [ newLogID, resultDevices[1].ID, resultDevices[1].operatingHours],
                    // [ newLogID, resultDevices[2].ID, resultDevices[2].operatingHours],
                    // [ newLogID, resultDevices[3].ID, resultDevices[3].operatingHours],
                    // [ newLogID, resultDevices[4].ID, resultDevices[4].operatingHours],
                    // [ newLogID, resultDevices[5].ID, resultDevices[5].operatingHours]
                ))
                //!! await db.update(Box).set({ actuallLogID: newLogID }).where({ ID: idBox });
                await UPDATE(Box).set({ actuallLogID: newLogID }).where({ ID: idBox });
            }
        }
        //!! return await SELECT(Box).where({ ID: idBox })
        let box = await SELECT(Box).where({ ID: idBox })
        req.reply(box)
    }
});