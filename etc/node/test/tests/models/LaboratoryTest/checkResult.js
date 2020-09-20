import { expect } from "chai";
import LaboratoryTest from '../../../../models/LaboratoryTest';

describe('LaboratoryTest Model', function() {

    describe('checkResult', function() {
        describe('goodRangeMin = null, goodRangeMax = null', function() {
            const laboratoryTest = new LaboratoryTest();

            const values = [
                -99999999.9091281,
                -5264,
                '-10.000000000000000000000001',
                '-10.000000000000000000000000',
                -10,
                '-9.9999999999999999999999999',
                '-0.00000000000000000000000001',
                0,
                '0.00000000000000000000000001',
                1,
                '9.9999999999999999999999999',
                '10.000000000000000000000000',
                '10.000000000000000000000001',
                10,
                527,
                85685,
                87909512512512547568.124
            ];

            values.forEach((value) => {
                it(`${value} returns LaboratoryTest.CHECK_RESULT_INSIDE`, function() {
                    expect(laboratoryTest.checkResult(value)).is.equals(LaboratoryTest.CHECK_RESULT_INSIDE);
                })
            });
        });

        describe('goodRangeMin = null, goodRangeMax = 10', function() {
            const laboratoryTest = new LaboratoryTest();
            laboratoryTest.goodRangeMax = 10;

            const values = [
                [-99999999.9091281, 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                [-5264, 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['-10.000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['-10.000000000000000000000000', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                [-10, 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['-9.9999999999999999999999999', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['-0.00000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                [0, 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['0.00000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                [1, 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['9.9999999999999999999999999', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                [10, 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['10.000000000000000000000000', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['10.000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                [527, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                [85685, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                ['87909512512512547568.124', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
            ];

            values.forEach((value) => {
                const [input, resultDescription, result] = value;
                it(`${input} returns ${resultDescription}`, function() {
                    expect(laboratoryTest.checkResult(input)).is.equals(result);
                })
            });
        });

        describe('goodRangeMin = null, goodRangeMax = -10', function() {
            const laboratoryTest = new LaboratoryTest();
            laboratoryTest.goodRangeMax = -10;

            const values = [
                [-99999999.9091281, 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                [-5264, 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['-10.000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['-10.000000000000000000000000', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                [-10, 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['-9.9999999999999999999999999', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                ['-0.00000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                [0, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                ['0.00000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                [1, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                ['9.9999999999999999999999999', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                [10, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                ['10.000000000000000000000000', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                ['10.000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                [527, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                [85685, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                ['87909512512512547568.124', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
            ];

            values.forEach((value) => {
                const [input, resultDescription, result] = value;
                it(`${input} returns ${resultDescription}`, function() {
                    expect(laboratoryTest.checkResult(input)).is.equals(result);
                })
            });
        });

        describe('goodRangeMin = 10, goodRangeMax = null', function() {
            const laboratoryTest = new LaboratoryTest();
            laboratoryTest.goodRangeMin = 10;

            const values = [
                [-99999999.9091281, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                [-5264, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                ['-10.000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                ['-10.000000000000000000000000', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                [-10, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                ['-9.9999999999999999999999999', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                ['-0.00000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                [0, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                ['0.00000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                [1, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                ['9.9999999999999999999999999', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                [10, 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['10.000000000000000000000000', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['10.000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                [527, 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                [85685, 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['87909512512512547568.124', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
            ];

            values.forEach((value) => {
                const [input, resultDescription, result] = value;
                it(`${input} returns ${resultDescription}`, function() {
                    expect(laboratoryTest.checkResult(input)).is.equals(result);
                })
            });
        });

        describe('goodRangeMin = -10, goodRangeMax = null', function() {
            const laboratoryTest = new LaboratoryTest();
            laboratoryTest.goodRangeMin = -10;

            const values = [
                [-99999999.9091281, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                [-5264, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                ['-10.000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                ['-10.000000000000000000000000', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                [-10, 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['-9.9999999999999999999999999', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['-0.00000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                [0, 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['0.00000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                [1, 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['9.9999999999999999999999999', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                [10, 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['10.000000000000000000000000', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['10.000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                [527, 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                [85685, 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['87909512512512547568.124', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
            ];

            values.forEach((value) => {
                const [input, resultDescription, result] = value;
                it(`${input} returns ${resultDescription}`, function() {
                    expect(laboratoryTest.checkResult(input)).is.equals(result);
                })
            });
        });

        describe('goodRangeMin = -10, goodRangeMax = 10', function() {
            const laboratoryTest = new LaboratoryTest();
            laboratoryTest.goodRangeMin = -10;
            laboratoryTest.goodRangeMax = 10;

            const values = [
                [-99999999.9091281, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                [-5264, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                ['-10.000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                ['-10.000000000000000000000000', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                [-10, 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['-9.9999999999999999999999999', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['-0.00000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                [0, 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['0.00000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                [1, 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['9.9999999999999999999999999', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                [10, 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['10.000000000000000000000000', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['10.000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                [527, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                [85685, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                ['87909512512512547568.124', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
            ];

            values.forEach((value) => {
                const [input, resultDescription, result] = value;
                it(`${input} returns ${resultDescription}`, function() {
                    expect(laboratoryTest.checkResult(input)).is.equals(result);
                })
            });
        });

        describe('goodRangeMin = -10, goodRangeMax = -10', function() {
            const laboratoryTest = new LaboratoryTest();
            laboratoryTest.goodRangeMin = -10;
            laboratoryTest.goodRangeMax = -10;

            const values = [
                [-99999999.9091281, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                [-5264, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                ['-10.000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                ['-10.000000000000000000000000', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                [-10, 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['-9.9999999999999999999999999', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                ['-0.00000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                [0, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                ['0.00000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                [1, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                ['9.9999999999999999999999999', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                [10, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                ['10.000000000000000000000000', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                ['10.000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                [527, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                [85685, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                ['87909512512512547568.124', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
            ];

            values.forEach((value) => {
                const [input, resultDescription, result] = value;
                it(`${input} returns ${resultDescription}`, function() {
                    expect(laboratoryTest.checkResult(input)).is.equals(result);
                })
            });
        });

        describe('goodRangeMin = 10, goodRangeMax = 10', function() {
            const laboratoryTest = new LaboratoryTest();
            laboratoryTest.goodRangeMin = 10;
            laboratoryTest.goodRangeMax = 10;

            const values = [
                [-99999999.9091281, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                [-5264, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                ['-10.000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                ['-10.000000000000000000000000', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                [-10, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                ['-9.9999999999999999999999999', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                ['-0.00000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                [0, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                ['0.00000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                [1, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                ['9.9999999999999999999999999', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                [10, 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['10.000000000000000000000000', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['10.000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                [527, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                [85685, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                ['87909512512512547568.124', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
            ];

            values.forEach((value) => {
                const [input, resultDescription, result] = value;
                it(`${input} returns ${resultDescription}`, function() {
                    expect(laboratoryTest.checkResult(input)).is.equals(result);
                })
            });
        });

        describe('goodRangeMin = -10.000000000000000000000000, goodRangeMax = -9.99', function() {
            const laboratoryTest = new LaboratoryTest();
            laboratoryTest.goodRangeMin = '-10.000000000000000000000000';
            laboratoryTest.goodRangeMax = -9.99;

            const values = [
                [-99999999.9091281, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                [-5264, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                ['-10.000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                ['-10.000000000000000000000000', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                [-10, 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['-9.9999999999999999999999999', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['-0.00000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                [0, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                ['0.00000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                [1, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                ['9.9999999999999999999999999', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                [10, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                ['10.000000000000000000000000', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                ['10.000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                [527, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                [85685, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                ['87909512512512547568.124', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
            ];

            values.forEach((value) => {
                const [input, resultDescription, result] = value;
                it(`${input} returns ${resultDescription}`, function() {
                    expect(laboratoryTest.checkResult(input)).is.equals(result);
                })
            });
        });

        describe('goodRangeMin = 9.99, goodRangeMax = 10.000000000000000000000000', function() {
            const laboratoryTest = new LaboratoryTest();
            laboratoryTest.goodRangeMin = 9.99;
            laboratoryTest.goodRangeMax = '10.000000000000000000000000';

            const values = [
                [-99999999.9091281, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                [-5264, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                ['-10.000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                ['-10.000000000000000000000000', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                [-10, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                ['-9.9999999999999999999999999', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                ['-0.00000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                [0, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                ['0.00000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                [1, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                ['9.9999999999999999999999999', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                [10, 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['10.000000000000000000000000', 'LaboratoryTest.CHECK_RESULT_INSIDE', LaboratoryTest.CHECK_RESULT_INSIDE],
                ['10.000000000000000000000001', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                [527, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                [85685, 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                ['87909512512512547568.124', 'LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
            ];

            values.forEach((value) => {
                const [input, resultDescription, result] = value;
                it(`${input} returns ${resultDescription}`, function() {
                    expect(laboratoryTest.checkResult(input)).is.equals(result);
                })
            });
        });

    });

});