import { Reducer, useContext, useReducer } from 'react';
import BreadcrumbContext, {
  Action,
  BreadcrumbContextProviderProps,
  IBreadcrumb,
  IBreadcrumbItem,
} from './BreadcrumbContext';

const BreadcrumbReducer: Reducer<IBreadcrumb, Action> = (
  state: IBreadcrumb,
  action: Action
) => {
  switch (action.action) {
    case 'ADD': {
      return {
        ...state,
        breadcrumbItems: [...state.breadcrumbItems, ...action.payload],
      };
    }
    case 'REMOVE': {
      const toBeRemovedRoutes = action.payload
        .map((breadcrumbItem) => breadcrumbItem.route)
        .filter((_) => _ !== undefined);
      const toBeLeftItems = state.breadcrumbItems.filter(
        (item) => !toBeRemovedRoutes.includes(item.route)
      );
      return {
        ...state,
        breadcrumbItems: toBeLeftItems,
      };
    }
    case 'MOVE': {
      const toBeKeptRoutes: IBreadcrumbItem[] = [];
      let isEnd = false;
      for (let index = 0; index < state.breadcrumbItems.length; index++) {
        const element = state.breadcrumbItems[index];
        if (!isEnd) toBeKeptRoutes.push(element);
        if (element.route === action.payload[0].route) {
          isEnd = true;
          continue;
        }
      }

      return {
        ...state,
        breadcrumbItems: toBeKeptRoutes,
      };
    }
    case 'RESET': {
      return {
        ...state,
        breadcrumbItems: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

function BreadcrumbContextProvider({
  children,
}: BreadcrumbContextProviderProps): JSX.Element {
  const initialState: IBreadcrumb = {
    breadcrumbItems: [],
    breadcrumbDispatch: () => null,
  };

  const [breadcrumbState, breadcrumbDispatch] = useReducer(
    BreadcrumbReducer,
    initialState
  );
  const value = {
    breadcrumbItems: breadcrumbState.breadcrumbItems,
    breadcrumbDispatch: breadcrumbDispatch,
  };

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export default BreadcrumbContextProvider;

export const useBreadcrumb = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error(
      'useAppTheme must be used as a descendant of ThemeContextProvider'
    );
  } else return context.breadcrumbItems;
};

export function useDispatchBreadcrumb() {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error(
      'useAppTheme must be used as a descendant of ThemeContextProvider'
    );
  } else return context.breadcrumbDispatch;
}
