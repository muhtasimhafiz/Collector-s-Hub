import React from "react";
import Select, { SingleValue, StylesConfig } from "react-select";
import Image from "next/image";

interface ProductDropDown {
  value: any;
  label: string;
  thumbnail: string;
}

interface CustomSelectProps {
  options: ProductDropDown[];
  onSelect: (selectedOption: SingleValue<ProductDropDown>) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, onSelect }) => {
  const customStyles: StylesConfig<ProductDropDown, false> = {
    option: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      padding: "10px",
    }),
    singleValue: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
    }),
    control: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  const formatOptionLabel = ({ label, thumbnail }: ProductDropDown) => (
    <div className="flex items-center">
      <Image
        src={thumbnail}
        alt={label}
        className="w-6 h-6 mr-2"
        width={24}
        height={24}
      />
      <span>{label}</span>
    </div>
  );

  return (
    <div className="w-full">
      <Select
        options={options}
        styles={customStyles}
        formatOptionLabel={formatOptionLabel}
        className="w-full"
        onChange={(selectedOption) => {
          if (selectedOption) {
            onSelect(selectedOption.value);
          }
        }}
      />
    </div>
  );
};

export default CustomSelect;
