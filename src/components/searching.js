import {rules, createComparison} from "../lib/compare.js";


export function initSearching(searchField) {
    // ВЫВЕДЕМ В КОНСОЛЬ И ПОСМОТРИМ, ЧТО ТАМ ВООБЩЕ ЕСТЬ
    // Твой текущий вызов
    const compare = createComparison(
        // Первый аргумент: массив СТРОК с именами стандартных правил
        ['skipEmptyTargetValues'], 
        
        // Второй аргумент: массив кастомных правил, которые мы вызываем сами
        [rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)]
    );

    return (data, state, action) => {
        if (!data) {
            return []; 
        }
        return data.filter(row => compare(row, state));
    }
}