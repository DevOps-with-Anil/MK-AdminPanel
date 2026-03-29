// components/common/MultiLangTabs.tsx
import { Button } from '@/components/ui/button';
import { LANGUAGES, Language } from '@/i18n/languages';

interface Props {
  currentLang: Language;
  onChange: (lang: Language) => void;
}

export function MultiLangTabs({ currentLang, onChange }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      {Object.entries(LANGUAGES).map(([key, lang]) => (
        <Button
      key={key}
      size="sm"
      variant={currentLang === key ? 'default' : 'outline'}
      onClick={() => onChange(key as Language)}
    >
      <span className="flex items-center gap-1">
        <span className="text-base leading-none">{lang.flag}</span>
        <span>{lang.label}</span>
      </span>
    </Button>
      ))}
    </div>
  );
}