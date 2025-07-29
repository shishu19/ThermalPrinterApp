// types.ts
export type RootStackParamList = {
  Home: undefined;
  Setting: undefined;
  EmployeeForm: {
    id?: string;
    name?: string;
    date?: string;
    amount?: string;
    receiver?: string;
    mobile?: string;
    paymentMode?: string;
    status?: string;
    mode?: 'add' | 'edit';
  };
};
