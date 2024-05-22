import React from 'react';
import Select, { MultiValue, StylesConfig } from 'react-select';
import Image from 'next/image';

interface ProductDropDown {
  value: any;
  label: string;
  thumbnail: string;
}

interface CustomMultiSelectProps {
  options: ProductDropDown[];
  onSelect: (selectedOptions: MultiValue<ProductDropDown>) => void;
}

const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({ options, onSelect }) => {
  const customStyles: StylesConfig<ProductDropDown, true> = {
    option: (provided) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
    }),
    singleValue: (provided) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
    }),
    control: (provided) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    multiValue: (provided) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
    }),
  };

  const formatOptionLabel = ({ label, thumbnail }: ProductDropDown) => (
    <div className="flex items-center">
      <Image src={thumbnail} alt={label} className="w-6 h-6 mr-2" width={24} height={24} />
      <span>{label}</span>
    </div>
  );

  return (
    <div className="w-full">
      <Select
        isMulti
        options={options}
        styles={customStyles}
        formatOptionLabel={formatOptionLabel}
        className="w-full"
        onChange={onSelect}
      />
    </div>
  );
};

export default CustomMultiSelect;
