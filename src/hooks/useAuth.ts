/**
 * useAuth hook — access auth state and methods
 */

import {useContext} from 'react';
import {AuthContext} from '../context/AuthContext';

export const useAuth = () => useContext(AuthContext);

export default useAuth;
