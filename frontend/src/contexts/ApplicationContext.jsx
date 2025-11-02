import { createContext, useContext, useReducer, useEffect } from "react";
import { applicationsAPI } from "../services/api";
import { useAuth } from "./AuthContext";

const ApplicationContext = createContext();

const initialState = {
  applications: [],
  isLoading: false,
  error: null,
  stats: {
    total: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  },
};

// Action types
const actionTypes = {
  FETCH_APPLICATIONS: "FETCH_APPLICATIONS",
  ADD_APPLICATION: "ADD_APPLICATION",
  UPDATE_APPLICATION: "UPDATE_APPLICATION",
  DELETE_APPLICATION: "DELETE_APPLICATION",
  RESET_APPLICATIONS: "RESET_APPLICATIONS",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_STATS: "SET_STATS",
};

// Reducer
function applicationReducer(state, action) {
  switch (action.type) {
    case actionTypes.FETCH_APPLICATIONS:
      return { ...state, applications: action.payload, isLoading: false };

    case actionTypes.ADD_APPLICATION:
      return { ...state, applications: [...state.applications, action.payload] };

    case actionTypes.UPDATE_APPLICATION:
      return {
        ...state,
        applications: state.applications.map((app) =>
          app._id === action.payload._id ? action.payload : app
        ),
      };

    case actionTypes.DELETE_APPLICATION:
      return {
        ...state,
        applications: state.applications.filter((app) => app._id !== action.payload),
      };

    case actionTypes.RESET_APPLICATIONS:
      return { ...state, applications: [], stats: initialState.stats };

    case actionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };

    case actionTypes.SET_STATS:
      return { ...state, stats: action.payload };

    default:
      return state;
  }
}

export function ApplicationProvider({ children }) {
  const [state, dispatch] = useReducer(applicationReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // ✅ Fetch applications when user logs in
  useEffect(() => {
    const fetchApplications = async () => {
      if (!isAuthenticated || !user) {
        dispatch({ type: actionTypes.RESET_APPLICATIONS });
        return;
      }

      dispatch({ type: actionTypes.SET_LOADING, payload: true });

      try {
        const applications = await applicationsAPI.getAll();
        dispatch({ type: actionTypes.FETCH_APPLICATIONS, payload: applications });
      } catch (error) {
        console.error("Error fetching applications:", error);
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
      }
    };

    fetchApplications();
  }, [isAuthenticated, user]);

  // ✅ Recalculate stats when applications change
  useEffect(() => {
    const { applications } = state;
    const stats = {
      total: applications.length,
      applied: applications.filter((a) => a.status === "Applied").length,
      interview: applications.filter((a) => a.status === "Interview").length,
      offer: applications.filter((a) => a.status === "Offer").length,
      rejected: applications.filter((a) => a.status === "Rejected").length,
    };
    dispatch({ type: actionTypes.SET_STATS, payload: stats });
  }, [state.applications]);

  // ✅ Actions
  const addApplication = async (app) => {
    const newApp = await applicationsAPI.create(app);
    dispatch({ type: actionTypes.ADD_APPLICATION, payload: newApp });
  };

  const updateApplication = async (id, updates) => {
    const updatedApp = await applicationsAPI.update(id, updates);
    dispatch({ type: actionTypes.UPDATE_APPLICATION, payload: updatedApp });
  };

  const deleteApplication = async (id) => {
    await applicationsAPI.delete(id);
    dispatch({ type: actionTypes.DELETE_APPLICATION, payload: id });
  };

  const value = {
    ...state,
    addApplication,
    updateApplication,
    deleteApplication,
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplications() {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error("useApplications must be used within ApplicationProvider");
  }
  return context;
}
