import React, { createContext, useContext, useReducer } from 'react';
import societyService from '../services/societyService';
import { useAuth } from './AuthContext';

const SocietyContext = createContext(null);

const initialState = {
  societies: [],
  selectedSocietyCode: null,
  society: null,
  buildings: [],
  flats: [],
  residents: [],
  loading: false,
  error: null,
};

const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SOCIETIES: 'SET_SOCIETIES',
  SET_SELECTED_SOCIETY_CODE: 'SET_SELECTED_SOCIETY_CODE',
  SET_SOCIETY: 'SET_SOCIETY',
  SET_BUILDINGS: 'SET_BUILDINGS',
  SET_FLATS: 'SET_FLATS',
  SET_RESIDENTS: 'SET_RESIDENTS',
  ADD_BUILDING: 'ADD_BUILDING',
  ADD_FLAT: 'ADD_FLAT',
  UPDATE_FLAT: 'UPDATE_FLAT',
  ADD_RESIDENT: 'ADD_RESIDENT',
  UPDATE_RESIDENT: 'UPDATE_RESIDENT',
};

const societyReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ACTIONS.SET_SOCIETIES:
      return { ...state, societies: action.payload };
    case ACTIONS.SET_SELECTED_SOCIETY_CODE:
      return {
        ...state,
        selectedSocietyCode: action.payload,
        society: null,
        buildings: [],
        flats: [],
        residents: [],
      };
    case ACTIONS.SET_SOCIETY:
      return { ...state, society: action.payload, loading: false };
    case ACTIONS.SET_BUILDINGS:
      return { ...state, buildings: action.payload, loading: false };
    case ACTIONS.SET_FLATS:
      return { ...state, flats: action.payload, loading: false };
    case ACTIONS.SET_RESIDENTS:
      return { ...state, residents: action.payload, loading: false };
    case ACTIONS.ADD_BUILDING:
      return { ...state, buildings: [...state.buildings, action.payload] };
    case ACTIONS.ADD_FLAT:
      return { ...state, flats: [...state.flats, action.payload] };
    case ACTIONS.UPDATE_FLAT:
      return {
        ...state,
        flats: state.flats.map((f) =>
          f.id === action.payload.id ? { ...f, ...action.payload } : f,
        ),
      };
    case ACTIONS.ADD_RESIDENT:
      return { ...state, residents: [...state.residents, action.payload] };
    case ACTIONS.UPDATE_RESIDENT:
      return {
        ...state,
        residents: state.residents.map((r) =>
          r.id === action.payload.id ? { ...r, ...action.payload } : r,
        ),
      };
    default:
      return state;
  }
};

export const SocietyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(societyReducer, initialState);
  const { user } = useAuth();

  const loadSocieties = async () => {
    const canViewAllSocieties = user?.role === 'admin' || user?.role === 'super_admin';

    if (canViewAllSocieties) {
      const result = await societyService.getSocieties();
      if (result.success) {
        dispatch({ type: ACTIONS.SET_SOCIETIES, payload: result.data });
        const savedCode = await societyService.getSelectedSocietyCode();
        if (savedCode) {
          dispatch({ type: ACTIONS.SET_SELECTED_SOCIETY_CODE, payload: savedCode });
        } else if (result.data.length > 0) {
          await selectSociety(result.data[0].code);
        }
      }
      return;
    }

    // For manager/resident/security: show only their own society
    const currentSociety = await societyService.getSociety();
    if (currentSociety.success && currentSociety.data) {
      dispatch({ type: ACTIONS.SET_SOCIETIES, payload: [currentSociety.data] });
      const savedCode = await societyService.getSelectedSocietyCode();
      const societyCode = currentSociety.data.code;
      if (savedCode) {
        dispatch({ type: ACTIONS.SET_SELECTED_SOCIETY_CODE, payload: savedCode });
      } else if (societyCode) {
        await selectSociety(societyCode);
      }
    }
  };

  const selectSociety = async (code) => {
    const normalizedCode = code ? String(code).trim().toUpperCase() : null;
    await societyService.setSelectedSocietyCode(normalizedCode);
    dispatch({ type: ACTIONS.SET_SELECTED_SOCIETY_CODE, payload: normalizedCode });
  };

  const createSociety = async (society) => {
    const result = await societyService.createSociety(society);
    if (result.success) {
      dispatch({ type: ACTIONS.SET_SOCIETIES, payload: [...state.societies, result.data] });
      await selectSociety(result.data.code);
      return result.data;
    }
    return null;
  };

  const loadSociety = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    const result = await societyService.getSociety();
    if (result.success) {
      dispatch({ type: ACTIONS.SET_SOCIETY, payload: result.data });
    }
  };

  const loadBuildings = async () => {
    const result = await societyService.getBuildings();
    if (result.success) {
      dispatch({ type: ACTIONS.SET_BUILDINGS, payload: result.data });
    }
  };

  const loadFlats = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    const result = await societyService.getFlats();
    if (result.success) {
      dispatch({ type: ACTIONS.SET_FLATS, payload: result.data });
    }
  };

  const loadResidents = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    const result = await societyService.getResidents();
    if (result.success) {
      dispatch({ type: ACTIONS.SET_RESIDENTS, payload: result.data });
    }
  };

  const addBuilding = async (building) => {
    const result = await societyService.addBuilding(building);
    if (result.success) {
      dispatch({ type: ACTIONS.ADD_BUILDING, payload: result.data });
      return true;
    }
    return false;
  };

  const addFlat = async (flat) => {
    const result = await societyService.addFlat(flat);
    if (result.success) {
      dispatch({ type: ACTIONS.ADD_FLAT, payload: result.data });
      return true;
    }
    return false;
  };

  const updateFlat = async (flatId, updates) => {
    const result = await societyService.updateFlat(flatId, updates);
    if (result.success) {
      dispatch({ type: ACTIONS.UPDATE_FLAT, payload: result.data });
      return true;
    }
    return false;
  };

  const addResident = async (resident) => {
    const result = await societyService.addResident(resident);
    if (result.success) {
      dispatch({ type: ACTIONS.ADD_RESIDENT, payload: result.data });
      return true;
    }
    return false;
  };

  const updateSociety = async (updates) => {
    const result = await societyService.updateSociety(updates);
    if (result.success) {
      dispatch({ type: ACTIONS.SET_SOCIETY, payload: result.data });
      return true;
    }
    return false;
  };

  return (
    <SocietyContext.Provider
      value={{
        ...state,
        loadSocieties,
        selectSociety,
        createSociety,
        loadSociety,
        loadBuildings,
        loadFlats,
        loadResidents,
        addBuilding,
        addFlat,
        updateFlat,
        addResident,
        updateSociety,
      }}
    >
      {children}
    </SocietyContext.Provider>
  );
};

export const useSociety = () => {
  const context = useContext(SocietyContext);
  if (!context) {
    throw new Error('useSociety must be used within a SocietyProvider');
  }
  return context;
};

export default SocietyContext;
