import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import ticketReducer from './slices/ticketSlice';
import messageReducer from './slices/messageSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        ticket: ticketReducer,
        message: messageReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['auth/setCredentials'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;