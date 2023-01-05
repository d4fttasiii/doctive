export interface GeneratorOptions {
  modelFolder: string;

  generateBarrelFiles?: boolean;
  generateClasses?: boolean;
  generateValidatorFile?: boolean;
  baseModelFileName?: string;
  subTypeFactoryFileName?: string;
  validatorsFileName?: string;
  exclude?: (string | RegExp)[];
  modelModuleName?: string;
  subTypePropertyName?: string;
  namespacePrefixesToRemove?: string[];
  typeNameSuffixesToRemove?: string[];
  typesToFilter?: string[];
  sortModelProperties?: boolean;

  templates?: {
    models?: string;
    barrel?: string;
  };
}
