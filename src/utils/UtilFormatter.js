'use strict';

export default class UtilFormatter {
    // padrão dd/mm/yyyy
    static formatDateBR(date) {
        if (!date) return null;

        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    }
    //de isoDate para data dd/mm/yyyy
    static formatDateISOToBR(date) {
        console.log(date);
        if (!date) return null;

        const [year, month, day] = date.substring(0, 10).split('-');
        return `${day}/${month}/${year}`;
    }
    // padrão yyyy-mm-dd
    static formatDateUS(date) {
        if (!date) return null;

        const [year, month, day] = date.split('-');
        return `${year}-${month}-${day}`;
    }
} // class
