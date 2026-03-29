// components/common/MultiLangInput.tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Language } from '@/i18n/languages';
import { MultiLangText } from '@/types/i18n';

interface Props {
  label: string;
  value: MultiLangText;
  currentLang: Language;
  onChange: (lang: Language, value: string) => void;
  error?: string;
}

export function MultiLangInput({
  label,
  value,
  currentLang,
  onChange,
  error,
}: Props) {
  return (
    <div className="space-y-2">
      <Label>
        {label} ({currentLang.toUpperCase()})
      </Label>
      <Input
        value={value[currentLang] || ''}
        onChange={e => onChange(currentLang, e.target.value)}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}