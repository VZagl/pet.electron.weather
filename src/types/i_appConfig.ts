import { i_appConfig_main } from './i_appConfig_main';
import { i_appConfig_renderer } from './i_appConfig_renderer';

// Интерфейс для описания структуры конфигурации
export interface i_appConfig {
	version: string;
	core?: i_appConfig_main;
	renderer?: i_appConfig_renderer;
	// [key: string]: any; // Замените на конкретные ключи и типы, если структура известна
}
