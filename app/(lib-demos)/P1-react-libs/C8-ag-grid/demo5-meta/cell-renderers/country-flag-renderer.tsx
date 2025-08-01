import { ICellRendererParams } from "ag-grid-community";

interface CountryFlagRendererProps extends ICellRendererParams {
  value: string;
}

export const CountryFlagRenderer: React.FC<CountryFlagRendererProps> = (
  props,
) => {
  // A simple map to get emoji flags. In a real app, you might use image URLs.
  const countryFlagMap: { [key: string]: string } = {
    "United States": "🇺🇸",
    "United Kingdom": "🇬🇧",
    Australia: "🇦🇺",
    Canada: "🇨🇦",
    Ireland: "🇮🇪",
    Germany: "🇩🇪",
    Japan: "🇯🇵",
  };

  return (
    <span
      data-testid="country-flag-renderer"
      style={{ display: "flex", alignItems: "center", height: "100%" }}
    >
      {countryFlagMap[props.value] && (
        <span style={{ marginRight: "8px", fontSize: "1.2em" }}>
          {countryFlagMap[props.value]}
        </span>
      )}
      {props.value}
    </span>
  );
};
