/* eslint-disable no-undef */
import App from '../src/app';

test('empty input', () => {
    const input = {};
    expect(App.output(input)).toBe('');
});

test('single comma input', () => {
    const comma = [
        'Mckayla, Atlanta, 5/29/1986',
    ];
    const input = { comma };
    expect(App.output(input)).toBe('Mckayla Atlanta 5/29/1986');
});

test('2 comma input', () => {
    const comma = [
        'Mckayla, Atlanta, 5/29/1986',
        'Elliot, New York City, 4/3/1947',
    ];
    const input = { comma };
    expect(App.output(input)).toBe('Elliot New York City 4/3/1947\nMckayla Atlanta 5/29/1986');
});

test('single dollar input', () => {
    const dollar = [
        'LA $ 10-4-1974 $ Nolan $ Rhiannon',
    ];
    const input = { dollar };
    expect(App.output(input)).toBe('Rhiannon LA 10/4/1974');
});

test('2 dollar input', () => {
    const dollar = [
        'LA $ 10-4-1974 $ Nolan $ Rhiannon',
        'NYC $ 12-1-1962 $ Bruen $ Rigoberto',
    ];
    const input = { dollar };
    expect(App.output(input)).toBe('Rigoberto NYC 12/1/1962\nRhiannon LA 10/4/1974');
});

test('comma + dollar input', () => {
    const comma = [
        'Mckayla, Atlanta, 5/29/1986',
        'Elliot, New York City, 4/3/1947',
    ];

    const dollar = [
        'LA $ 10-4-1974 $ Nolan $ Rhiannon',
        'NYC $ 12-1-1962 $ Bruen $ Rigoberto',
    ];

    const input = { comma, dollar };    
    expect(App.output(input)).toBe('Elliot New York City 4/3/1947\nRigoberto NYC 12/1/1962\nRhiannon LA 10/4/1974\nMckayla Atlanta 5/29/1986');
});

test('single pipe input', () => {
    const pipe = [
        '10.24.1990 | Joseph | New York City',
    ];
    const input = { pipe };
    expect(App.output(input)).toBe('Joseph New York City 10/24/1990');
});


test('comma + dollar + pipe input', () => {
    const comma = [
        'Mckayla, Atlanta, 5/29/1986',
        'Elliot, New York City, 4/3/1947',
    ];

    const dollar = [
        'Los Angeles $ 10-4-1974 $ Nolan $ Rhiannon',
        'New York City $ 12-1-1962 $ Bruen $ Rigoberto',
    ];

    const pipe = [
        '10.24.1990 | Joseph | New York City',
        '1.15.1995 | Jane | Denver',
    ];

    const input = { comma, dollar, pipe };
    expect(App.output(input)).toBe('Elliot New York City 4/3/1947\nRigoberto New York City 12/1/1962\nRhiannon Los Angeles 10/4/1974\nMckayla Atlanta 5/29/1986\nJoseph New York City 10/24/1990\nJane Denver 1/15/1995');
});
