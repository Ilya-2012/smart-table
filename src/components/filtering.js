import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);
export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes)                                    // Получаем ключи из объекта
      .forEach((elementName) => {                        // Перебираем по именам
        elements[elementName].append(                    // в каждый элемент добавляем опции
            ...Object.values(indexes[elementName])        // формируем массив имён, значений опций
                      .map(name => {                        // используйте name как значение и текстовое содержимое
                           const option = document.createElement('option')
                           option.innerText = name;
                           option.value = name;
                           return option;
        })
        )
     })

    return (data, state, action) => {
        if (!data) return [];

        // 1. Обработка кнопки очистки (clear)
        if (action && action.name == 'clear' && action.element) {
            const parent = action.element.parentElement;
            if (parent) {
                const input = parent.querySelector('input');
                if (input) {
                    input.value = '';
                }
            }
            const fieldName = action.element.dataset.field;
            if (fieldName && fieldName in state) {
                state[fieldName] = ''; // очищаем данные в памяти приложения
            }
        }

        // 2. МАГИЯ ДЛЯ ИНПУТОВ ДИАПАЗОНА:
        // Создаем копию стейта, чтобы не портить оригинальный глобальный state
        const localState = { ...state };

        // Если заполнен хотя бы один из инпутов диапазона
        if ('totalFrom' in localState || 'totalTo' in localState) {
            // Переводим значения в числа (или оставляем пустыми, если там ничего нет)
            const fromValue = localState.totalFrom === '' ? null : Number(localState.totalFrom);
            const toValue = localState.totalTo === '' ? null : Number(localState.totalTo);

            // Записываем их под ключом 'total' в виде массива [от, до] для правила arrayAsRange!
            localState.total = [fromValue, toValue];

            // Удаляем старые раздельные ключи, чтобы компаратор не искал их в объекте строки
            delete localState.totalFrom;
            delete localState.totalTo;
        }
        console.log(state)
        // 3. Отфильтровать данные используя компаратор с обновленным localState
        return data.filter(row => compare(row, localState));
    }
}