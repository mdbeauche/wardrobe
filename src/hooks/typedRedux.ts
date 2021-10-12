import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// export const useTypedDispatch = () => useDispatch<TypedDispatch>();
export const useTypedDispatch = useDispatch;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
