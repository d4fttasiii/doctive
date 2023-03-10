# Swagger TypeScript code generator

NOTE: This is a clone of https://github.com/areijngoudt/swagger-ts-generator

Node module to generate TypeScript code based on Webapi meta data in Swagger v2 format.

# Setup

Download the module with npm:

```bash
npm install --save-dev swagger-ts-generator
```

# Usage in NodeJS

Create a simple `.js` file and run it using `node path/to/file.js`

You can then run this from `npm` by adding the `node` line from above as a task in your `package.json`

```typescript
const { generateTSFiles } = require("swagger-ts-generator");

const config = {
  file: __dirname + "//swagger.json"
};

generateTSFiles(
  config.file, // This can be either a file containing the Swagger json or the Swagger object itself
  {
    modelFolder: "./path/to/models",
    enumTSFile: "./path/to/models/enums.ts"
    // + optionally more configuration
  }
);
```

# Generated files

## `*.model.ts`

For each definition in the Swagger an Interface and a Class are generated.
The class contains the `$FormGroup` property to be used in the Angular FormBuilder to make a model driven form.
The controls in the `FormGroup` contain the validators which implement the validation rules from the Swagger defnition.

Properties of an enum type are generated referencing this type which are generated in the next section.

This is an example of a generated TypeScript file with one model (definition) from the Swagger file:

```typescript
/**
 * This file is generated by the SwaggerTSGenerator.
 * Do not edit.
 */
/* tslint:disable */

import { type } from "./enums";
import { gender } from "./enums";
import { Address } from "./address.model";
import { Veterinarian } from "./veterinarian.model";
import { Tag } from "./tag.model";
import { NullableOrEmpty } from "./nullable-or-empty.model";

export interface IPet {
  name: string;
  age?: number;
  dob?: Date;
  type: type;
  gender?: gender;
  address?: Address;
  vet?: Veterinarian;
  tags?: Array<Tag>;
  isFavorate?: boolean;
  testDate?: NullableOrEmpty<Date>;
  primitiveArray?: Array<string>;
}

export class Pet extends BaseModel implements IPet {
  name: string;
  age: number;
  dob: Date;
  type: type;
  gender: gender;
  address: Address;
  vet: Veterinarian;
  tags: Array<Tag>;
  isFavorate: boolean;
  testDate: NullableOrEmpty<Date>;
  primitiveArray: Array<string>;
}
```

## Custom models

For custom models you can use the following data in your HBS template

```typescript
interface TemplateData {
  generateClasses: boolean;
  hasComplexType: boolean;
  validatorFileName: string;
  baseModelFileName: string;
  moduleName: string;
  enumModuleName: string;
  enumRef: string;
  subTypePropertyName: string;
  type: Type;
}

// Where Type is the following interface
interface Type {
  fileName: string;
  typeName: string;
  namespace: string;
  fullNamespace: string;
  fullTypeName: string;
  isSubType: boolean;
  baseType: Type;
  baseImportFile: string;
  path: string;
  pathToRoot: string;
  properties: TypeProperty[];
}

interface TypeProperty {
  name: string;
  typeName: string;
  namespace: string;
  description: string;
  hasValidation: boolean;
  isComplexType: boolean;
  isImportType: boolean;
  isUniqueImportType: boolean;
  importType: string;
  importFile: string;
  isEnum: boolean;
  isUniqueImportEnumType: boolean;
  importEnumType: string;
  isArray: boolean;
  isArrayComplexType: boolean;
  arrayTypeName: string;
  validators: {
    validation: {
      required: boolean;
      minimum: number;
      maximum: number;
      enum: string;
      minLength: number;
      maxLength: number;
      pattern: string;
    };
    validatorArray: string[];
  };
  enum: string[];
}
```
## `index.ts`

This barrel file contains references to all generated files.
