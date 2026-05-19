import { Input } from "@/components/ui/input";
import { getDateTimeLocalValue } from "@/utils/inputDate";


type Props = {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export const DateTimePicker = ({
  value,
  onChange,
  disabled,
}: Props) => {
  return (
    <Input
      type="datetime-local"
      disabled={disabled}
      value={getDateTimeLocalValue(value)}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};