export type Errors = Record<string, any | any[]>;

export type Touched = Record<string, boolean>;

export type ValidateData = {
  fields: string[];
  type: string;
  args?: any[];
};

export type BeforeSubmitData = {
  // Loose type b/c this is the uncast form value
  value: any | undefined;
  errors: Errors;
};
