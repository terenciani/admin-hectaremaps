export default {
    normal: {
        decimal: ',',
        thousands: '.',
        precision: 4,
        masked: false,
        allowBlank: false,
        min: 0
    },
    real: {
        decimal: ',',
        thousands: '.',
        prefix: 'R$ ',
        precision: 4,
        masked: false,
        allowBlank: false,
        min: Number.MIN_SAFE_INTEGER,
        max: Number.MAX_SAFE_INTEGER
    },
    percent: {
        decimal: ',',
        thousands: '.',
        suffix: ' %',
        precision: 4,
        masked: false,
        allowBlank: false,
        min: 0,
        max: 100
    }
};
