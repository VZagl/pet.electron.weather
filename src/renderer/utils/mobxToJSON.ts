import JSON5 from 'json5';
import { toJS } from 'mobx';

export const mobxToJSON = (obj: any): string => JSON5.stringify(toJS(obj), null, 2);
