import { createContext } from 'react';

export interface IBreadcrumbItem {
  route?: string;
  title: string;
}

export interface BreadcrumbContextProviderProps {
  children: JSX.Element;
}

export type Action = {
  action: 'ADD' | 'REMOVE' | 'RESET';
  payload: IBreadcrumbItem[];
};

export interface IBreadcrumb {
  breadcrumbItems: IBreadcrumbItem[];
  breadcrumbDispatch: React.Dispatch<Action>;
}

const BreadcrumbContext = createContext<IBreadcrumb>({
  breadcrumbItems: [],
  breadcrumbDispatch: () => null,
});

export default BreadcrumbContext;
