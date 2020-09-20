const helpers = {
    getSetOf7Tests() {
        return [
            {
                name: 'Antinuclear Antibody',
                abbrv: 'ANA',
                unit: 'mmol/l',
                goodRangeMin: null,
                goodRangeMax: 320,
            },
            {
                name: 'Glucose Level',
                abbrv: null,
                unit: 'mmol/l',
                goodRangeMin: 70,
                goodRangeMax: 99,
            },
            {
                name: 'Sodium',
                abbrv: 'Na',
                unit: 'mmol/l',
                goodRangeMin: 135,
                goodRangeMax: 145,
            },
            {
                name: 'Ionized Calcium',
                abbrv: 'Ca',
                unit: 'mmol/l',
                goodRangeMin: 1.03,
                goodRangeMax: 2.23,
            },
            {
                name: 'Oxygen Saturation Arterial',
                abbrv: null,
                unit: '%',
                goodRangeMin: 94,
                goodRangeMax: null,
            },
            {
                name: 'Oxygen Saturation Venous',
                abbrv: null,
                unit: '%',
                goodRangeMin: 75,
                goodRangeMax: 75,
            },
            {
                name: 'CK-MB',
                abbrv: null,
                unit: 'ng/mL',
                goodRangeMin: -999,
                goodRangeMax: 5,
            }
        ];
    },

    getSetOf3Tests() {
        return [
            {
                name: 'Oxygen Saturation Arterial',
                abbrv: null,
                unit: '%',
                goodRangeMin: 94,
                goodRangeMax: 100,
            },
            {
                name: 'Oxygen Saturation Venous',
                abbrv: null,
                unit: '%',
                goodRangeMin: 75,
                goodRangeMax: 75,
            },
            {
                name: 'Sodium',
                abbrv: 'Na',
                unit: 'mmol/l',
                goodRangeMin: 135,
                goodRangeMax: 145,
            }
        ];

    },

    getOneTest() {
        return {
            name: 'Blood',
            abbrv: 'B',
            unit: 'glug',
            goodRangeMin: 5,
            goodRangeMax: 7,
        };
    }
};

module.exports = helpers;
