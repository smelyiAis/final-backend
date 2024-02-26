const DRIVERS_URL = "http://ergast.com/api/f1/2023/drivers";
const TEAMS_URL = "http://ergast.com/api/f1/2023/constructors";
const xml2js = require("xml2js");
const parser = new xml2js.Parser();

async function getAllDrivers() {
    const response = await fetch(DRIVERS_URL);
    const xmlData = await response.text();

    try {
        const result = await parser.parseStringPromise(xmlData);
        const driversArray = result.MRData.DriverTable[0].Driver;

        const drivers = driversArray.map((driver) => ({
            driverId: driver.$["driverId"],
            code: driver.$["code"],
            url: driver.$["url"],
            permanentNumber: driver.PermanentNumber,
            givenName: driver.GivenName,
            familyName: driver.FamilyName,
            dateOfBirth: driver.DateOfBirth,
            nationality: driver.Nationality,
        }));

        return drivers;
    } catch (err) {
        console.error(err);
        return [];
    }
}

async function getAllTeams() {
    const response = await fetch(TEAMS_URL);
    const xmlData = await response.text();

    try {
        const result = await parser.parseStringPromise(xmlData);
        const constructorsArray = result.MRData.ConstructorTable[0].Constructor;

        const constructors = Array.isArray(constructorsArray) ? constructorsArray : [constructorsArray];

        const teams = constructors.map((constructor) => ({
            constructorId: constructor.$.constructorId,
            url: constructor.$.url,
            name: constructor.Name,
            nationality: constructor.Nationality,
        }));

        return teams;
    } catch (err) {
        console.error(err);
        return [];
    }
}

module.exports = { getAllDrivers, getAllTeams };
