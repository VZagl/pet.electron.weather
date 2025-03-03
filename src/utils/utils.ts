/*
export function deepFreeze(object: any) {
	Object.keys(object).forEach((name) => {
		let prop = object[name];
		if (typeof prop == 'object' && prop !== null) {
			deepFreeze(prop);
		}
	});
	return Object.freeze(object);
}
*/

/**
 * Рекурсивно замораживает объект, делая его неизменяемым.
 *
 * Эта функция применяет `Object.freeze` к переданному объекту и ко всем его свойствам
 * (включая вложенные объекты и функции), гарантируя, что вся структура будет глубоко неизменяемой.
 *
 * @template T - Тип объекта, который нужно заморозить.
 * @param {T} obj - Объект, который нужно глубоко заморозить.
 * @returns {T} - Глубоко замороженный объект.
 *
 * @example
 * const obj = { a: 1, b: { c: 2 } };
 * const frozenObj = deepFreeze(obj);
 *
 * frozenObj.a = 2; // Ошибка: Невозможно изменить замороженный объект
 * frozenObj.b.c = 3; // Ошибка: Невозможно изменить замороженный объект
 */
export function deepFreeze<T extends object>(obj: T): T {
	Object.freeze(obj);

	Object.getOwnPropertyNames(obj).forEach((prop) => {
		if (
			Object.hasOwn(obj, prop) &&
			obj[prop] !== null &&
			(typeof obj[prop] === 'object' || typeof obj[prop] === 'function') &&
			!Object.isFrozen(obj[prop])
		) {
			deepFreeze(obj[prop]);
		}
	});

	return obj;
}
