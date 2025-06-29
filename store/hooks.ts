import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Hooks typés pour éviter de typer à chaque utilisation
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Hook pour accéder facilement à l'état d'authentification
export const useAuth = () => {
    return useAppSelector((state) => state.auth);
};

// Hook pour accéder aux données utilisateurs
export const useUsers = () => {
    return useAppSelector((state) => state.user);
};

// Hook pour accéder aux tickets
export const useTickets = () => {
    return useAppSelector((state) => state.ticket);
};

// Hook pour accéder aux messages
export const useMessages = () => {
    return useAppSelector((state) => state.message);
};