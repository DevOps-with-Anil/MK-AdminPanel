// utils/multilang.ts

import {
    LANGUAGES,
    DEFAULT_LANGUAGE,
    Language
} from "@/i18n/languages";

export type MultiLangText =
    Record<Language, string>;

/* =========================================================
CREATE EMPTY MULTILANG OBJECT
========================================================= */

export const createMultiLangObject = <T = string>(
    defaultValue: T = "" as T
): Record<Language, T> => {

    return Object.keys(LANGUAGES).reduce(
        (acc, lang) => {

            acc[lang as Language] = defaultValue;

            return acc;

        },
        {} as Record<Language, T>
    );
};

/* =========================================================
NORMALIZE MULTILANG VALUE
========================================================= */

export const normalizeMultiLang = <T = string>(
    value?: T | Partial<Record<Language, T>> | null,
    fallbackValue: T = "" as T
): Record<Language, T> => {

    if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
    ) {
        return {
            ...createMultiLangObject(fallbackValue),
            ...value
        };
    }

    return {
        ...createMultiLangObject(fallbackValue),

        [DEFAULT_LANGUAGE]:
            value ?? fallbackValue
    };
};