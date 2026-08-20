import {createContext, useContext} from 'react';
import type {ApiTarget} from './configuration';

const ApiTargetContext = createContext<ApiTarget | null>(null);

export const ApiTargetProvider = ApiTargetContext.Provider;

export const useApiTarget = (): ApiTarget => {
    const target = useContext(ApiTargetContext);

    if (target === null) {
        throw new Error('No API target available in this part of the tree.');
    }

    return target;
};
