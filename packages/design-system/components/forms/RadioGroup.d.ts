/** Native radios with the themed accent dot. */
export interface RadioOption { value: string; label: string; }
export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  label?: string;
}
export declare function RadioGroup(props: RadioGroupProps): JSX.Element;
