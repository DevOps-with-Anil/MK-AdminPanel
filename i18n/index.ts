export const loadLocale = async (lang?: string): Promise<{ translate: Record<string, any> }> => {
  const language = lang || 'en'; // default to English
  try {
    const module = await import(`./locales/${language}.json`);
    return {
      translate: module.default,
    };
  } catch (error) {
    console.error(`Failed to load locale for language: ${language}`, error);
    // fallback to English if the requested language fails
    if (language !== 'en') {
      const fallback = await import(`./locales/en.json`);
      return { translate: fallback.default };
    }
    return { translate: {} }; // fallback empty if even English fails
  }
};