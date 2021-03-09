const COMMA_ENTRIES = [ // First name, City, Birth date
    'Mckayla, Atlanta, 5/29/1986',
    'Elliot, New York City, 4/3/1947',
];
const DOLLAR_ENTRIES = [ // City, Birth date, Last name, First name
    'LA $ 10-4-1974 $ Nolan $ Rhiannon',
    'NYC $ 12-1-1962 $ Bruen $ Rigoberto',
];
const PIPE_ENTRIES = [ // Birth date, First name, City
    '10.24.1990 | Joseph | New York City',
    '1.15.1995 | Jane | Denver',
];

class App {
    static run({ comma = [], dollar = [], pipe = [] }) {
    // INVOKE YOUR MAGICAL CODE HERE
        const toOutput = this.output({ comma, dollar, pipe });
        console.log(toOutput);
    }

    static outputLine({ firstName, city, date }) {
        return `${firstName} ${city} ${date}`;
    }

    static parseDollar(dollarInput) {
        const split = dollarInput.split(' $ ');

        const firstName = split[3];
        const city = split[0];
        const date = split[1].replace(/-/g, '/');

        return { firstName, city, date };
    }

    static parseComma(commaInput) {
        const split = commaInput.split(', ');
        const [firstName, city, date] = split;

        return { firstName, city, date };
    }

    static parsePipe(pipeInput) {
        const split = pipeInput.split(' | ');
        const [date, firstName, city] = split;
        const formattedDate = date.replace(/\./g, '/');

        return { firstName, city, date: formattedDate };
    }

    static output({ comma = [], dollar = [], pipe = [] }) {
        const commaOutput = comma.map(this.parseComma);
        const dollarOutput = dollar.map(this.parseDollar);
        const pipeOutput = pipe.map(this.parsePipe);

        return commaOutput
            .concat(dollarOutput)
            .concat(pipeOutput)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(this.outputLine)
            .join('\n');
    }
}

App.run({ comma: COMMA_ENTRIES, dollar: DOLLAR_ENTRIES });

// Expected standard output:
//   Mckayla Atlanta 5/29/1986
//   Rhiannon Los Angeles 10/4/1974
//   Elliot New York City 4/3/1947
//   Rigoberto New York City 12/1/1962

// WRITE YOUR SPECS HERE
export default App;
