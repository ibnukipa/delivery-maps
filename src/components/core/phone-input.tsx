import ThemedTextInput, {
  ThemedTextInputProps,
} from "@/components/core/themed-text-input";
import { forwardRef, useImperativeHandle, useState } from "react";

type PhoneInputProps = Omit<ThemedTextInputProps, "type">;

export type PhoneInputHandle = {
  validate: () => boolean;
  clear: () => void;
  getRawValue: () => string;
};

const COUNTRY_RULES: Record<string, {
  name: string;
  minDigits: number;
  maxDigits: number;
  format: number[];
}> = {
  "1":   { name: "US/CA",          minDigits: 10, maxDigits: 10, format: [3, 3, 4]    },
  "7":   { name: "RU/KZ",          minDigits: 10, maxDigits: 10, format: [3, 3, 4]    },
  "20":  { name: "Egypt",          minDigits: 10, maxDigits: 10, format: [2, 4, 4]    },
  "27":  { name: "South Africa",   minDigits: 9,  maxDigits: 9,  format: [2, 3, 4]    },
  "30":  { name: "Greece",         minDigits: 10, maxDigits: 10, format: [2, 4, 4]    },
  "31":  { name: "Netherlands",    minDigits: 9,  maxDigits: 9,  format: [2, 3, 4]    },
  "32":  { name: "Belgium",        minDigits: 8,  maxDigits: 9,  format: [2, 2, 2, 2] },
  "33":  { name: "France",         minDigits: 9,  maxDigits: 9,  format: [2, 2, 2, 3] },
  "34":  { name: "Spain",          minDigits: 9,  maxDigits: 9,  format: [3, 3, 3]    },
  "36":  { name: "Hungary",        minDigits: 8,  maxDigits: 9,  format: [2, 3, 4]    },
  "39":  { name: "Italy",          minDigits: 6,  maxDigits: 11, format: [3, 4, 4]    },
  "40":  { name: "Romania",        minDigits: 9,  maxDigits: 9,  format: [3, 3, 3]    },
  "41":  { name: "Switzerland",    minDigits: 9,  maxDigits: 9,  format: [2, 3, 4]    },
  "43":  { name: "Austria",        minDigits: 4,  maxDigits: 12, format: [4, 4, 4]    },
  "44":  { name: "UK",             minDigits: 10, maxDigits: 10, format: [4, 3, 3]    },
  "45":  { name: "Denmark",        minDigits: 8,  maxDigits: 8,  format: [2, 2, 2, 2] },
  "46":  { name: "Sweden",         minDigits: 7,  maxDigits: 9,  format: [3, 3, 3]    },
  "47":  { name: "Norway",         minDigits: 8,  maxDigits: 8,  format: [3, 2, 3]    },
  "48":  { name: "Poland",         minDigits: 9,  maxDigits: 9,  format: [3, 3, 3]    },
  "49":  { name: "Germany",        minDigits: 3,  maxDigits: 12, format: [3, 4, 4]    },
  "51":  { name: "Peru",           minDigits: 9,  maxDigits: 9,  format: [3, 3, 3]    },
  "52":  { name: "Mexico",         minDigits: 10, maxDigits: 10, format: [2, 4, 4]    },
  "53":  { name: "Cuba",           minDigits: 8,  maxDigits: 8,  format: [4, 4]       },
  "54":  { name: "Argentina",      minDigits: 10, maxDigits: 10, format: [3, 3, 4]    },
  "55":  { name: "Brazil",         minDigits: 10, maxDigits: 11, format: [2, 4, 4]    },
  "56":  { name: "Chile",          minDigits: 9,  maxDigits: 9,  format: [1, 4, 4]    },
  "57":  { name: "Colombia",       minDigits: 10, maxDigits: 10, format: [3, 3, 4]    },
  "58":  { name: "Venezuela",      minDigits: 10, maxDigits: 10, format: [3, 3, 4]    },
  "60":  { name: "Malaysia",       minDigits: 7,  maxDigits: 9,  format: [2, 4, 4]    },
  "61":  { name: "Australia",      minDigits: 9,  maxDigits: 9,  format: [3, 3, 3]    },
  "62":  { name: "Indonesia",      minDigits: 5,  maxDigits: 12, format: [3, 4, 4]    },
  "63":  { name: "Philippines",    minDigits: 10, maxDigits: 10, format: [3, 3, 4]    },
  "64":  { name: "New Zealand",    minDigits: 8,  maxDigits: 10, format: [3, 3, 4]    },
  "65":  { name: "Singapore",      minDigits: 8,  maxDigits: 8,  format: [4, 4]       },
  "66":  { name: "Thailand",       minDigits: 8,  maxDigits: 9,  format: [2, 3, 4]    },
  "81":  { name: "Japan",          minDigits: 9,  maxDigits: 10, format: [3, 4, 4]    },
  "82":  { name: "South Korea",    minDigits: 9,  maxDigits: 10, format: [2, 4, 4]    },
  "84":  { name: "Vietnam",        minDigits: 9,  maxDigits: 10, format: [3, 3, 4]    },
  "86":  { name: "China",          minDigits: 11, maxDigits: 11, format: [3, 4, 4]    },
  "90":  { name: "Turkey",         minDigits: 10, maxDigits: 10, format: [3, 3, 4]    },
  "91":  { name: "India",          minDigits: 10, maxDigits: 10, format: [5, 5]       },
  "92":  { name: "Pakistan",       minDigits: 10, maxDigits: 10, format: [3, 3, 4]    },
  "93":  { name: "Afghanistan",    minDigits: 9,  maxDigits: 9,  format: [2, 3, 4]    },
  "94":  { name: "Sri Lanka",      minDigits: 9,  maxDigits: 9,  format: [2, 3, 4]    },
  "95":  { name: "Myanmar",        minDigits: 7,  maxDigits: 10, format: [3, 3, 4]    },
  "98":  { name: "Iran",           minDigits: 10, maxDigits: 10, format: [3, 3, 4]    },
  "212": { name: "Morocco",        minDigits: 9,  maxDigits: 9,  format: [2, 3, 4]    },
  "213": { name: "Algeria",        minDigits: 9,  maxDigits: 9,  format: [2, 3, 4]    },
  "216": { name: "Tunisia",        minDigits: 8,  maxDigits: 8,  format: [2, 3, 3]    },
  "218": { name: "Libya",          minDigits: 9,  maxDigits: 9,  format: [2, 3, 4]    },
  "220": { name: "Gambia",         minDigits: 7,  maxDigits: 7,  format: [3, 4]       },
  "221": { name: "Senegal",        minDigits: 9,  maxDigits: 9,  format: [2, 3, 4]    },
  "234": { name: "Nigeria",        minDigits: 8,  maxDigits: 10, format: [3, 3, 4]    },
  "254": { name: "Kenya",          minDigits: 9,  maxDigits: 9,  format: [3, 3, 3]    },
  "255": { name: "Tanzania",       minDigits: 9,  maxDigits: 9,  format: [3, 3, 3]    },
  "256": { name: "Uganda",         minDigits: 9,  maxDigits: 9,  format: [3, 3, 3]    },
  "260": { name: "Zambia",         minDigits: 9,  maxDigits: 9,  format: [2, 3, 4]    },
  "263": { name: "Zimbabwe",       minDigits: 9,  maxDigits: 9,  format: [2, 3, 4]    },
  "351": { name: "Portugal",       minDigits: 9,  maxDigits: 9,  format: [3, 3, 3]    },
  "352": { name: "Luxembourg",     minDigits: 6,  maxDigits: 9,  format: [3, 3, 3]    },
  "353": { name: "Ireland",        minDigits: 7,  maxDigits: 9,  format: [2, 3, 4]    },
  "354": { name: "Iceland",        minDigits: 7,  maxDigits: 7,  format: [3, 4]       },
  "358": { name: "Finland",        minDigits: 5,  maxDigits: 11, format: [2, 4, 4]    },
  "380": { name: "Ukraine",        minDigits: 9,  maxDigits: 9,  format: [2, 3, 4]    },
  "381": { name: "Serbia",         minDigits: 8,  maxDigits: 9,  format: [2, 3, 4]    },
  "385": { name: "Croatia",        minDigits: 8,  maxDigits: 9,  format: [2, 3, 4]    },
  "386": { name: "Slovenia",       minDigits: 8,  maxDigits: 8,  format: [2, 3, 3]    },
  "420": { name: "Czech Republic", minDigits: 9,  maxDigits: 9,  format: [3, 3, 3]    },
  "421": { name: "Slovakia",       minDigits: 9,  maxDigits: 9,  format: [3, 3, 3]    },
  "966": { name: "Saudi Arabia",   minDigits: 9,  maxDigits: 9,  format: [2, 3, 4]    },
  "971": { name: "UAE",            minDigits: 9,  maxDigits: 9,  format: [2, 3, 4]    },
  "972": { name: "Israel",         minDigits: 8,  maxDigits: 9,  format: [2, 3, 4]    },
  "973": { name: "Bahrain",        minDigits: 8,  maxDigits: 8,  format: [4, 4]       },
  "974": { name: "Qatar",          minDigits: 8,  maxDigits: 8,  format: [4, 4]       },
  "975": { name: "Bhutan",         minDigits: 7,  maxDigits: 8,  format: [2, 2, 3]    },
  "976": { name: "Mongolia",       minDigits: 8,  maxDigits: 8,  format: [4, 4]       },
  "977": { name: "Nepal",          minDigits: 9,  maxDigits: 10, format: [3, 3, 4]    },
};

const matchCountryCode = (digits: string) => {
  for (const len of [3, 2, 1]) {
    const code = digits.slice(0, len);
    if (COUNTRY_RULES[code]) return { code, rule: COUNTRY_RULES[code] };
  }
  return null;
};

const stripNonDigits = (value: string) => value.replace(/\D/g, "");

// Splits subscriber digits into groups and joins with spaces
const formatSubscriber = (subscriber: string, groups: number[]): string => {
  const parts: string[] = [];
  let cursor = 0;
  for (const size of groups) {
    if (cursor >= subscriber.length) break;
    parts.push(subscriber.slice(cursor, cursor + size));
    cursor += size;
  }
  // Any overflow digits beyond the defined groups go in a final chunk
  if (cursor < subscriber.length) parts.push(subscriber.slice(cursor));
  return parts.join(" ");
};

const formatPhone = (raw: string): string => {
  const digits = stripNonDigits(raw);
  if (!digits) return "";
  
  const match = matchCountryCode(digits);
  if (!match) return raw.startsWith("+") ? `+${digits}` : digits;
  
  const { code, rule } = match;
  const subscriber = digits.slice(code.length);
  const formattedSubscriber = formatSubscriber(subscriber, rule.format);
  
  return formattedSubscriber
    ? `+${code} ${formattedSubscriber}`
    : `+${code}`;
};

export const validatePhone = (raw: string): string | null => {
  if (!raw) return null;
  
  const digits = stripNonDigits(raw);
  
  if (digits.length < 7) return "Phone number is too short";
  
  if (raw.trim()[0] !== "+" && /\D/.test(raw.trim())) {
    return "Use digits only, or start with +";
  }
  
  const match = matchCountryCode(digits);
  if (!match) return "Unrecognised country code";
  
  const subscriberDigits = digits.slice(match.code.length);
  const { name, minDigits, maxDigits } = match.rule;
  
  if (subscriberDigits.length < minDigits) {
    return `${name} numbers need at least ${minDigits} digits after +${match.code}`;
  }
  if (subscriberDigits.length > maxDigits) {
    return `${name} numbers can't exceed ${maxDigits} digits after +${match.code}`;
  }
  
  return null;
};

const PhoneInput = forwardRef<PhoneInputHandle, PhoneInputProps>(({
  onChangeText,
  onBlur,
  ...rest
}, ref) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  useImperativeHandle(ref, () => ({
    validate: () => {
      const err = validatePhone(value);
      setError(err);
      return err === null && value.length > 0;
    },
    clear: () => {
      setValue("");
      setError(null);
    },
    getRawValue: () => stripNonDigits(value),
  }));
  
  const handleChangeText = (text: string) => {
    const formatted = formatPhone(text);
    setValue(formatted);
    onChangeText?.(formatted);
  };
  
  const handleBlur = (e: any) => {
    const err = validatePhone(value);
    setError(err);
    onBlur?.(e);
  };
  
  return (
    <ThemedTextInput
      {...rest}
      type="text"
      keyboardType="phone-pad"
      autoComplete="tel"
      autoCorrect={false}
      autoCapitalize="none"
      value={value}
      themeColor={error ? "error" : undefined}
      error={error ?? undefined}
      onChangeText={handleChangeText}
      onBlur={handleBlur}
    />
  );
});

export default PhoneInput;
