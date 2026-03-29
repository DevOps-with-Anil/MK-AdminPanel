// components/common/MultiLangTextarea.tsx
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Language } from '@/i18n/languages';
import { MultiLangText } from '@/types/i18n';

interface Props {
  label: string;
  value: MultiLangText;
  currentLang: Language;
  onChange: (lang: Language, value: string) => void;
  error?: string;
  rows?: number; // optional control
}

export function MultiLangTextarea({
  label,
  value,
  currentLang,
  onChange,
  error,
  rows = 4,
}: Props) {
  return (
    <div className="space-y-2">
      <Label>
        {label} ({currentLang.toUpperCase()})
      </Label>

      <Textarea
        rows={rows}
        value={value[currentLang] || ''}
        onChange={e => onChange(currentLang, e.target.value)}
      />

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}